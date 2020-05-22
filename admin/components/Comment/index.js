import React, { useState, Fragment } from 'react';
import {
    Form, Row, Col, Input,
    Select, Table, Tag,
    notification, Badge,
    message, Modal,
    Alert,Empty,
    Button, Cascader
} from 'antd';
import {
    CommentOutlined
} from '@ant-design/icons';
import { Editor as BraftEditor } from '@/components/Editor'

/**
 * 评论表单 20120-05-21
 * @param {*} data 父级组件
 */
export const CommentForm = (data) => {
    let props = data.data
    // 提交评论
    const handleSubmitComment = values => {
        let commentData = {
            articleId: props.state.reviewData.id,
            name: values.name,
            email: values.email,
            content: props.state.comment.content
        }
        props.state.comment.parentId !== null && (commentData.parentId = props.state.comment.parentId)
        const { name, email, content } = commentData
        if (!name || !email || content === '<p></p>') {
            console.log(commentData, 'commentData')
            if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email))) {
                return message.error('请输入正确的邮箱地址！')
            }
            return message.error('请填写必要信息')
        }
        $api.comment.add(commentData).then(res => {
            if (res && res.success) {
                message.success(res.message)
                props.handleReview(props.state.reviewData.id)
                props.setState({
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
    };
    return (
        <Form
            layout='inline'
            initialValues={{
                remember: true,
                name: '',
                content: '',
                email: ''
            }}
            onFinish={handleSubmitComment}
            className="comment-form"
        >
            <BraftEditor
                style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}
                value={props.state.comment.content}
                onChange={(value) => {
                    props.setComment((comment) => {
                        comment.content = value;
                        return comment;
                    });
                }}
            ></BraftEditor>
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
            >
                <Input
                    placeholder="用户名"
                    onChange={(e) => {
                        props.setState({ comment: { ...props.state.comment, name: e.target.value.replace(/[\d]/g, '') } })
                    }}
                    value={props.state.comment.name}
                    style={{ marginRight: 20, marginLeft: 10, width: '300px' }}></Input>
            </Form.Item>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: '请输入邮箱!',
                    },
                ]}
            >
                <Input placeholder="邮箱"
                    onChange={(e) => {
                        props.setState({ comment: { ...props.state.comment, email: e.target.value } })
                    }}
                    value={props.state.comment.email}
                    style={{ marginRight: 20, width: '300px' }}></Input>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit">提交</Button>
            </Form.Item>
        </Form>
    )
}

/**
 * 评论树
 * @param {*} props 传入组件属性或方法
 */
export const CommentTree = (props) => (
    <Fragment>
        {props.data.map(el => (
            <div className="comment-list-item" key={el.id}>
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
        {props.data.length === 0 && <Empty description={'暂无评论，快来抢沙发~'} />}
    </Fragment>
)