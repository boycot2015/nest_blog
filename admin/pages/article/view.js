import React, { useState, Fragment } from 'react';
import {
    Form, Row, Col, Input,
    Select, Table, Tag,
    notification, Badge,
    message, Modal,
    Alert,
    Button, Cascader
} from 'antd';

import Head from 'next/head';
import Router, { withRouter } from 'next/router'
import { Editor as BraftEditor } from '@/components/Editor'

import {
    CommentTree,
    CommentForm
} from '@/components/Comment'
let colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
    'green', 'cyan', 'blue', 'geekblue', 'blue', 'purple'];
class ArticleView extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ $api, ctx }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        // console.log(ctx.query, 'query')
        let res = await $api.article.getById({ id: ctx.query.id })
        if (res && res.success) {
            // console.log(res.data, 'comment')
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
            parentId: null,
            name: '',
            email: '',
            content: ''
        }
    }
    // handleReview (id) {
    //     $api.article.getById({ params: { id } }).then(res => {
    //         if (res && res.success) {
    //             this.setState({ reviewData: res.data })
    //         } else {
    //             res && message.error(res.message)
    //         }
    //     })
    // }
    setArticle (callback) {
        return callback(this.state.reviewData)
    }
    setComment (callback) {
        return callback(this.state.comment)
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
                <div className="byt-article-view-content scroll-design" style={{ height: 700, paddingRight: 20, overflow: 'hidden', overflowY: 'auto' }}>
                    <h3 className="text-xl mb-5 text-center font-bold">{this.state.reviewData.title}</h3>
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
                        {
                            this.state.reviewData.tags && this.state.reviewData.tags.length &&
                                this.state.reviewData.categoryName && this.state.reviewData.categoryName.length ?
                                <div className="others" style={{ width: 1000, margin: '0 auto', border: '1px dashed #e8e8e8', padding: '5px 20px' }}>
                                    {this.state.reviewData.tags && this.state.reviewData.tags.length ? <div style={{ width: 1000, margin: '0 auto 30px' }} className="tags">
                                        <h3 className="text-2 mb-5 mt-5">关联标签: </h3>
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
                                    {this.state.reviewData.categoryName && this.state.reviewData.categoryName.length ? <div style={{ width: 1000, margin: '0 auto 30px' }} className="category">
                                        <h3 className="text-2 mb-5 mt-5">所属分类: </h3>
                                        <span style={{
                                            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                                            padding: '5px 10px',
                                            color: 'white',
                                            borderRadius: 5
                                        }}>
                                            {this.state.reviewData.categoryName}
                                        </span>
                                    </div> : null}
                                </div> : null
                        }
                    </div>
                    <div className="comment">
                        <h3 className='text-gray-600 text-lg leading-4 mb-10 divide-x border-solid border-l-4 pl-2 border-orange-f9'>最新评论</h3>
                        <div className={"comment-list"}>
                            <CommentTree data={this.state.reviewData.comment} parent={this}></CommentTree>
                        </div>
                        <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>添加评论</h3>
                        <CommentForm data={this} />
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default ArticleView