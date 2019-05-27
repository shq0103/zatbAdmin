<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.title"
        placeholder="资讯标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="query.title"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="query.type"
        placeholder="类型"
        clearable
        style="width: 120px"
        class="filter-item"
        @change="getNewsList"
      >
        <el-option label="资讯" :value="1"/>
        <el-option label="户外技巧" :value="2"/>
        <el-option label="户外常识" :value="3"/>
        <el-option label="户外装备" :value="4"/>
      </el-select>
      <el-date-picker type="date" class="filter-item" placeholder="选择日期"></el-date-picker>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="handleDeleteAll"
      >批量删除</el-button>
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
      <el-table-column
        align="center"
        label="序号"
        type="index"
        :index="index"
        show-overflow-tooltip
        width="50"
      />
      <el-table-column prop="title" label="资讯标题"></el-table-column>
      <el-table-column prop="date" label="发表日期" :formatter="timeFormatter"></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.type|newsTypeFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link to="./new-manage/public"></router-link>
          <el-button size="mini">修改</el-button>
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
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { getList, deleteNews } from "@/api/news.js";
import moment from "moment";

export default {
  name: "ComplexTable",

  directives: { waves },
  filters: {
    newsTypeFilter: function(value) {
      switch (value) {
        case 1:
          return "资讯";
        case 2:
          return "户外技巧";
        case 3:
          return "户外常识";
        case 4:
          return "户外装备";
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
        type: null,
        orderBy: null
      },
      total: 0,
      tableData: [
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          type: "户外知识"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          type: "户外知识"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          type: "户外知识"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          type: "户外知识"
        }
      ]
    };
  },
  created() {
    this.getNewsList();
  },
  methods: {
    getNewsList() {
      getList(this.query).then(resp => {
        this.tableData = resp.data;
        this.total = resp.total;
      });
    },
    handleSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.getNewsList();
    },
    handleCurrentChange(curPage) {
      this.query.page = curPage;
      this.getNewsList();
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
          deleteNews(idArr).then(resp => {
            this.$notify({
              title: "成功",
              message: "批量删除成功",
              type: "success",
              duration: 2000
            });
            this.getNewsList();
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
      console.log(this.multipleSelection);
    },
    handleFilter() {
      this.query.page = 1;
    },

    handleDelete(id) {
      this.$confirm("此操作将永久删除改项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteNews([id]).then(resp => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getNewsList();
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
    index(val) {
      return (this.query.page - 1) * this.query.pageSize + val + 1;
    },
    timeFormatter(row, column, cellValue, index) {
      return moment(cellValue - 8 * 3600 * 1000).format("YYYY-MM-DD HH:mm");
    }
  }
};
</script>
