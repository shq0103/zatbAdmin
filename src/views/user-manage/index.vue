<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        placeholder="性别"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option label="男" :value="1"/>
        <el-option label="女" :value="2"/>
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="禁言状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option label="禁言中" :value="1"/>
        <el-option label="未禁言" :value="2"/>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="handleFilter"
      >批量删除</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-close"
        @click="handleFilter"
      >批量禁言</el-button>
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
      <el-table-column prop="id" label="序号" sortable width="50px"></el-table-column>
      <el-table-column prop="time" label="上次登陆时间"></el-table-column>
      <el-table-column prop="username" label="用户名" :formatter="formatter"></el-table-column>
      <el-table-column prop="truename" label="真实姓名" :formatter="formatter"></el-table-column>
      <el-table-column prop="sex" label="性别" :formatter="formatter"></el-table-column>
      <el-table-column prop="password" label="密码" :formatter="formatter"></el-table-column>
      <el-table-column prop="phone" label="手机号" :formatter="formatter"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" @click="dialogedit = true">编辑</el-button>
          <el-button
            size="mini"
            :type="scope.row.status == 0 ?'danger':'success'"
            @click="banUser(scope.row)"
          >{{scope.row.status == 0 ? "禁言" : "解除禁言"}}</el-button>
          <el-button size="mini" type="danger" @click="dialogdelete = true">删除</el-button>
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="dialogedit" width="30%" :before-close="handleClose">
      <span>请填入新密码</span>
      <el-input placeholder="请输入密码" v-model="input" show-password style="margin-top:10px;"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogedit = false">取 消</el-button>
        <el-button type="primary" @click="dialogedit = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogban" width="30%" :before-close="handleClose">
      <span>是否禁言</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogban = false">取 消</el-button>
        <el-button type="primary" @click="dialogban = false">确 定</el-button>
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
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { getList, deleteUser, updateUser } from "@/api/user.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

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
    }
  },
  data() {
    return {
      query: {
        page: 1,
        pageSize: 10,
        keyword: ""
      },
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
      multipleSelection: [],
      input: "",
      dialogedit: false,
      dialogban: false,
      dialogdelete: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false,
      user: {}
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    getList() {
      this.listLoading = true;
    },
    getUserList() {
      getList(this.query).then(resp => {
        this.tableData = resp.data;
        this.total = resp.total;
      });
    },
    handleCurrentChange(curPage) {
      this.query.page = curPage;
      this.getUserList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    banUser(user) {
      this.user = user;
      this.$confirm(`${this.user.status == 0 ? "禁言" : "解除禁言"}该用户？`)
        .then(_ => {
          this.user.status = this.user.status == 0 ? 1 : 0;
          updateUser(this.user).then(resp => {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
          });
        })
        .catch(_ => {});
    }
  }
};
</script>
