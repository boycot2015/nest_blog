<template>
	<view class="view-content">
		<view class="title">
			{{viewData.title}}
		</view>
		<view class="main">
			<view class="public-time pdlr30">
				<text>发布时间：{{new Date(viewData.createTime).getTime()|timeFilter}}</text>
			</view>
			<view class="desc" v-if="viewData.content" v-html="$options.filters.formatRichText(viewData.content)"></view>
			<view class="comment">
				<view class="comment-title u-text-left">评论</view>
				<view class="pdlr30">
					<comment-tree @on-click="onCommentClick" :list="viewData.comment">
					</comment-tree>
				</view>
			</view>
			<view
			class="comment-form u-flex u-border-top pdlr30 u-flex-row"
			v-if="!showCommentForm">
					<view class="u-flex-3 u-flex u-flex-row">
						<uni-icons class="edit-icon" color="#999999" type="compose" size="20"></uni-icons>
						<input
						@focus="onShowCommentForm()"
						class="content" :type="'textarea'"
						placeholder-class="comment-class"
						placeholder="写评论..."
						/>
					</view>
					<view class="u-flex-1 u-flex u-flex-row">
						<uni-icons class="u-flex-1" type="hand-thumbsup" size="20"></uni-icons>
						<uni-icons class="u-flex-1" type="redo" size="20"></uni-icons>
					</view>
			</view>
			<view class="comment-mask" @click.prevent.stop="showCommentForm = false" v-else>
				<view class="comment-form u-flex u-border-top  u-flex-col is-edit fixed" @click.stop >
					<view class="u-flex u-flex-row pdlr30 u-border-bottom">
						<textarea
						:focus="showCommentForm"
						@focus="isShowEmj = false"
						placeholder-class="comment-class"
						ref="textearaDom"
						class="content u-flex-7 u-align-left"
						@input="onContentInput"
						:value="commentForm.content"
						:placeholder="contentPlaceholder" />
						<button @click="onCommentSubmit" :disabled="!canSubmit" class="u-flex-1 u-text-center submit-btn" type="default">发布</button>
						<!-- <view @click="onCommentSubmit" class="u-flex-1 u-text-center">发布</view> -->
					</view>
					<view class="u-flex u-flex-row pdlr30">
						<input style="margin-right: 10upx"
						placeholder-class="comment-class"
						:type="'text'"
						class="u-flex-8"
						@input="onNameInput"
						:value="commentForm.name"
						placeholder="用户名"
						/>
						<input :type="'email'"
						placeholder-class="comment-class"
						@input="onEmailInput"
						class="u-flex-8"
						:value="commentForm.email"
						placeholder="邮箱" />
						<text class="comment-slider-emoji-icon  u-flex-1" @tap="isShowEmj = !isShowEmj" >{{ emojiArr[0][0] }}</text>
						<!-- <uni-icons class="emjo-icon u-flex-1" color="#999999" @tap="isShowEmj = !isShowEmj" type="heart" size="20"></uni-icons> -->
						<!-- <uni-icons class="pic-icon u-flex-1" color="#999999" type="images" size="20"></uni-icons> -->
					</view>
					<swiper class="comment-slider" indicator-dots :current="0" v-if="isShowEmj">
					    <swiper-item v-for="(item, key) in emojiArr" :key="key" class="comment-slider-emoji u-flex" :class="[key==emojiArr.length-1?'lastbox':'']">
					        <text v-for="(emoji, index) in item" :key="index" @tap="selemoji(emoji)" class="comment-slider-emoji-icon  u-flex-1">{{ emoji }}</text>
							<view class="remove-btn comment-slider-emoji-icon u-flex-1" @tap="onEmojiDelete">
								<uni-icons class="del-icon u-flex-1" color="#ccc" type="closeempty" size="24"></uni-icons>
							</view>
					    </swiper-item>
					</swiper>
				</view>
				<uni-popup ref="popup" type="message">
				    <uni-popup-message type="error" message="请填写必要信息" :duration="2000"></uni-popup-message>
				</uni-popup>
			</view>
		</view>
		<min-action-sheet ref="commentSheet" @on-close="resetCommentForm">
			<view class="pop-header u-flex" slot="header">
				<uni-icons type="closeempty" @tap="$refs.commentSheet && $refs.commentSheet.handleHide()" color="#666" size="20"></uni-icons>
				<view class="u-flex-1" v-show="!isScroll">
					<text v-if="popData.num">{{popData.num}}条回复</text>
					<text v-else>暂无回复</text>
				</view>
				<view
				v-show="isScroll"
				style="padding-left: 20upx;"
				class="user-info u-flex u-flex-row u-flex-1 u-col-between"
				v-if="popData.name">
					<view class="avatar" :style="{backgroundColor: popData.avatar}">{{popData.name.toUpperCase().slice(0,1)}}</view>
					<view class="user-name u-flex-2 u-flex u-flex-row">
						{{popData.name}}
						<text class="icon-user">楼主</text>
					</view>
				</view>
			</view>
			<scroll-view
			scroll-y="true"
			@scroll="onCommentScroll"
			class="pop-content"
			slot="main"
			:style="{
				marginBottom: showCommentForm ? '100upx' : ''
			}">
				<view class="pdlr30">
					<view class="user-info u-flex u-flex-row u-col-between" v-if="popData.name">
						<view class="avatar" :style="{backgroundColor: popData.avatar}">{{popData.name.toUpperCase().slice(0,1)}}</view>
						<view class="user-name u-flex-2 u-flex u-flex-row">
							{{popData.name}}
							<text class="icon-user">楼主</text>
						</view>
					</view>
					<view class="pop-content-desc" v-html="popData.content"></view>
					<text class="time" :style="{color: popData.avatar, marginRight: '10upx'}">{{new Date(popData.updateTime).getTime()|timeFilter}}&nbsp;</text>
				</view>
				<view class="pop-content-title" :class="!popData.num ? 'empty' : ''">
					{{popData.num ? '全部评论' : '抢先评论'}}
				</view>
				<view class="pop-content-main pdlr30" v-if="popData.children">
					<view
					v-for="item in popData.children"
					:key="item.id"
					>
						<view
						@click="onShowCommentForm(item)"
						class="user-info u-flex u-flex-row u-col-between"
						>
							<view class="avatar" :style="{backgroundColor: item.avatar}">{{item.name.toUpperCase().slice(0,1)}}</view>
							<view class="user-name u-flex-2 u-flex u-flex-row">
								{{item.name}}
							</view>
						</view>
						<view 
						@click="onShowCommentForm(item)"
						class="pop-content-comment"
						:key="item.parentId" v-if="popData.name">
							<view class="pop-content-desc" v-html="item.content"></view>
							<text class="time">{{new Date(item.updateTime).getTime()|timeFilter}}&nbsp;·</text>
							<text class="repeat">回复</text>
							<!-- <view class="pop-content-desc" v-html="popData.content"></view> -->
						</view>
						<comment-tree @on-click="onShowCommentForm" showMore :list="item.children || []">
						</comment-tree>
					</view>
				</view>
			</scroll-view>
			<view
			class="comment-form u-flex u-border-top pdlr30 u-flex-row"
			v-if="!showCommentForm"
			slot="bottom">
					<view class="u-flex-3 u-flex u-flex-row">
						<uni-icons class="edit-icon" color="#999999" type="compose" size="20"></uni-icons>
						<input
						@focus="onShowCommentForm()"
						class="content" :type="'textarea'"
						placeholder-class="comment-class"
						placeholder="写评论..."
						/>
					</view>
					<view class="u-flex-1 u-flex u-flex-row">
						<uni-icons class="u-flex-1" type="hand-thumbsup" size="20"></uni-icons>
						<uni-icons class="u-flex-1" type="redo" size="20"></uni-icons>
					</view>
			</view>
			<view class="comment-mask" slot="bottom" @click.prevent.stop="showCommentForm = false" v-else>
				<view class="comment-form u-flex u-border-top  u-flex-col is-edit fixed" @click.stop >
					<view class="u-flex u-flex-row pdlr30 u-border-bottom">
						<textarea
						:focus="showCommentForm"
						@focus="isShowEmj = false"
						placeholder-class="comment-class"
						ref="textearaDom"
						class="content u-flex-7 u-align-left"
						@input="onContentInput"
						:value="commentForm.content"
						:placeholder="contentPlaceholder" />
						<button @click="onCommentSubmit" :disabled="!canSubmit" class="u-flex-1 u-text-center submit-btn" type="default">发布</button>
						<!-- <view @click="onCommentSubmit" class="u-flex-1 u-text-center">发布</view> -->
					</view>
					<view class="u-flex u-flex-row pdlr30">
						<input style="margin-right: 10upx"
						placeholder-class="comment-class"
						:type="'text'"
						class="u-flex-8"
						@input="onNameInput"
						:value="commentForm.name"
						placeholder="用户名"
						/>
						<input :type="'email'"
						placeholder-class="comment-class"
						@input="onEmailInput"
						class="u-flex-8"
						:value="commentForm.email"
						placeholder="邮箱" />
						<text class="comment-slider-emoji-icon  u-flex-1" @tap="isShowEmj = !isShowEmj" >{{ emojiArr[0][2] }}</text>
						<!-- <uni-icons class="emjo-icon u-flex-1" color="#999999" @tap="isShowEmj = !isShowEmj" type="heart" size="20"></uni-icons> -->
						<!-- <uni-icons class="pic-icon u-flex-1" color="#999999" type="images" size="20"></uni-icons> -->
					</view>
					<swiper class="comment-slider" indicator-dots :current="0" v-if="isShowEmj">
					    <swiper-item v-for="(item, key) in emojiArr" :key="key" class="comment-slider-emoji u-flex" :class="[key==emojiArr.length-1?'lastbox':'']">
					        <text v-for="(emoji, index) in item" :key="index" @tap="selemoji(emoji)" class="comment-slider-emoji-icon  u-flex-1">{{ emoji }}</text>
							<view class="remove-btn comment-slider-emoji-icon u-flex-1" @tap="onEmojiDelete">
								<uni-icons class="del-icon u-flex-1" color="#ccc" type="closeempty" size="24"></uni-icons>
							</view>
					    </swiper-item>
					</swiper>
				</view>
				<uni-popup ref="popup" type="message">
				    <uni-popup-message type="error" message="请填写必要信息" :duration="2000"></uni-popup-message>
				</uni-popup>
			</view>
		</min-action-sheet>
	</view>
