import React, { useState, Fragment } from 'react';
import {
    Form, Row, Col, Input,
    Select, Table, Tag,
    notification, Badge,
    message, Modal,
    Alert,
    Button, Cascader
} from 'antd';
import {
    CommentOutlined
} from '@ant-design/icons';

import Head from 'next/head';
import Router, { withRouter } from 'next/router'
import { Editor as BraftEditor } from '@/components/Editor'

const { Option, OptGroup } = Select;
function handleChange (value) {
    console.log(`selected ${value}`);
}
const CommentTree = (props) => (
    <Fragment>
        {props.data.map(el => (
            <div className="comment-list-item">
                <div className="title clearfix">
                    <span className="avatar fl" style={{ backgroundColor: el.avatar }}>{el.name.slice(0, 1).toUpperCase()}</span>
                    <p className="name fl" style={{ color: el.avatar }}>{el.name}</p>
                </div>
                <div className="content">
                    <div className="content-text" dangerouslySetInnerHTML={{ __html: el.content }}></div>
                    <div className="comment-icon" onClick={() => props.parent.setState({ comment: { parentId: el.id } })} title="点击进行评论"><CommentOutlined /></div>
                </div>
                {el.children && <div style={{ marginLeft: 40, marginTop: 10 }} ><CommentTree data={el.children} parent={props.parent}></CommentTree></div>}
            </div>
        ))}
    </Fragment>
)
class ArticleView extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ $api, ctx }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        console.log(ctx.query, 'query')
        let res = await $api.article.getById({ params: { id: ctx.query.id } })
        if (res && res.success) {
            console.log(res.data, 'comment')
            return {
                reviewData: res.data
            }
        } else {
            return {
                reviewData: {}
            }
        }
    }

    state = {
        ...this.props,
        comment: {
            name: '',
            email: '',
            content: ''
        }
    }
    handleReview (id) {
        $api.article.getById({ params: { id } }).then(res => {
            if (res && res.success) {
                this.setState({ reviewData: res.data })
            } else {
                message.error(res.message)
            }
        })
    }
    setArticle (callback) {
        return callback(this.state.reviewData)
    }
    setComment (callback) {
        return callback(this.state.comment)
    }
    // 提交评论
    handleSubmitComment () {
        let commentData = { articleId: this.state.reviewData.id, ...this.state.comment }
        const { name, email, content } = commentData
        if (!name || !email || !content)
            return message.error('请填写必要信息')
        console.log(commentData, 'commentData')
        $api.comment.add(commentData).then(res => {
            if (res && res.success) {
                message.success(res.message)
                this.handleReview(this.state.reviewData.id)
                this.setState({
                    comment: {
                        parentId: null,
                        name: '',
                        email: '',
                        content: ''
                    }
                })
                return
            }
            res && message.error(res.message)
        })
    }
    componentDidMount () {
        this.setState({ loading: false })
    }
    render () {
        const { ...state } = this.state
        return (
            <Fragment>
                <Head>
                    <title>文章详情</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>文章详情</h3>
                <div className="byt-article-view-content scroll-design" style={{ height: 680, paddingRight: 20, overflow: 'hidden', overflowY: 'auto' }}>
                    <h3 className="text-xl mb-5 text-center">{this.state.reviewData.title}</h3>
                    {/* <div dangerouslySetInnerHTML={{ __html: this.state.reviewData.content }}></div> */}
                    <div className="byt-article-view-content-main">
                        <BraftEditor
                            value={this.state.reviewData.content}
                            style={{ width: 1000, margin: '0 auto' }}
                            onChange={(value) => {
                                this.setArticle((article) => {
                                    article.content = value;
                                    return article;
                                });
                            }}
                            readOnly
                        ></BraftEditor>
                    </div>
                    {this.state.reviewData.tags && this.state.reviewData.tags.length ? <div className="tags">
                        <h3 className="text-2 mb-5 mt-5">关联标签</h3>
                        <span>
                            {this.state.reviewData.tags && this.state.reviewData.tags.map((tag, index) => {
                                let color = index > 1 ? 'geekblue' : 'green';
                                if (tag.value === '前端') {
                                    color = 'volcano';
                                }
                                return (
                                    <Tag color={color} key={tag.id} className="mb-1">
                                        {tag.value[0].toUpperCase() + tag.value.slice(1)}
                                    </Tag>
                                );
                            })}
                        </span>
                    </div> : null}
                    <div className="comment">
                        <h3 className='text-gray-600 text-lg leading-4 mb-10 divide-x border-solid border-l-4 pl-2 border-orange-f9'>最新评论</h3>
                        <div className={"comment-list"}>
                            <CommentTree data={this.state.reviewData.comment} parent={this}></CommentTree>
                        </div>
                        <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>添加评论</h3>
                        <div className="comment-form">
                            <BraftEditor
                                style={{ borderBottom: '1px solid #ccc' }}
                                value={this.state.comment.content}
                                onChange={(value) => {
                                    this.setComment((comment) => {
                                        comment.content = value;
                                        return comment;
                                    });
                                }}
                            ></BraftEditor>
                            <div className="comment-userinfo" >
                                <Input
                                    placeholder="用户名"
                                    onChange={(e) => {
                                        this.setState({ comment: { ...this.state.comment, name: e.target.value.replace(/[\d]/g, '') } })
                                    }}
                                    value={this.state.comment.name}
                                    style={{ width: "40%", marginRight: 20 }}></Input>
                                <Input placeholder="邮箱"
                                    onChange={(e) => {
                                        this.setState({ comment: { ...this.state.comment, email: e.target.value.replace(/[\d]/g, '') } })
                                    }}
                                    value={this.state.comment.email}
                                    style={{ width: "40%", marginRight: 20 }}></Input>
                                <Button onClick={() => this.handleSubmitComment()}>提交</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default ArticleView