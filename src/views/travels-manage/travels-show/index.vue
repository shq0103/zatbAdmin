<template>
  <div class="activity-show">
    <div class="activity_info">
      <div class="a-i-title">
        <h3 class="activity_title">{{travels.title}}</h3>
        <b class="activity_distance">{{travels.length}}</b>
      </div>
      <ul class="activity_text" style="display:flex;padding:0px;">
        <li>
          <img src="../../../assets/写作者.png" style="height:15px;margin:-3px 2px -2px 0;">
          {{travels.nickname}}
        </li>
        <li>
          <img src="../../../assets/路书时间.png" style="height:16px;margin:-3px 3px -2px 0;">
          {{travels.publishTime|timeFilter}}
        </li>
        <li>
          <img src="../../../assets/咨讯浏览.png" style="height:21px;margin:-3px 2px -5px 0;">
          {{travels.viewCount}}人浏览
        </li>
        <li>
          <img src="../../../assets/路书评论.png" style="height:15px;margin:-3px 2px -3px 0;">
          {{travels.commentCount}}人评论
        </li>
      </ul>
      <div class="a-i-content">
        <el-row :gutter="24">
          <el-col :span="14">
            <div class="a-c-lf">
              <MapShow v-if="myPointList.length>0" :point-list="myPointList" height="350px"/>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="a-c-rf-1">
              <div class="a-c-rf-top">
                <el-row :gutter="20" style="margin-bottom:10px;">
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <img src="../../../assets/长度.png" style="height:20px;margin:-3px 5px -5px 0;">总里程
                      <span>/</span>
                      {{travels.distance}}公里
                    </div>
                  </el-col>
                  <el-col :span="12" style="padding-left:0px;">
                    <div class="grid-content bg-purple">
                      <img
                        src="../../../assets/耗时.png"
                        style="height:19px;margin:-3px 5px -5px -50px;"
                      >总耗时
                      <span>/</span>
                      {{travels.takeTime}}小时
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <img
                        src="../../../assets/海拔高度.png"
                        style="height:18px;margin:-3px 4px -5px 8px;"
                      >平均海拔
                      <span>/</span>
                      {{travels.altitude}}米
                    </div>
                  </el-col>
                  <el-col :span="12" style="padding-left:0px;">
                    <div class="grid-content bg-purple">
                      <img
                        src="../../../assets/配速.png"
                        style="height:21px;margin:-3px 3px -5px -2px;"
                      >平均配速
                      <span>/</span>
                      {{travels.speed}}公里/小时
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="a-c-rf-bottom">
                <span>摘要</span>
                <div class="a-c-rf-b-content">
                  <p>{{travels.intro}}</p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="activity_content">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="a-c-lf-1">
            <div class="a-c-lf-content" v-for="(item,index) in travels.travelPlaces" :key="item.id">
              <el-card class="box-card">
                <div :id="`p${index}`" slot="header" class="clearfix">
                  <span>{{item.name}}</span>
                  <el-button
                    style="float: right; padding: 1px 0"
                    type="text"
                    @click="dialogVisible = true"
                  >
                    <img src="../../../assets/路书评论1.png" style="height:28px">
                  </el-button>
                  <el-button style="float: right; padding: 3px 3px" type="text">
                    <img src="../../../assets/路书点赞.png" style="height:26px">
                  </el-button>
                </div>
                <div class="box-card-content">
                  <el-carousel :interval="5000" arrow="always">
                    <el-carousel-item v-for="(el,elindex) in item.imgList" :key="elindex">
                      <img :src="`/image${el}`">
                    </el-carousel-item>
                  </el-carousel>
                  <div class="new-right2">
                    <i class="el-icon-place">纬度:{{item.lat}}, 经度:{{item.lng}}</i>
                    <i
                      class="el-icon-chat-line-square"
                      style="padding-left:20px"
                    >{{item.commentCount}}</i>
                  </div>
                  <div>
                    <span style="text-indent: 2.5em;">
                      <p
                        style="margin-top: 20px;line-height: 25px;text-align:justify;"
                        v-html="item.contents"
                      ></p>
                    </span>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="mMenu">
      <Hamburger class="hamburger-container" @toggleClick="toggleClick" :is-active="isCollapse"/>
      <!-- background-color背景颜色
      text-color文字颜色
      active-text-color选中颜色-->
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        @select="selectItem"
      >
        <el-menu-item
          :index="`#p${index}`"
          v-for="(item,index) in travels.travelPlaces"
          :key="item.id"
        >
          <i class="el-icon-location"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </div>

    <el-dialog
      title
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
      class="el-title"
    >
      <div class="el-dialog-title">共2条评论</div>
      <div class="el-dialog-content">1111111</div>
      <div class="el-dialog-input">
        <el-form ref="form" label-width="80px" label-position="top">
          <el-form-item label="评论">
            <el-input type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Hamburger from "./Hamburger.vue";
