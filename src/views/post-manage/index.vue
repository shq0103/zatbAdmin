<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="帖子标题"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
      />
      <el-input
        v-model="listQuery.title"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        placeholder="类型"
        clearable
        style="width: 120px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option label="户外问答" :value="1"/>
        <el-option label="装备问答" :value="2"/>
        <el-option label="线路问答" :value="3"/>
        <el-option label="旅途观光" :value="4"/>
        <el-option label="其他" :value="5"/>
      </el-select>
      <!-- <el-date-picker v-model="value1" type="date" class="filter-item" placeholder="选择日期"></el-date-picker> -->

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
      <el-table-column type="index" :index="index" label="序号" sortable width="50px"></el-table-column>
      <el-table-column prop="title" label="帖子标题"></el-table-column>
      <el-table-column prop="date" label="发表日期" :formatter="timeFormatter"></el-table-column>
      <el-table-column prop="username" label="发布人"></el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.type|postTypeFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
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
    <el-dialog :visible.sync="dialogpass" width="30%" :before-close="handleClose">
      <span>是否通过</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogpass = false">取 消</el-button>
        <el-button type="primary" @click="dialogpass = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogdelete" width="30%" :before-close="handleClose">
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelete = false">取 消</el-button>
        <el-button type="primary" @click="dialogdelete = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { getPostList, deletePost } from "@/api/post.js";
import moment from "moment";
export default {
  filters: {
    postTypeFilter: function(value) {
      switch (value) {
        case 1:
          return "户外问答";
        case 2:
          return "装备问答";
        case 3:
          return "线路问答";
        case 4:
          return "旅途观光";
        case 5:
          return "其他";
        default:
          return "";
      }
    }
  },
  data() {
    return {
      list: null,
      query: {
        page: 1,
        pageSize: 10,
        type: null,
        orderBy: null
        // title: "",
        // author: ""
      },
      total: 0,
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
      ],
      multipleSelection: [],
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },
      dialogFormVisible: false,

      dialogdelete: false,
      dialogpass: false,
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getPostList(this.query).then(resp => {
        this.tableData = resp.data;
        this.total = resp.total;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    handleSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(curPage) {
      this.query.page = curPage;
      this.getList();
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除改项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePost([id]).then(resp => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getList();
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
          deletePost(idArr).then(resp => {
            this.$notify({
              title: "成功",
              message: "批量删除成功",
              type: "success",
              duration: 2000
            });
            this.getList();
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
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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
