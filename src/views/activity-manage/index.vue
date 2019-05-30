<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.name" placeholder="活动名称" style="width: 200px;" class="filter-item"/>
      <el-input
        v-model="query.username"
        placeholder="发起人"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="query.type"
        placeholder="审核状态"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="getAcList"
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
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="活动名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="线路长短">
              <span>{{ props.row.theme }}</span>
            </el-form-item>
            <el-form-item label="出发地">
              <span>{{ props.row.startPlace }}</span>
            </el-form-item>
            <el-form-item label="目的地">
              <span>{{ props.row.destination }}</span>
            </el-form-item>
            <el-form-item label="费用">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="名额">
              <span>{{ props.row.quota }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" :index="index" sortable width="60px"></el-table-column>
      <el-table-column label="活动名称" prop="name"></el-table-column>
      <el-table-column label="活动时间" width="250px">
        <template slot-scope="scope">
          <span>{{scope.row.startDate|timeFormatter}}</span>-
          <span>{{scope.row.endDate|timeFormatter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人" prop="username"></el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.status|ActivityTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220px">
        <template>
          <el-button size="mini" @click="dialogpass = true">通过</el-button>
          <router-link :to="'/activity-manage/edit/'">
            <el-button type="success" plain size="mini">报名审核</el-button>
          </router-link>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="query.page"
      :page-size="query.pageSize"
      layout="prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog :visible.sync="dialogpass" width="30%">
      <span>是否通过</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogpass = false">取 消</el-button>
        <el-button type="primary" @click="dialogpass = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog :visible.sync="dialogdelete" width="30%">
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelete = false">取 消</el-button>
        <el-button type="primary" @click="dialogdelete = false">确 定</el-button>
      </span>
    </el-dialog>-->
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
import { getActivityList, deleteActivity } from "@/api/activity.js";
import moment from "moment";

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
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
        case 2:
          return "已通过";
        case 3:
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
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
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