<template>
  <view class="min-action" :class="{'min-action-show': show}" @touchmove.stop.prevent="()=>{}">
		<view class="min-action-mask" @click="handleMaskClick"></view>
		<view class="min-action-main" :class="{'min-action-main-show': show}">
			<view class="min-action-header min-action-line"><slot name="header"></slot></view>
			<slot name="main">
				<view class="min-action-btn min-action-flex min-action-line"
					v-for="(item, index) in actions" :key="index"
					:style="[item.color ? {color: item.color} : '']"
					@click="handleClick(index)"
				  >
					<view class="min-action-loading min-action-icon" v-if="item.loading === 1"></view>
					<image class="min-action-icon" :src="item.image" v-if="item.image"></image>
					<view class="min-action-icon" :class="item.icon" v-if="item.icon"></view>
					<view>{{item.name}}</view>
				</view>
				<view class="min-action-cancel" v-if="showCancel">
					<view class="min-action-flex min-action-btn" @click="handleClick(-1)">{{cancelText}}</view>
				</view>
			</slot>
			<slot name="bottom"></slot>
		</view>
	</view>
</template>

<script>
export default {
  name: 'min-action-sheet',
  data () {
    return {
      show: false,
      asID: 'as',
      showCancel: true,
      cancelText: '取消',
      maskClose: true,
      actions: [],
      success: () => {},
      isClick: true,
      showRadius: true
    }
  },
  methods: {
    handleShow ({showCancel = true, cancelText = '取消',
      maskClose = true, actions = [], asID = 'as',showRadius = true}) {
      this.show = true
      this.asID = asID
      this.showCancel = showCancel
      this.cancelText = cancelText
      this.maskClose = maskClose
      this.actions = actions
      this.success = () => {}
	  this.showRadius = showRadius
	  return Promise.resolve(this)
    },
    handleHide () {
      this.show = false
      this.asID = 'as'
      this.showCancel = true
      this.cancelText = '取消'
      this.maskClose = true
      this.actions = []
      this.success = () => {}
      this.isClick = true
	  this.$emit('on-close', this.maskClose)
    },
    handleMaskClick () {
      if (!this.isClick) return
      this.maskClose && this.handleHide()
    },
    handleClick (id) {
      if (!this.isClick) return
      if (this.actions[id]) {
        if (this.actions[id].loading === 0) {
          this.actions[id].loading = 1
          this.success({asID: this.asID, id, handleHide: this.handleHide})
          this.isClick = false
          return
        }
      }
      this.success({asID: this.asID, id})
      this.handleHide()
    }
  }
}
</script>

<style scoped>
.min-action-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.min-action-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  transform: scale(.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
  border-bottom: 1px solid #e9eaec;
}
.min-action-loading {
  background: transparent;
  border-radius: 50%;
  border: 2px solid #e5e5e5;
  border-left-color: #aaaaaa;
  animation: loading 1s linear infinite;
}
.min-action,
.min-action-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
}
.min-action {
  z-index: 1000;
  visibility: hidden;
}
.min-action-show {
  visibility: visible;
}
.min-action-mask {
  background: rgba(0, 0, 0, 0.5);
}
.min-action-main {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  transform: translate3d(0, 100%, 0);
  transform-origin: center;
  visibility: hidden;
  transition: all 0.3s;
  border-top-right-radius: 20upx;
  border-top-left-radius: 20upx;
  overflow: hidden;
}
.min-action-main-show {
  transform: translate3d(0, 0, 0);
  visibility: visible;
}
.min-action-header {
  background: #ffffff;
  text-align: center;
  position: relative;
  font-size: 28rpx;
  padding: 20upx;
  color: #1c2438;
}
.min-action-icon {
  margin-right: 12rpx;
  width: 28rpx;
  height: 28rpx;
}
.min-action-cancel {
  padding-top: 12rpx;
  background: #f7f7f7;
}
.min-action-btn {
  position: relative;
  height: 96rpx;
  font-size: 28rpx;
  background: #ffffff;
  color: #1c2438;
}
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