</template>

<script>
	import CommentTree from '@/components/Comment.vue'
	import minActionSheet from '@/components/min-action-sheet/min-action-sheet'
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import emoji from '@/components/m-emoji/emoji.js'
	export default {
		components: {
			CommentTree,
			minActionSheet,
			uniIcons,
			uniPopup,
			uniPopupMessage
		},
		data() {
			return {
				viewData: {},
				popData: {},
				showCommentForm: false,
				commentForm: {
					name: '',
					articleId: '',
					content: '',
					email: ''
				},
				contentPlaceholder: '优质的评论将会优先展示',
				isShowEmj: false,
				emojiArr: [],
				selectEmoji: [],
				canSubmit: false,
				isScroll: false // 是否滚动
			}
		},
		computed: {
		},
		onLoad(query) {
			this.init(query)
		},
		watch: {
			showCommentForm (val) {
				if (!val) {
					this.resetCommentForm()
				}
			}
		},
		onPullDownRefresh() {
			this.init(this.viewData)
		},
		methods: {
			async init (query) {
				let res = await this.$api.article.getById({ id: query.id })
				if (res && res.success) {
					this.viewData = res.data
					this.commentForm.articleId = res.data.id
				}
				setTimeout(function() {
					uni.stopPullDownRefresh()
				}, 500)
				let page = Math.ceil(emoji.length/21)
				for (let i = 0; i < page - 25; i++) {
					this.emojiArr[i] = [];
					for (let k = 0; k < 20; k++) {
						emoji[i*21+k]?this.emojiArr[i].push(
						emoji[i*21+k]
						):''
					}
				}
			},
			onCommentClick (item) {
				let that = this
				this.$refs.commentSheet.handleShow({}).then(res => {
					this.popData = item
				})
			},
			onShowCommentForm (item) {
				// this.showCommentForm = false
				this.isShowEmj = false
				if (item) {
					// this.commentForm = item
					this.showCommentForm = !this.showCommentForm
					this.commentForm.parentId = item.id
					this.contentPlaceholder = `回复 ${item.name}: `
				} else {
					this.showCommentForm = true
					this.commentForm.parentId = this.popData.id
				}
				this.$nextTick(function(){
					this.$refs.textearaDom && this.$refs.textearaDom.$el.focus()
					// console.log(this.commentForm.parentId, this.$refs.textearaDom.$el.focus(), 'this.showCommentForm')
				})
			},
			onContentInput (e) {
				this.commentForm.content = e.detail.value
				e.detail.value && (this.canSubmit = true)
			},
			onNameInput (e) {
				this.commentForm.name = e.detail.value
				e.detail.value && (this.canSubmit = true)
			},
			onEmailInput (e) {
				this.commentForm.email = e.detail.value
				e.detail.value && (this.canSubmit = true)
			},
			onCommentSubmit () {
				console.log(this.commentForm, 'this.commentForm')
				if (!this.commentForm.content || !this.commentForm.name || !this.commentForm.email) {
					this.$refs.popup.open()
					return
				}
				console.log(this.commentForm, 'this.commentForm')
				this.$api.comment.add({ ...this.commentForm }).then(res => {
					if (res && res.success) {
						this.showCommentForm = false
						this.$refs.commentSheet.handleHide()
						this.init(this.$route.query)
					}
				}).catch(() => {})
			},
			selemoji (emoji) {
				this.commentForm.content += emoji
				this.selectEmoji.push(emoji)
			},
			resetCommentForm (maskClose) {
				this.isShowEmj = false
				this.canSubmit = false
				this.showCommentForm = false
				this.commentForm = {
					name: '',
					articleId: this.commentForm.articleId,
					content: '',
					email: '',
					parentId: maskClose ? '' : this.popData.id
				}
				maskClose && (this.popData = {})
				this.contentPlaceholder = '优质的评论将会优先展示'
				// console.log(this.commentForm, maskClose, 'this.showCommentForm')
			},
			onEmojiDelete () {
				// debugger
				let content = this.commentForm.content
				let len = this.selectEmoji.length - 1
				len && this.selectEmoji.pop(this.selectEmoji[len])
				content = content.slice(0, content.indexOf(this.selectEmoji[len]))
				this.commentForm.content = content
				console.log(this.selectEmoji, content, 'content.indexOf(this.selectEmoji[0])')
			},
			onCommentScroll (event) {
				if (event.detail.scrollTop > 50) {
					this.isScroll = true
				} else {
					this.isScroll = false
				}
			}
		}
	}
