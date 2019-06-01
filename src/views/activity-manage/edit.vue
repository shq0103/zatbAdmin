<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.type"
        placeholder="性别"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option label="男" :value="1"/>
        <el-option label="女" :value="0"/>
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
      >{{ $t('table.search') }}</el-button>
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
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="name" label="真实姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="number" label="手机号"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template>
          <el-button size="mini" @click="dialogedit = true">通过</el-button>

          <el-button size="mini" type="danger" @click="dialogdelete = true">删除</el-button>
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
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";

import { getJoinList } from "@/api/activity.js";

export default {
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
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
          truename: "啦啦啦",
          sex: "女",
          number: "13338383388",
          password: "admin"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          truename: "啦啦啦",
          sex: "女",
          number: "13338383388",
          password: "admin"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          truename: "啦啦啦",
          sex: "女",
          number: "13338383388",
          password: "admin"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          truename: "啦啦啦",
          sex: "女",
          number: "13338383388",
          password: "admin"
        }
      ],
      query: { page: 1, pageSize: 10, activityId: 0 },
      dialogFormVisible: false,
      multipleSelection: [],
      input: "",
      dialogStatus: "",
      dialogedit: false,
      dialogdelete: false,
      downloadLoading: false
    };
  },
  created() {
    this.query.activityId = this.$route.params && this.$route.params.id;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getJoinList(this.query).then(resp => {
        this.tableData = resp.data;
        this.total = resp.total;
        this.listLoading = false;
      });
    },
    handleCurrentChange(curPage) {
      this.query.page = curPage;
      this.getList();
    },
    handleSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    index(val) {
      return (this.query.page - 1) * this.query.pageSize + val + 1;
    }
  }
};
</script>
