<template name="CommentTree">
	<view class="comment-tree">
		<template v-if="list.length">
			<view v-for="item in list" :key="item.id" @click="onClick(item)">
				<template>
					<view class="user-info u-flex u-flex-row u-col-between">
						<view class="avatar" :style="{backgroundColor: item.avatar}">{{item.name.toUpperCase().slice(0,1)}}</view>
						<view class="user-name u-flex-2">
							{{item.name}}
						</view>
					</view>
					<view class="pop-content-desc comment-tree-content" v-if="showMore" v-html="formatHtml(item)"></view>
					<view class="comment-tree-content" v-else v-html="item.content">
					</view>
				</template>
				<view class="bottom">
					<text class="time">{{new Date(item.updateTime).getTime()|timeFilter}}&nbsp;·</text>
					<text class="more-btn" v-if="item.children && item.children.length && !showMore">
						{{getCommentNum(item.children)}}个回复
					</text>
					<text v-else>回复</text>
				</view>
				<comment-tree v-if="showMore" @on-click="onClick(item)" showMore :list="item.children"></comment-tree>
			</view>
		</template>
		<template v-else-if="!showMore">
			<view>暂无评论~</view>
		</template>
	</view>
</template>
<script>
	import { getCommentNum } from '@/utils'
	export default {
		name: 'CommentTree',
		props: {
			list: {
				type: Array,
				default: () => []
			},
			showMore: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				getCommentNum
			}
		},
		methods: {
			onClick (item) {
				let data = { ...item }
				item.children && (data.num = getCommentNum(item.children))
				this.$emit('on-click', data)
			},
			formatHtml (item) {
				let html = item.content
				 if (item.parentId !== null) {
					html += '<text class="parent-name" style="color: #ff9900;">//@'+ item.parentName + ': </text>'
					html += item.parentContent
					html = html.replace(/<p[^>]*>/gi, '<text style="break-word: word-break">')
					html = html.replace(/<\/p[^>]*>/gi, '</text>')
				}
				return html
			}
		}
	}
</script>

<style lang="scss">
.comment-tree {
	// padding: 20upx 30upx;
	.user-info {
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
	}
	&-content {
		margin-left: 68upx;
		margin-bottom: 10upx;
		font-size: 28upx;
	}
	
	.bottom {
		margin-left: 68upx;
		font-size: 24upx;
		.time {
			font-size: 24upx;
			margin-right: 10upx;
		}
		.more-btn {
			background-color: $c-e8;
			border-radius: 30upx;
			font-size: 24upx;
			padding: 5upx 20upx;
		}
	}
	
}
</style>
