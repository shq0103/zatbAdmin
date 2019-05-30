<template>
  <baidu-map
    class="map"
    :scroll-wheel-zoom="true"
    :double-click-zoom="false"
    :center="center"
    :zoom="14"
    :style="{height:height}"
    :map-click="false"
  >
    <bm-geolocation
      anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
      :show-address-bar="true"
      :auto-location="true"
    ></bm-geolocation>
    <bm-polyline :path="pointList"></bm-polyline>

    <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
    <bm-overview-map anchor="BMAP_ANCHOR_TOP_LEFT" :is-open="true"></bm-overview-map>
    <bm-marker
      v-for="(point,index) in pointList"
      :key="index"
      :position="point"
      @click="infoWindowOpen(index)"
      animation="BMAP_ANIMATION_BOUNCE"
    >
      <bm-info-window
        :show="point.show"
        @close="infoWindowClose(index)"
        @open="infoWindowOpen(index)"
      >
        <div class="showInfo">
          <img width="200px" height="100px" :src="point.src">
          <h5>{{point.text}}</h5>
        </div>
      </bm-info-window>
    </bm-marker>
  </baidu-map>
</template>
<script>
import Vue from "vue";
import BaiduMap from "vue-baidu-map";
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: "UfWvIcbji93RkhCwoNd3mu5pRCagKyf8"
});
export default {
  props: {
    pointList: {
      type: Array,
      default: () => [
        {
          lng: 116.404,
          lat: 39.915,
          show: false,
          text: "海琴小可爱",
          src:
            "http://img02.tooopen.com/images/20160120/tooopen_sy_155012438679.jpg"
        },
        {
          lng: 116.405,
          lat: 39.92,
          show: false,
          text: "海琴小仙女呀",
          src:
            "http://img02.tooopen.com/images/20160120/tooopen_sy_155012438679.jpg"
        },
        {
          lng: 116.423493,
          lat: 39.907445,
          show: false,
          text: "海琴超漂亮呀",
          src:
            "http://img02.tooopen.com/images/20160120/tooopen_sy_155012438679.jpg"
        },
        {
          lng: 116.424493,
          lat: 39.917445,
          show: false,
          text: "海琴美美哒",
          src:
            "http://img02.tooopen.com/images/20160120/tooopen_sy_155012438679.jpg"
        }
      ]
    },
    height: {
      default: "300px"
    }
  },
  methods: {
    infoWindowOpen(index) {
      this.pointList[index].show = true;
    },
    infoWindowClose(index) {
      this.pointList[index].show = false;
    }
  },
  computed: {
    center() {
      if (this.pointList.length % 2 === 1) {
        return this.pointList[Math.floor(this.pointList.length / 2)];
      } else {
        let point = { lng: 0, lat: 0 };
        point.lng =
          (this.pointList[this.pointList.length / 2 - 1].lng +
            this.pointList[this.pointList.length / 2].lng) /
          2;
        point.lat =
          (this.pointList[this.pointList.length / 2 - 1].lat +
            this.pointList[this.pointList.length / 2].lat) /
          2;
        return point;
      }
    }
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 350px;
}
.showInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}
h5 {
  padding: 0;
  margin: 0;
}
</style>