import MapShow from "@/components/BdmapT/index.vue";
import { getTravelsDetail } from "@/api/travels.js";
export default {
  components: {
    Hamburger,
    MapShow
  },
  data() {
    return {
      isCollapse: false,
      dialogVisible: false,
      newList: [
        {
          id: 0,
          image:
            "http://tubu100.com:8053/Files/Article/20180524152006491eff.jpg",
          title: "2018全国徒步大会5•19联动日激情“走起”"
        },
        {
          id: 1,
          image:
            "http://tubu100.com:8053/Files/Article/2018052311445301f787.jpg",
          title: "全国徒步大会定制款保险说明"
        },
        {
          id: 2,
          image:
            "http://tubu100.com:8053/Files/Article/2018050712260650cf42.jpg",
          title: " 2018徒步中国•全国徒步大会百色“地心之旅”（乐业、凌云）站举办"
        }
      ],
      pointList: [
        {
          id: 0,
          name: "打卡点1",
          lat: 25.9079359516,
          lon: 114.038064697,
          contents:
            "风肆意地吹起我的裙摆，带我去寻找。人生不过一场黄粱梦，在频繁的美丽与曲折的悲欢之后，悠然醒转，新炊却犹未熟。我知道，在我的生命里，有一种执着地等待，挫折会来，也会过去，热泪会流下来，也会收起，没有什么可以让我气馁的，因为，我有着长长的一生，而你，你一定会来。",
          commentCount: 300
        },
        {
          id: 1,
          name: "打卡点2",
          lat: 25.9079359516,
          lon: 114.038064697,
          contents: "",
          commentCount: 300
        },
        {
          id: 2,
          name: "打卡点3",
          lat: 25.9079359516,
          lon: 114.038064697,
          contents: "",
          commentCount: 300
        }
      ],
      myPointList: [],
      id: 0,
      travels: {}
    };
  },
  created() {
    this.id = this.$route.params.id;
    getTravelsDetail(this.id).then(resp => {
      this.travels = resp.data;
      console.log(this.travels);
      this.travels.travelPlaces.forEach(item => {
        this.myPointList.push({
          lng: item.lng,
          lat: item.lat,
          show: false,
          text: item.name,
          src: `/image${item.imgList[0]}`
        });
      });
    });
  },
  methods: {
    toggleClick: function() {
      this.isCollapse = !this.isCollapse;
    },
    selectItem: function(index) {
      document.querySelector(index).scrollIntoView({
        behavior: "smooth"
      });
    },
    handleClose() {}
  }
};
</script>

<style scoped>
.activity-show {
  padding: 20px;
}
.hamburger-container {
  line-height: 46px;
  height: 100%;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}

.hamburger-container:hover {
  background: rgba(0, 0, 0, 0.025);
}
ul {
  list-style-type: none;
}
.activity_top {
  display: flex;
  margin: 0px;
  padding: 0px;
}
.activity_top li {
  line-height: 20px;
  font-size: 13px;
}
.activity_top li a {
  color: #999;
}
.activity_top li:nth-child(2n) {
  padding: 0 10px;
}
.a-i-title {
  display: flex;
  margin: 15px 0;
}
.activity_title {
  line-height: 24px;
  font-size: 24px;
  font-weight: bold;
  margin: 0px;
}
.activity_distance {
  margin-top: 1px;
  padding: 0 10px;
  line-height: 22px;
  background: #ffa500;
  border-radius: 3px;
  cursor: pointer;
  color: #fff;
  margin-left: 10px;
  font-size: 12px;
}
.activity_text {
  width: 100%;
  box-sizing: border-box;
  line-height: 14px;
  font-size: 14px;
  margin: 15px 0;
  color: #999;
  display: flex;
}
.aname1 {
  font-weight: 700;
  font-size: 16px;
  line-height: 18px;
  margin: 10px 0 0 0;
  text-align: center;
}
.tr-b-rf-img1 {
  height: 180px;
  overflow: hidden;
  position: relative;
}
.tr-b-rf-img {
  margin-top: 15px;
  /* padding-right: 5px; */
}
.borderNone {
  border: none !important;
}
.tr-b-rf-bottom {
  border-bottom: 1px dotted #ccc;
  margin-bottom: 10px;
  padding: 0 10px 10px 10px;
}
.activity_text li {
  padding-right: 25px;
}
/* .a-i-content {
  display: flex;
} */
.a-i-c-lf label {
  font-weight: bold;
  background: #ffd400;
  padding: 0 15px;
  height: 34px;
  line-height: 34px;
  left: 80px;
  position: absolute;
  font-size: 13px;
  margin: 30px 0px;
}

