<template>
	<view class="view-content">
		<view class="title">
			{{viewData.title}}
		</view>
		<view class="main u-border-bottom">
			<view class="desc" v-if="viewData.content" v-html="$options.filters.formatRichText(viewData.content)"></view>
			<view class="comment">
				<view class="comment-title u-text-left">评论</view>
				<view class="pdlr30">
					<comment-tree @on-click="onCommentClick" :list="viewData.comment">
					</comment-tree>
				</view>
			</view>
		</view>
		<min-action-sheet ref="commentSheet">
			<view class="pop-header" slot="header">
				<text v-if="popData.num">{{popData.num}}条回复</text>
				<text v-else>暂无回复</text>
			</view>
			<view class="pop-content" slot="main">
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
							<text class="time" :style="{color: item.avatar, marginRight: '10upx'}">{{new Date(item.updateTime).getTime()|timeFilter}}&nbsp;·</text>
							<text class="repeat">回复</text>
							<!-- <view class="pop-content-desc" v-html="popData.content"></view> -->
						</view>
						<comment-tree @on-click="onShowCommentForm" showMore :list="item.children || []">
						</comment-tree>
					</view>
				</view>
			</view>
			<view class="comment-form u-flex u-border-top pdlr30 u-flex-row" slot="bottom">
				<view class="left u-flex-3 u-flex" :class="showCommentForm?'u-flex-col is-edit':'u-flex-row'">
					<uni-icons class="edit-icon" color="#999999" type="compose" size="20"></uni-icons>
					<input @focus="onShowCommentForm()" v-if="!showCommentForm" class="content" :type="'textarea'" placeholder="写评论..."/>
					<textarea @focus="onShowCommentForm()" ref="textearaDom" v-else class="content" :type="showCommentForm?'textarea':'text'" @input="onContentInput" :value="commentForm.content" placeholder="写评论..."/>
					<view class="u-flex u-flex-row">
						<input v-if="showCommentForm" style="margin-right: 10upx" :type="'text'" @input="onNameInput" :value="commentForm.name" placeholder="用户名"/>
						<input v-if="showCommentForm" :type="'email'" @input="onEmailInput" :value="commentForm.email" placeholder="邮箱"/>
					</view>
				</view>
				<view class="right u-flex-1 u-flex u-flex-row">
					<view v-if="showCommentForm" @click="onCommentSubmit" class="u-flex-1 u-text-center">发布</view>
					<template v-else>
						<uni-icons class="u-flex-1" type="hand-thumbsup" size="20"></uni-icons>
						<uni-icons class="u-flex-1" type="redo" size="20"></uni-icons>
					</template>
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
	// import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
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
				}
			}
		},
		computed: {
		},
		onLoad(query) {
			this.init(query)
		},
		methods: {
			async init (query) {
				let res = await this.$api.article.getById({ id: query.id })
				if (res && res.success) {
					this.viewData = res.data
					this.commentForm.articleId = res.data.id
				}
			},
			onCommentClick (item) {
				 this.$refs.commentSheet.handleShow({})
				this.popData = item
			},
			onShowCommentForm (item) {
				// this.showCommentForm = false
				if (item) {
					// this.commentForm = item
					this.showCommentForm = !this.showCommentForm
					this.commentForm.parentId = item.id
				} else {
					this.showCommentForm = true
				}
				// console.log(this.commentForm, this.showCommentForm, 'this.showCommentForm')
			},
			onContentInput (e) {
				this.commentForm.content = e.detail.value
			},
			onNameInput (e) {
				this.commentForm.name = e.detail.value
			},
			onEmailInput (e) {
				this.commentForm.email = e.detail.value
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
					}
				}).catch(() => {})
			}
		}
	}
</script>

<style lang="scss">
.view-content {
	.title {
		font-size: 36upx;
		font-weight: 600;
		padding: 20upx 30upx;
		border-bottom: 1px solid $c-e8;
	}
	.main {
		.desc {
			font-size: 28upx;
			width: 100%;
			min-height: 600upx;
			overflow: hidden;
			line-height: 32upx;
			margin: 20upx 0;
			padding: 0 30upx;
		}
	}
	.pop-content {
		min-height: 900upx;
		max-height: 900upx;
		overflow: hidden;
		position: relative;
		overflow-y: auto;
		padding: 20upx 0;
		border-top-right-radius: 20upx;
		border-top-left-radius: 20upx;
		.user-info {
			.avatar {
				width: 70upx;
				height: 70upx;
				overflow: hidden;
				border-radius: 70upx;
				color: $c-fff;
				text-align: center;
				line-height: 70upx;
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
		&-desc {
			margin-left: 70upx;
			margin-bottom: 10upx;
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
			font-size: 22upx;
		}
		.repeat {
			font-size: 22upx;
		}
		.parent-name {
			color: $primary;
		}
	}
	.comment-form {
		.left {
			position: relative;
			.edit-icon {
				position: absolute;
				left: 30upx;
				top: 5upx;
				color: $c-999;
			}
			uni-input, uni-textarea {
				border: 1px solid $c-e8;
				border-radius: 60upx;
				font-size: 20upx;
				padding: 10upx 30upx 5px 80upx;
			}
			uni-input.content {
				width: 400upx;
			}
			&.is-edit {
				.edit-icon {
					display: none;
				}
				uni-textarea.content {
					padding-left: 20upx;
					border-radius: 5upx;
					width: 500upx;
					height: 100upx;
					margin-bottom: 10upx;
				}
				uni-input {
					padding-left: 30upx;
					margin-bottom: 0;
				}
			}
		}
	}
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
