<template>
  <div class="comment-tree">
        <div class="comment-tree-item clearfix" v-for="item in data" :key="item.id">
            <div class="avatar fl" :style="{ backgroundColor: item.avatar }">{{ item.name.slice(0,1).toLocaleUpperCase() }}</div>
            <div class="userinfo fl tl">
                <div class="username">{{ item.name }}</div>
                <div class="desc " v-html="item.content"></div>
            </div>
            <template v-if="item.children && item.children.length">
                <comment-tree :data="item.children" class="comment-tree-children fl"></comment-tree>
            </template>
        </div>
  </div>
</template>
<style lang="less">
.comment-tree {
    &-item {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
        .avatar {
            width: 36px;
            height: 36px;
            font-size: 18px;
            color: @white;
            line-height: 36px;
            border-radius: 36px;
            background-color: @c-e8;
            // border: 1px solid @c-e8;
            margin-right: 10px;
        }
        .userinfo {
            .username {
                font-size: 16px;
                color: @c-333;
                margin-bottom: 10px;
            }
            .desc {
                font-size: 14px;
                color: @c-666;
            }
        }
    }
    &-children {
        width: 100%;
        margin-top: 10px;
        padding-left: 43px;
    }
}
</style>
<script>
export default {
    name: 'CommentTree',
    props: {
        data: {
            type: Array,
            default: () => []
        }
    }
}
</script>
