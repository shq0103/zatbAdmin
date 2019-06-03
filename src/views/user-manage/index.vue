<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.keyword"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        prefix-icon="el-icon-search"
        @change="handleFilter"
      />
      <el-select
        v-model="query.gender"
        placeholder="性别"
        clearable
        style="width: 90px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option label="男" :value="1"/>
        <el-option label="女" :value="0"/>
      </el-select>
      <el-select
        v-model="query.status"
        @change="handleFilter"
        placeholder="禁言状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option label="禁言中" :value="1"/>
        <el-option label="未禁言" :value="0"/>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="handleDeleteAll"
      >批量删除</el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-close"
        @click="handleFilter"
      >批量禁言</el-button>-->
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
      <el-table-column prop="lastTime" label="上次登陆时间" :formatter="timeFormatter" width="150px"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="trueName" label="真实姓名"></el-table-column>
      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.gender|genderFilter}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="password" label="密码"></el-table-column> -->
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column label="操作" width="320px">
        <template slot-scope="scope">
          <el-button @click="changePassword(scope.row)">更改密码</el-button>
          <el-button
            :type="scope.row.status == 0 ?'danger':'success'"
            @click="banUser(scope.row)"
          >{{scope.row.status == 0 ? "禁言" : "解除禁言"}}</el-button>
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

    <el-dialog title="修改密码" :visible.sync="dialogedit" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item style="margin:0px!important!;">
          <span>请填入新密码</span>
          <el-input
            placeholder="请输入密码"
            v-model="form.password"
            show-password
            style="margin-top:10px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogedit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
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
import { getList, deleteUser, updateUser, getUserDetail } from "@/api/user.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import moment from "moment";
export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    genderFilter: function(value) {
      switch (value) {
        case 0:
          return "女";
        case 1:
          return "男";

        default:
          return "";
      }
    }
  },
  data() {
    return {
      form: {
        id: 0,
        username: "",
        password: "",
        nickname: "",
        role: "",
        avatar: "",
        birthday: null,
        gender: null,
        trueName: "",
        idCard: "",
        phone: "",
        mail: "",
        intro: "",
        place: "",
        lastTime: 0,
        status: 0
      },
      token: "",
      query: {
        page: 1,
        pageSize: 10,
        keyword: "",
        gender: null,
        status: null
      },
      list: null,
      total: 0,
      listLoading: true,
      tableData: [
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
    this.getUserList();
    this.token = localStorage.getItem("token");
    getUserDetail(1111).then(resp => {
      Object.assign(this.form, resp.data);
    });
  },
  methods: {
    getUserList() {
      this.listLoading = true;
      getList(this.query).then(resp => {
        this.tableData = resp.data;
        this.total = resp.total;
        this.listLoading = false;
      });
    },
    handleCurrentChange(curPage) {
      this.query.page = curPage;
      this.getUserList();
    },
    handleSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.getUserList();
    },
    timeFormatter(row, column, cellValue, index) {
      return moment(cellValue - 8 * 3600 * 1000).format("YYYY-MM-DD HH:mm");
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
    index(val) {
      return (this.query.page - 1) * this.query.pageSize + val + 1;
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
          deleteUser(idArr).then(resp => {
            this.$notify({
              title: "成功",
              message: "批量删除成功",
              type: "success",
              duration: 2000
            });
            this.getUserList();
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
          deleteUser([id]).then(resp => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getUserList();
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
      this.query.page = 1;
      this.getUserList();
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.birthday = Date.parse(new Date(this.form.birthday));
          updateUser(this.form).then(resp => {
            this.$notify({
              title: "成功",
              message: "提交成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          this.$notify({
            title: "失败",
            message: "提交失败",
            type: "warning",
            duration: 2000
          });
        }
      });
    },
    changePassword(user) {
      Object.assign(this.form, user);
      this.form.password = "";
      this.dialogedit = true;
    }
  }
};
</script>
<style>
.el-form-item__content {
  margin: 0px !important;
}
</style>