.a-i-c-rf {
  margin-left: 20px;
  width: 100%;
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
}
.a-i-c-rf p {
  font-size: 13px;
  padding: 3px 0px;
}
.el-button.is-round {
  width: 80%;
}
.a-i-c-rf-text {
  text-align: left;
  padding: 10px 20px;
}
.a-c-lf {
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
}
.a-c-lf-title {
  background-color: #f6f8fa;
  box-shadow: 0 -1px 3px rgba(4, 0, 0, 0.06);
}
.a-c-rf {
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
  padding: 0 15px;
}
.a-c-rf-1 {
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
  padding: 20px 25px;
  min-height: 310px;
}
.activity_content {
  margin: 30px 0px;
}
.a-c-rf-2-title {
  height: 28px;
  line-height: 28px;
  font-size: 18px;
  color: #75b628;
  text-align: left;
  margin: 10px 0px;
  border-bottom: 1px solid #ccc;
  padding: 0 10px 10px 10px;
}
.a-c-rf-2-title1 {
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  color: #7594ac;
  text-align: left;
  margin: -10px 40px 10px 10px;
}
.a-c-rf-2-cloud {
  width: 90%;
  height: 85px;
  background: #4b8ee7 url(../../../assets/cloud.png) no-repeat 20px center;
  position: relative;
  margin: auto;
}
.a-c-rf-2-cloud a {
  display: inline-block;
  height: 28px;
  line-height: 28px;
  color: #fff;
  border: 1px solid #fff;
  position: absolute;
  right: 20px;
  bottom: 25px;
  padding: 0 20px;
  border-radius: 4px;
  font-size: 16px;
}

.a-c-rf-2 {
  border-bottom: #ccc dotted 2px;

  padding: 20px 0px;
}
.a-c-rf-3 {
  padding: 10px 0px;
  min-height: 100px;
}
.post-bottom-content-lf img {
  height: 70px;
  border-radius: 50%;
  border: 1px solid #fff;
  margin: 0 10px;
}
a:hover {
  color: #75b628;
  text-decoration: underline;
}
/* .mMenu a:visited {
  color: #fff;
}
.mMenu a:active {
  color: #ffd04b;
} */
.post-bottom-content-rf ul {
  padding: 0;
  text-align: left;
  font-size: 15px;
  color: #999;
}
/* .a-c-rf-2-people-1 {
  padding-left: 0px !important;
} */
.a-c-rf-2-content {
  margin: 20px 0px;
}
.tabbar {
  position: relative;
  height: 56px;
  padding-left: 10px;
  margin: 0px;
}
.tabbar-1 {
  background-color: #fff;
  border-top: 2px solid #75b628;
  height: 54px;
  line-height: 52px;
}
.tabbar li {
  position: relative;
  float: left;
  height: 56px;
  line-height: 56px;
}
.tabbar a {
  padding: 0 20px;
  font-size: 16px;
  color: #585858;
  display: block;
  text-align: center;
}
.attr-title {
  padding: 0 20px 10px 20px;
}
.attr-title i {
  display: inline-block;
  vertical-align: middle;
  margin: -3px 10px 0 0;
}
.icon-intro {
  height: 25px;
  /* background: url(../../../assets/xianlu.png) no-repeat; */
  margin-bottom: -5px;
  margin-right: 5px;
}
.attr-title h3 {
  text-shadow: 0 2px 0 rgba(98, 133, 161, 0.2);
  color: #7594ac;
  font: 400 20px/32px "Microsoft Yahei";
  text-align: left;
}
.a-c-l-c-1 {
  border-bottom: 1px dotted #ccc;
  margin: 5px 20px;
}
.a-c-l-c-2 {
  margin: 5px 20px;
  padding-bottom: 20px;
}
.attr-content {
  min-height: 300px;
}
.a-c-rf-top {
  padding: 10px 0px;
  border-radius: 5px;
  border: 1px dotted #ccc;
  font-size: 15px;
  color: #515151;
  line-height: 25px;
}
.a-c-rf-top span {
  color: #75b628;
  margin: 0 5px;
}
.a-c-rf-bottom {
  margin: 10px 0;
}
.a-c-rf-b-content {
  padding: 0 18px;
  font-size: 15px;
}
.a-c-rf-b-content p {
  text-indent: 2em;
  text-align: justify;
}

.mMenu {
  position: fixed;
  top: 200px;
  right: 0;
  text-align: center;
}
.a-c-lf-content {
  text-align: left;
  margin-bottom: 20px;
}
.a-c-1 {
  padding: 0px 10px;
}
.el-title {
  text-align: left;
}
.el-dialog-title {
  border-bottom: 1px dotted #75b628;
  padding-bottom: 10px;
}
.el-dialog-input {
  border-top: 1px dotted #75b628;
  padding-top: 10px;
}
.el-dialog-content {
  margin: 10px 0;
}
.new-right2 {
  margin-top: 13px;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #515151;
  font-size: 13px;
}
</style>