</script>

<style lang="scss">
.view-content {
	padding-bottom: 100upx;
	.title {
		font-size: 40upx;
		font-weight: 600;
		padding: 20upx 30upx;
		border-bottom: 1px solid $c-e8;
	}
	.public-time {
		font-size: 32upx;
	}
	.pop-header {
		height: 68upx;
		line-height: 68upx;
	}
	.main {
		.desc {
			font-size: 28upx;
			width: 100%;
			min-height: 600upx;
			overflow: hidden;
			line-height: 32upx;
			padding: 0 30upx;
			margin-bottom: 30upx;
			/deep/ p {
				line-height: 54upx;
				font-size: 34upx;
			}
		}
	}
	.user-info {
		transition: all 0.5s;
		.avatar {
			width: 68upx;
			height: 68upx;
			overflow: hidden;
			border-radius: 68upx;
			color: $c-fff;
			text-align: center;
			line-height: 68upx;
			margin-right: 10upx;
			background-color: $c-ccc;
		}
		.icon-user {
			padding: 6upx;
			font-size: 20upx;
			line-height: 20upx;
			margin-left: 20upx;
			color: $primary;
			border: 1px solid $primary;
			border-radius: 5upx;
		}
	}
	.pop-content {
		min-height: 900upx;
		max-height: 900upx;
		overflow: hidden;
		position: relative;
		overflow-y: auto;
		padding: 0 0 100upx;
		border-top-right-radius: 20upx;
		border-top-left-radius: 20upx;
		&-desc {
			margin-left: 68upx;
			margin-bottom: 10upx;
			font-size: 28upx;
		}
		&-title {
			border-bottom: 1px solid $c-e8;
			padding: 0 30upx 20upx;
			&.empty {
				border-top: 1px solid $c-e8;
				border-bottom: none;
				padding: 20upx 30upx 0;
			}
		}
		.time {
			margin-left: 70upx;
			font-size: 24upx;
			margin-right: 10upx;
		}
		.repeat {
			font-size: 24upx;
		}
		.parent-name {
			color: $primary;
		}
	}
	.comment-form {
		position: fixed;
		bottom: 0;
		// top: calc(100% - 290upx);
		left: 0;
		background-color: $c-fff;
		width: 100%;
		.comment-class {
			color: $c-999;
		}
		.edit-icon {
			position: absolute;
			left: 60upx;
			top: 28upx;
			color: $c-999;
		}
		uni-input, uni-textarea {
			border: 1px solid $c-e8;
			border-radius: 60upx;
			font-size: 28upx;
			padding: 10upx 30upx 5px 80upx;
			background-color: $c-e8;
		}
		uni-input.content {
			width: 400upx;
		}
		uni-textarea.content {
			padding-left: 20upx;
			border-radius: 10upx;
			width: 560upx;
			height: 100upx;
		}
		&.is-edit {
			uni-input {
				padding-left: 30upx;
				margin-bottom: 0;
			}
		}
		.submit-btn {
			font-size: 32upx;
			// color: $c-333;
			background-color: $c-fff;
			&:after {
				border: 0;
				background-color: transparent;
			}
		}
	}
	.comment-mask {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		// background: rgba(0,0,0,0.2);
		background: transparent;
		height: 100%;
		.comment-form {
			transition: height 0.5s;
		}
	}
}
.comment-slider {
    width: 100%;
    height: 300upx;
	background-color: $c-f8;
	/deep/.uni-swiper-slides {
		bottom: 40upx;
	}
    &-emoji {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content:center;
        &-icon {
            flex: 1;
			flex-basis: 14.2%;
			font-size: 50upx;
            text-align: center;
            // padding: 30upx;
        }
		.remove-btn .del-icon {
			border: 1px solid $c-ccc;
			border-radius: 10upx;
			overflow: hidden;
		}
    }
}
// <!-- 设置最后一列左靠齐 -->
.lastbox{
    justify-content: flex-start;
}
.comment {
	width: 100%;
	.comment-title {
		text-align: left;
		padding: 20upx 30upx;
		margin-bottom: 10upx;
		border-bottom: 1upx solid $c-e8;
		border-top: 1upx solid $c-e8;
	}
}
</style>
