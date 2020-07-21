<template>
    <div class="comment-tree">
        <div class="comment-form" v-if="commentForm.parentId === null && isBodyClick">
            <!-- <vue-editor
            class="comment-form-content"
            :editor-options="editorSettings"
            :editor-toolbar="customToolbar"
            v-model="content"
            > </vue-editor> -->
            <editor v-model="commentForm.content" :is-clear="isClear" @change="editorChange"></editor>
            <div class="submit-action">
                <label for="username">用户名: </label>
                <input type="text" id="username" v-model="commentForm.name" placeholder="请输入用户名" class="username">
                <label for="email">邮箱: </label>
                <input type="text" id="email" v-model="commentForm.email" placeholder="请输入邮箱" class="email">
                <button @click.prevent="submitComment">提交</button>
            </div>
        </div>
        <div class="comment-tree-item clearfix" v-for="item in data" :key="item.id">
            <div class="avatar fl" :style="{ backgroundColor: item.avatar }">{{ item.name.slice(0,1).toLocaleUpperCase() }}</div>
            <div class="userinfo fl tl">
                <div class="name">{{ item.name }}</div>
                <div class="desc" v-html="item.content"></div>
            </div>
            <div class="time fl tl" @click.prevent="onCommentClick(item)">{{ new Date(item.createTime).getTime() | timeFilter }} - <i class="icon-msg"></i></div>
            <div class="comment-form fl" ref="commentDom" v-if="commentForm.parentId === item.id">
                <editor v-model="commentForm.content" :is-clear="isClear" @change="editorChange"></editor>
                <div class="submit-action">
                    <label for="username">用户名: </label>
                    <input type="text" id="username" v-model="commentForm.name" placeholder="请输入用户名" class="username">
                    <label for="email">邮箱: </label>
                    <input type="text" id="email" v-model="commentForm.email" placeholder="请输入邮箱" class="email">
                    <button @click.prevent="submitComment(item)">提交</button>
                </div>
            </div>
            <template v-if="item.children && item.children.length">
                <comment-tree :data="item.children" is-children @submit="submitComment(item)" class="comment-tree-children fl"></comment-tree>
            </template>
        </div>
    </div>
</template>
<style lang="less" scoped>
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
            .name {
                font-size: 16px;
                color: @c-333;
                margin-bottom: 10px;
            }
            .desc {
                font-size: 14px;
                color: @c-666;
            }
        }
        .time {
            width:100%;
            margin-left: 45px;
            margin-top: 10px;
            font-size: 12px;
        }
    }
    &-children {
        width: 100%;
        margin-top: 10px;
        padding-left: 43px;
    }
    .comment-form {
        margin: 10px 45px 10px 0;
        width: 680px;
        .submit-action {
            border: 1px solid @c-ccc;
            border-top: 0;
            text-align: left;
            color: @c-666;
            padding: 10px 15px;
            input {
                height: 32px;
                width: 180px;
                padding-left: 10px;
                border: 1px solid @c-ccc;
            }
            button {
                height: 32px;
                width: 100px;
                background-color: @primary;
                color: @white;
                font-size: 14px;
                border-radius: 3px;
                text-align: center;
                line-height: 32px;
            }
        }
    }
}
</style>
<script>
import Editor from '@/components/Editor'
export default {
    name: 'CommentTree',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        isChildren: {
            type: Boolean,
            default: false
        }
    },
    components: { Editor },
    data () {
        return {
            isClear: false,
            currentId: 0,
            commentForm: {
                name: '',
                parentId: null,
                email: '',
                content: ''
            },
            isBodyClick: true
        }
    },
    mounted () {
        document.addEventListener('click', (e) => {
            if (document.querySelector('.comment-form')) {
                if (!document.querySelector('.comment-form').contains(e.target)) {
                    // 这句话是说如果我们点击到了class为comment-form以外的区域
                    this.isBodyClick = true
                }
            }
        })
    },
    methods: {
        onCommentClick (item) {
            this.currentId = item.id
            this.commentForm.parentId = item.id
            this.isBodyClick = false
            if (item && item.children) {
                this.$emit('click', item)
                this.isBodyClick = true
            }
        },
        editorChange () {

        },
        submitComment (item) {
            let { name, email, content, parentId = null } = this.commentForm
            if (!name || !email || !content || content.includes('<p><br></p>')) {
                // alert('请输入表单信息~!')
                this.$message.error('请输入表单信息!')
                return
            }
            if (item) {
                parentId = item.id
            }
            this.$emit('submit', { ...this.commentForm, parentId })
        },
        reset () {
            this.commentForm = {
                ...this.commentForm,
                content: ''
            }
            this.currentId = 0
            this.isClear = true
        }
    }
}
</script>
