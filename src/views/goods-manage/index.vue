<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.keyword"
        placeholder="闲趣标题"
        style="width: 200px;"
        class="filter-item"
        prefix-icon="el-icon-search"
        @change="getList"
      />
      <el-input
        v-model="query.title"
        placeholder="发布人"
        style="width: 200px;"
        class="filter-item"
        prefix-icon="el-icon-search"
        @change="getList"
      />
      <el-select
        v-model="query.type"
        placeholder="类型"
        clearable
        style="width: 90px"
        class="filter-item"
        @change="getList"
      >
        <el-option label="服饰" :value="1"/>
        <el-option label="装备" :value="2"/>
        <el-option label="其他" :value="3"/>
      </el-select>

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
      <el-table-column prop="name" label="闲趣名称"></el-table-column>
      <el-table-column prop="time" label="发布时间" :formatter="timeFormatter"></el-table-column>
      <el-table-column prop="userId" label="发布人"></el-table-column>
      <el-table-column label="类别">
        <template slot-scope="scope">
          <span>{{scope.row.type|goodsTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sPrice" label="卖价/元"></el-table-column>

      <el-table-column label="操作" width="150px">
        <!-- <el-button @click="dialogpass = true">审核</el-button> -->
        <el-button type="danger" @click="dialogdelete = true">删除</el-button>
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
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getGoodsList, deleteGoods } from "@/api/goods.js";
import moment from "moment";
export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    goodsTypeFilter: function(value) {
      switch (value) {
        case 1:
          return "服饰";
        case 2:
          return "装备";
        case 3:
          return "其他";

        default:
          return "";
      }
    }
  },
  data() {
    return {
      total: 0,
      listLoading: true,
      query: { page: 1, pageSize: 10, keyword: "", orderBy: "" },
      tableData: [
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          type: "装备",
          price: "100"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          type: "装备",
          price: "100"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          type: "装备",
          price: "100"
        },
        {
          id: "1",
          time: "2016-05-02",
          name: "王小虎",
          title: "啦啦啦",
          type: "装备",
          price: "100"
        }
      ],
      multipleSelection: [],

      dialogdelete: false,
      dialogpass: false,
      downloadLoading: false
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getList();
  },
  methods: {
    getList() {
      getGoodsList(this.query).then(resp => {
        this.tableData = resp.data;
        this.total = resp.total;
      });
    },
    handleSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(curPage) {
      this.query.page = curPage;
      this.getList();
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
          deleteGoods([id]).then(resp => {
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
    index(val) {
      return (this.query.page - 1) * this.query.pageSize + val + 1;
    },
    timeFormatter(row, column, cellValue, index) {
      return moment(cellValue - 8 * 3600 * 1000).format("YYYY-MM-DD HH:mm");
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
          deleteGoods(idArr).then(resp => {
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
    }
  }
};
</script>
