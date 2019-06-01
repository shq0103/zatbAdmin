<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >发布</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>标题</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="60px"
                    label="作者:"
                    prop="author"
                    class="postInfo-container-item"
                  >
                    <el-input v-model="postForm.author" placeholder="请填写作者名称"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item
                    label-width="120px"
                    prop="date"
                    label="发布时间:"
                    class="postInfo-container-item"
                  >
                    <el-date-picker
                      v-model="postForm.date"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择发布时间"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    label-width="80px"
                    prop="type"
                    label="新闻类型:"
                    class="postInfo-container-item"
                  >
                    <el-select v-model="postForm.type" placeholder="请选择新闻类型">
                      <el-option label="资讯" :value="1"></el-option>
                      <el-option label="户外技巧" :value="2"></el-option>
                      <el-option label="户外常识" :value="3"></el-option>
                      <el-option label="户外装备" :value="4"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" prop="source" label-width="90px" label="新闻来源:">
          <el-input
            v-model="postForm.source"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入新闻来源"
          />
        </el-form-item>

        <el-form-item prop="contents" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.contents" :height="400"/>
        </el-form-item>

        <el-form-item prop="imgList" style="margin-bottom: 30px;">
          <el-upload
            ref="uploadImg"
            action="/api/File/UploadImg"
            list-type="picture-card"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :headers="{Authorization:`Bearer ${token}`}"
            :limit="1"
          >
            <span>点击上传封面图片</span>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
import { fetchArticle } from "@/api/article";
import { searchUser } from "@/api/remote-search";
import { publishNews, getNewsDetail } from "@/api/news.js";
import { getToken } from "@/utils/auth";
import store from "@/store";

const defaultForm = {
  author: "",
  title: "", // 文章题目
  content: "", // 文章内容
  source: "", // 文章摘要
  source_uri: "", // 文章外链
  imgList: [], // 文章图片
  date: undefined // 发表时间
};

export default {
  name: "ArticleDetail",
  components: {
    Tinymce,
    MDinput,
    Sticky
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: {
        author: "", //作者
        title: "", // 文章题目
        contents: "", // 文章内容
        imgList: [], // 文章图片
        type: null,
        date: null, // 发表时间
        source: ""
      },
      loading: false,
      token: "",
      rules: {}
    };
  },
  computed: {
    lang() {
      return this.$store.getters.language;
    }
  },
  created() {
    this.token = store.getters.token;
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      getNewsDetail(id).then(resp => {
        Object.assign(this.postForm, resp.data);
      });
    } else {
    }
  },
  methods: {
    submitForm() {
      // this.postForm.display_time = parseInt(this.display_time / 1000);
      console.log(this.postForm);
      this.postForm.date = new Date(this.postForm.date).getTime();
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          publishNews(this.postForm).then(resp => {
            if (resp.code === 0) {
              this.$notify({
                title: "成功",
                message: "发布文章成功",
                type: "success",
                duration: 2000
              });
            }
            this.$refs.postForm.resetFields();
            this.postForm.imgList = [];
            this.$refs.editor.setContent("");
            this.$refs.uploadImg.clearFiles();
          });

          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    uploadSuccess(response) {
      this.postForm.imgList[0] = response.data;
      console.log(response);
    },
    handleRemove() {
      this.postForm.imgList = [];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
<style>
.createPost-container .createPost-main-container {
  padding: 20px 45px 20px 50px;
}
</style>
