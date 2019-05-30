<template>
  <div class="activity-public">
    <div class="public-bottom">
      <div v-show="showForm" class="ac-public-form1">
        <h3 class="acTitle">你的活动计划</h3>

        <div class="ac-public-form2">
          <el-form ref="form" label-width="80px" :model="form" :rules="rules">
            <el-form-item label="活动名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动地点" prop="destination">
              <el-input v-model="form.destination"></el-input>
            </el-form-item>
            <el-form-item label="集合地点" prop="startPlace">
              <el-input v-model="form.startPlace"></el-input>
            </el-form-item>
            <el-form-item label="活动时间" prop="startPlace">
              <el-col :span="11">
                <el-form-item prop="startDate">
                  <el-date-picker
                    type="datetime"
                    placeholder="开始日期"
                    style="width: 100%;"
                    v-model="form.startDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endDate">
                  <el-date-picker
                    type="datetime"
                    placeholder="结束日期"
                    style="width: 100%;"
                    v-model="form.endDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="报名截止时间" prop="deadline">
              <el-col :span="11">
                <el-date-picker
                  v-model="form.deadline"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  style="width:100%"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="活动程度" prop="theme">
              <el-select placeholder="请选择活动程度" style="width: 100%!important;" v-model="form.theme">
                <el-option label="短线" :value="1"></el-option>
                <el-option label="中线" :value="2"></el-option>
                <el-option label="长线" :value="3"></el-option>
                <el-option label="其他" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动要求">
              <el-col :span="11">
                <el-form-item prop="price">
                  <el-input placeholder="费用" v-model="form.price">
                    <template slot="append">元/人</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="quota">
                  <el-input placeholder="人数上限" v-model="form.quota">
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="活动说明" prop="explain">
              <el-input
                placeholder="请简要说明活动内容或需注意事项"
                type="textarea"
                minrows="6"
                v-model="form.explain"
              ></el-input>
            </el-form-item>
            <el-form-item label="活动封面" prop="image">
              <el-upload
                list-type="picture-card"
                ref="uploadImg"
                class="upload-demo"
                action="/api/File/UploadImg"
                :headers="{Authorization:`Bearer ${token}`}"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :limit="1"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="toNext" style="width: 100%;">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div v-show="!showForm" class="ac-public-content">
        <div class="ac-h3">
          <h3>{{form.name}}</h3>
          <a @click="showForm=!showForm" class="prev-link">
            <img src="../../../assets/加载.png">
            返回上一步
          </a>
        </div>
        <div class="ac-content">
          <div class="ac-content1">
            <div class="ac-c-title">
              <h3>
                <a name="position1">
                  <img src="../../../assets/行程.png" class="icon-intro">行程安排
                </a>
              </h3>
            </div>
            <div class="ac-c-wrap">
              <Tinymce type="textarea" :rows="15" placeholder="请输入内容" v-model="form.routing"></Tinymce>
            </div>
          </div>
          <div class="ac-content1">
            <div class="ac-c-title">
              <h3>
                <a name="position1">
                  <img src="../../../assets/费用说明.png" class="icon-intro">费用说明
                </a>
              </h3>
            </div>
            <div class="ac-c-wrap">
              <Tinymce type="textarea" :rows="15" placeholder="请输入内容" v-model="form.costExplain"></Tinymce>
            </div>
          </div>
          <div class="ac-content1">
            <div class="ac-c-title">
              <h3>
                <a name="position1">
                  <img src="../../../assets/线路.png" class="icon-intro">线路介绍
                </a>
              </h3>
            </div>
            <div class="ac-c-wrap">
              <Tinymce type="textarea" :rows="15" placeholder="请输入内容" v-model="form.line"></Tinymce>
            </div>
          </div>
          <div class="ac-content1">
            <div class="ac-c-title">
              <h3>
                <a name="position1">
                  <img src="../../../assets/装备.png" class="icon-intro">装备要求
                </a>
              </h3>
            </div>
            <div class="ac-c-wrap">
              <Tinymce type="textarea" :rows="15" placeholder="请输入内容" v-model="form.equip"></Tinymce>
            </div>
          </div>
          <div class="ac-content1">
            <div class="ac-c-title">
              <h3>
                <a name="position1">
                  <img src="../../../assets/更多.png" class="icon-intro">更多介绍
                  <span style="font-size:14px;">非必填</span>
                </a>
              </h3>
            </div>
            <div class="ac-c-wrap">
              <Tinymce type="textarea" :rows="15" placeholder="请输入内容" v-model="form.moreInfo"></Tinymce>
            </div>
          </div>
          <div class="ac-content2">
            <el-button type="success" @click="submitForm" style="width: 100%">发布活动</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { publicActivity } from "@/api/activity.js";
