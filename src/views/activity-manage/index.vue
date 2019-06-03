<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.keyword"
        placeholder="活动名称"
        style="width: 200px;"
        class="filter-item"
        prefix-icon="el-icon-search"
        @change="handleFilter"
      />
      <el-input
        v-model="query.user"
        placeholder="发起人"
        style="width: 200px;"
        class="filter-item"
        prefix-icon="el-icon-search"
        @change="handleFilter"
      />
      <el-select
        v-model="query.status"
        placeholder="审核状态"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="handleFilter"
      >
        <el-option label="未审核" :value="0"/>
        <el-option label="已通过" :value="1"/>
        <el-option label="未通过" :value="2"/>
      </el-select>
      <el-date-picker
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"
        style="width: 400px"
      ></el-date-picker>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="handleDeleteAll"
      >批量删除</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="活动名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="线路长短">
              <span>{{ props.row.theme|themeFilter }}</span>
            </el-form-item>
            <el-form-item label="出发地">
              <span>{{ props.row.startPlace }}</span>
            </el-form-item>
            <el-form-item label="目的地">
              <span>{{ props.row.destination }}</span>
            </el-form-item>
            <el-form-item label="费用">
              <span>{{ props.row.price }}/人</span>
            </el-form-item>
            <el-form-item label="名额">
              <span>{{ props.row.quota }}人</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" :index="index" sortable width="60px"></el-table-column>
      <el-table-column label="活动名称" prop="name" width="250px"></el-table-column>
      <el-table-column label="活动时间" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.startDate|timeFormatter}}</span>-
          <span>{{scope.row.endDate|timeFormatter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人" prop="username"></el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="mini">待审核</el-tag>
          <el-tag v-if="scope.row.status == 1" type="success" size="mini">已通过</el-tag>
          <el-tag v-if="scope.row.status == 2" type="warning" size="mini">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280px">
        <template slot-scope="scope">
          <el-button
            type="info"
            v-if="scope.row.role == 'admin'"
            plain
            @click="editAc(scope.row.id)"
          >编辑</el-button>
          <el-popover v-if="scope.row.status == 0" placement="top" trigger="click">
            <el-row>
              <el-button size="mini" type="success" @click="passActivity(scope.row.id,1)">通过</el-button>
              <el-button size="mini" type="warning" @click="passActivity(scope.row.id,2)">不通过</el-button>
            </el-row>
            <el-button slot="reference">审核</el-button>
          </el-popover>
          <router-link :to="`/activity-manage/edit/${scope.row.id}`">
            <el-button type="success" plain>报名审核</el-button>
          </router-link>
          <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="query.page"
      :page-size="query.pageSize"
      layout="total,prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog :visible.sync="dialogpass" width="30%">
      <span>是否通过</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogpass = false">取 消</el-button>
        <el-button type="primary" @click="dialogpass = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import moment from "moment";
import {
  getActivityList,
  deleteActivity,
  validActivity,
  updateActivity
} from "@/api/activity.js";
export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    themeFilter: function(value) {
      switch (value) {
        case 1:
          return "短线";
        case 2:
          return "中线";
        case 3:
          return "中线";
        case 4:
          return "其他";
        default:
          return "";
      }
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
    timeFormatter(cellValue) {
      return moment(cellValue - 8 * 3600 * 1000).format("YYYY/MM/DD");
    },
    ActivityTypeFilter: function(value) {
      switch (value) {
        case 0:
          return "未审核";
        case 1:
          return "已通过";
        case 2:
          return "未通过";
        default:
          return "";
      }
    }
  },
  data() {
    return {
      query: {
        page: 1,
        pageSize: 10,
        status: null,
        keyword: null,
        user: null,
        theme: null,
        startDate: null,
        endDate: null,
        orderBy: null
      },
      total: 0,
      list: null,
      listLoading: true,

      tableData: [
        {
          id: "1",
          title: "啦啦啦啦啦啦",
          time: "2019/05/11-2019/5/20",
          name: "王小虎",
          status: "审核中",
          length: "长线",
          start: "桂林",
          destination: "桂林",
          price: "AA",
          quota: "100人"
        },
        {
          id: "1",
          title: "啦啦啦啦啦啦",
          time: "2019/05/11-2019/5/20",
          name: "王小虎",
          status: "审核中",
          length: "长线",
          start: "桂林",
          destination: "桂林",
          price: "AA",
          quota: "100人"
        }
      ],
      multipleSelection: [],
      dialogdelete: false,
      dialogpass: false
    };
  },
  created() {
    this.listLoading = false;
    this.getAcList();
  },
  methods: {
    getAcList() {
      getActivityList(this.query).then(resp => {
        this.tableData = resp.data;
        this.total = resp.total;
      });
    },
    editAc(id) {
      this.$router.push("/activity-manage/xiugai/" + id);
    },
    handleDeleteAll() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "未选中任何项"
        });
        return;
      }

      this.$confirm("此操作将永久删除选中项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let idArr = [];
          this.multipleSelection.forEach(item => {
            idArr.push(item.id);
          });
          deleteActivity(idArr).then(resp => {
            this.$notify({
              title: "成功",
              message: "批量删除成功",
              type: "success",
              duration: 2000
            });
            this.getAcList();
          });
        })
        .catch(() => {
          this.$notify({
            message: "已取消删除",
            type: "info",
            duration: 2000
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除改项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteActivity([id]).then(resp => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getAcList();
          });
        })
        .catch(() => {
          this.$notify({
            message: "已取消删除",
            type: "info",
            duration: 2000
          });
        });
    },
    handleSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.getAcList();
    },
    handleCurrentChange(curPage) {
      this.query.page = curPage;
      this.getAcList();
    },
    index(val) {
      return (this.query.page - 1) * this.query.pageSize + val + 1;
    },
    handleFilter() {
      this.query.page = 1;
      this.getAcList();
    },
    passActivity(id, status) {
      this.$confirm(`${status == 1 ? "通过" : "取消通过"}该活动？`)
        .then(_ => {
          validActivity(id, status).then(resp => {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
            this.getAcList();
          });
        })
        .catch(_ => {});
    }
  }
};
</script>
<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>