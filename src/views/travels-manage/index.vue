<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.keyword"
        placeholder="路书标题"
        prefix-icon="el-icon-search"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
      />
      <el-input
        v-model="query.nickname"
        placeholder="作者"
        prefix-icon="el-icon-search"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
      />
      <el-select
        v-model="query.length"
        placeholder="线路长短"
        clearable
        style="width: 120px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option label="短线" :value="1"/>
        <el-option label="中线" :value="2"/>
        <el-option label="长线" :value="3"/>
      </el-select>
      <el-select
        v-model="query.status"
        @change="handleFilter"
        placeholder="审核状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option label="未审核" :value="0"/>
        <el-option label="已通过" :value="1"/>
        <el-option label="未通过" :value="2"/>
      </el-select>
      <!-- <el-date-picker type="date" class="filter-item" placeholder="选择日期"></el-date-picker> -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="handleDeleteAll"
      >批量删除</el-button>
      <!-- <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-check"
        @click="handleFilter"
      >批量通过</el-button>-->
    </div>

    <el-table
      :data="tableData"
      border
      stripe
      fit
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" :index="index" label="序号" sortable width="50px"></el-table-column>
      <el-table-column prop="title" label="路书标题"></el-table-column>
      <el-table-column prop="publishTime" label="发表日期" :formatter="timeFormatter"></el-table-column>
      <el-table-column prop="username" label="作者"></el-table-column>
      <el-table-column prop="length" label="线路长短">
        <template slot-scope="scope">
          <span>{{scope.row.length|travelsTypeFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column align="middle" label="审核状态" width="90px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="mini">待审核</el-tag>
          <el-tag v-if="scope.row.status == 1" type="success" size="mini">已通过</el-tag>
          <el-tag v-if="scope.row.status == 2" type="warning" size="mini">未通过</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button @click="showReviewer(scope.row.id)">预览</el-button>
          <el-popover v-if="scope.row.status == 0" placement="top" trigger="click">
            <el-row>
              <el-button size="mini" type="success" @click="passTravels(scope.row.id,1)">通过</el-button>
              <el-button size="mini" type="warning" @click="passTravels(scope.row.id,2)">不通过</el-button>
            </el-row>
            <el-button slot="reference">审核</el-button>
          </el-popover>

          <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="query.page"
      :page-size="query.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- <el-dialog :visible.sync="dialogpass" width="30%" :before-close="handleClose">
      <span>是否通过</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogpass = false">取 消</el-button>
        <el-button type="primary" @click="dialogpass = false">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  getList,
  deleteTravels,
  updateTravels,
  validTravels
} from "@/api/travels.js";
import moment from "moment";

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    travelsTypeFilter: function(value) {
      switch (value) {
        case 1:
          return "短线";
        case 2:
          return "中线";
        case 3:
          return "长线";
        default:
          return "";
      }
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      query: {
        page: 1,
        pageSize: 10,
        status: "",
        orderBy: "",
        keyword: "",
        length: ""
      },
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
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          length: "长线"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          length: "长线"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          length: "长线"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          length: "长线"
        }
      ],
      multipleSelection: [],
      travels: {},
      dialogdelete: false,
      dialogpass: false
    };
  },
  created() {
    this.getTravelsList();
  },
  methods: {
    getTravelsList() {
      getList(this.query).then(resp => {
        this.tableData = resp.data;
        this.total = resp.total;
      });
    },
    showReviewer(id) {
      this.$router.push(`/travels-manage/travels/${id}`);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },

    handleSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.getTravelsList();
    },
    handleCurrentChange(curPage) {
      this.query.page = curPage;
      this.getTravelsList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleFilter() {
      this.query.page = 1;
      this.getTravelsList();
    },
    index(val) {
      return (this.query.page - 1) * this.query.pageSize + val + 1;
    },
    timeFormatter(row, column, cellValue, index) {
      return moment(cellValue - 8 * 3600 * 1000).format("YYYY-MM-DD HH:mm");
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除改项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTravels([id]).then(resp => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getTravelsList();
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
          deleteTravels(idArr).then(resp => {
            this.$notify({
              title: "成功",
              message: "批量删除成功",
              type: "success",
              duration: 2000
            });
            this.getTravelsList();
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
    passTravels(id, status) {
      this.$confirm(`${status == 1 ? "通过" : "取消通过"}该路书？`)
        .then(_ => {
          validTravels(id, status).then(resp => {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
            this.getTravelsList();
          });
        })
        .catch(_ => {});
    }
  }
};
</script>