import { getToken } from "@/utils/auth";
import Tinymce from "@/components/Tinymce";
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      showForm: true,
      form: {
        id: 0,
        userId: 0,
        name: "",
        startDate: "",
        endDate: "",
        deadline: "",
        status: 0,
        startPlace: "",
        theme: "",
        quota: 0,
        price: 0,
        destination: "",
        viewCount: 0,
        image: "",
        explain: "",
        routing: "",
        costExplain: "",
        line: "",
        equip: "",
        moreInfo: ""
      },
      token: "",
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { max: 20, message: "长度不超过20字符", trigger: "blur" }
        ],
        destination: [
          { required: true, message: "请输入活动目的地", trigger: "blur" }
        ],
        startPlace: [
          { required: true, message: "请输入活动集合地", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "请输入活动开始时间", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请输入活动结束时间", trigger: "blur" }
        ],
        deadline: [
          { required: true, message: "请输入活动报名截止时间", trigger: "blur" }
        ],
        deadline1: [
          { required: true, message: "请输入活动报名截止时间", trigger: "blur" }
        ],
        theme: [{ required: true, message: "请输入活动程度", trigger: "blur" }],
        price: [{ required: true, message: "请输入活动费用", trigger: "blur" }],
        quota: [{ required: true, message: "请输入活动名额", trigger: "blur" }],
        explain: [
          { required: true, message: "请输入活动说明", trigger: "blur" }
        ],
        image: [
          { required: true, message: "请输入活动封面图", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    toNext() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.showForm = !this.showForm;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSuccess(response) {
      this.form.image = response.data;
    },
    handleRemove() {
      this.form.image = "";
    },
    submitForm() {
      // this.postForm.display_time = parseInt(this.display_time / 1000);
      console.log(this.form);
      this.form.startDate = new Date(this.form.startDate).getTime();
      this.form.endDate = new Date(this.form.endDate).getTime();
      this.form.deadline = new Date(this.form.deadline).getTime();
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          publicActivity(this.form).then(resp => {
            if (resp.code === 0) {
              this.$notify({
                title: "成功",
                message: "发布活动成功",
                type: "success",
                duration: 2000
              });
            }
            this.$refs.from.resetFields();
            this.$refs.uploadImg.clearFiles();
          });
          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.public-bottom {
  /* padding: 30px; */

  border-top-left-radius: 10px;
  -webkit-border-top-left-radius: 10px;
  -moz-border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  -webkit-border-top-right-radius: 10px;
  -moz-border-top-right-radius: 10px;
  background: #fff;
}
.activity-public {
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 10px;
  -webkit-border-top-left-radius: 10px;
  -moz-border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  -webkit-border-top-right-radius: 10px;
  -moz-border-top-right-radius: 10px;
}

.upload-demo {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 5px 0;
}
.acTitle {
  color: #fff;
  height: 42px;
  line-height: 42px;
  text-align: center;
  font-size: 16px;

  background: linear-gradient(
    90deg,
    #20b6f9 0%,
    #20b6f9 0%,
    #2178f1 100%,
    #2178f1 100%
  );
}
</style>

<style scoped>
.public-bottom {
  /* padding: 30px; */

  border-top-left-radius: 10px;
  -webkit-border-top-left-radius: 10px;
  -moz-border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  -webkit-border-top-right-radius: 10px;
  -moz-border-top-right-radius: 10px;
  background: #fff;
}
.activity-public {
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 10px;
  -webkit-border-top-left-radius: 10px;
  -moz-border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  -webkit-border-top-right-radius: 10px;
  -moz-border-top-right-radius: 10px;
}
.ac-public-form2 {
  padding: 20px 80px;
}
.ac-h3 {
  color: #fff;
  height: 42px;
  line-height: 42px;
  text-align: center;
  font-size: 16px;
  background: linear-gradient(
    90deg,
    #20b6f9 0%,
    #20b6f9 0%,
    #2178f1 100%,
    #2178f1 100%
  );
  display: flex;
}
.ac-h3 h3 {
  margin: auto;
  font-size: 16px;
}

.prev-link {
  /* background: url(../../assets/mXTxKl-26-339.png) -6px -262px no-repeat; */
  padding-left: 18px;
  color: #fff;

  font-size: 14px;
  position: absolute;
  right: 85px;
  font-size: 12px;
}
.prev-link img {
  width: 19px;
  margin-bottom: -5px;
  margin-right: 2px;
}
.prev-link:hover {
  cursor: pointer;
}
ac-content1 {
  padding-right: 180px;
  padding-left: 55px;
}
.ac-c-title h3 {
  text-shadow: 0 2px 0 rgba(98, 133, 161, 0.2);
  color: #7594ac;
  font: 400 20px/32px "Microsoft Yahei";
  text-align: left;
}
.ac-c-title {
  padding: 0 20px 0px 20px;
}
.icon-intro {
  height: 25px;
  /* background: url(../../assets/xianlu.png) no-repeat; */
  margin-bottom: -5px;
  margin-right: 5px;
}
.ac-c-wrap {
  /* position: relative;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.03) inset;
  padding: 10px 10px 15px;
  margin-bottom: 20px; */
  margin: 0 20px;
}
/* .el-textarea__inner {
  min-height: 200px !important;
} */
.ac-content2 {
  margin: 10px 0;
  padding: 10px;
}
.ac-content {
  padding: 5px 80px;
}
</style>
