import React, { useState, Fragment } from 'react';
import Head from 'next/head';
import {
    Form, Tag, notification,
    Button, Row, Col, Input,
    Select, Table, Cascader,
    Badge, message, Modal
} from 'antd';
const LabelForm = (props) => {
    const [form] = Form.useForm();
    const [formLayout] = useState('inline');
    let colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
        'green', 'cyan', 'blue', 'geekblue', 'blue', 'purple'];
    const handleAddTag = (value) => {
        props.setCategoryData(value)
    }
    const handleTagClick = (tag) => {
        form.setFieldsValue(tag);
        props.setCategoryStatus(true)
    }
    const handleCloseCategory = async (e, tag) => {
        e.preventDefault();
        await props.setCategoryStatus(false)
        form.setFieldsValue({
            value: ''
        });
        props.setCategoryData(tag)
    }
    return (
        <Form
            layout={formLayout}
            onFinish={handleAddTag}
            style={{ width: 1200 }}
            form={form}>
            <Row>
                {<Col span={10}
                    style={{ borderRight: '1px solid #e8e8e8', paddingRight: 20, marginRight: 40 }}>
                    <Form.Item name='value'
                        rules={[
                            {
                                required: true,
                                message: '请输入分类名称',
                            }
                        ]}>
                        <Input placeholder="请输入分类名称"
                            value={props.categories[0] && props.categories[0].value}></Input>
                    </Form.Item>
                    <Form.Item name='id' style={{ display: 'none' }}>
                        <Input hidden
                            value={props.categories[0] && props.categories[0].value}></Input>
                    </Form.Item>
                    <Form.Item style={{ marginTop: 20 }}>
                        <Button type="primary" htmlType="submit">{props.isEdit ? '编辑' : '新增'}</Button>
                    </Form.Item>
                </Col>}
                <Col span={10} >
                    <Form.Item style={{ minWidth: 500, maxWidth: 800 }}>
                        {props.categories && props.categories.map((category, index) => (
                            <Tag style={{ marginBottom: 10 }}
                                onClose={(e) => handleCloseCategory(e, category)}
                                closable
                                color={colors[index] || colors[0]}
                                onClick={() => handleTagClick(category)} key={category.id}>
                                {category.value[0].toUpperCase() + category.value.slice(1)}
                            </Tag>
                        ))}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
class Category extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        data: this.props.data,
        total: this.props.total,
        isEdit: false,
        initData: {}
    }
    static async getInitialProps ({ $api, userinfo }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const res = await $api.category.get()
        // console.log(res.data, cookies, 'data')
        if (res && res.success) {
            return {
                loading: false,
                data: res.data[0],
                total: res.data[1],
                userinfo
            }
        } else {
            return {
                loading: true,
                data: [],
                total: 0,
                userinfo
            }
        }

    }
    handleSetCategory (value) {
        let api = value.id && this.state.isEdit ? 'edit' : 'add';
        let params = {}
        if (value.id && !this.state.isEdit) {
            api = 'delete'
            params.params = { id: parseInt(value.id) }
            Modal.confirm({
                title: '温馨提示',
                content: '确认删除？',
                okText: '确认',
                onOk: () => {
                    $api.category[api](params).then(res => {
                        res && !res.success && message.error(res.message)
                        res && res.success && message.success(res.data)
                        res && res.success && $api.tag.get().then(res => {
                            this.setState({
                                data: res.data[0]
                            })
                        })
                    })
                },
                cancelText: '取消'
            })
        } else {
            params.data = value
            $api.tag[api](params).then(res => {
                res && !res.success && message.error(res.message)
                res && res.success && message.success(res.data)
                res && res.success && $api.tag.get().then(res => {
                    this.setState({
                        data: res.data[0]
                    })
                })
            })
        }
    }
    render () {
        return (
            <Fragment>
                <Head>
                    <title>分类管理</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>分类管理</h3>
                <Row>
                    <Col span={16} >
                        <LabelForm
                            isEdit={this.state.isEdit}
                            state={this.props}
                            setCategoryStatus={(value) => this.setState({ isEdit: value })}
                            setCategoryData={(value) => this.handleSetCategory(value)}
                            categories={this.state.data} />
                    </Col>
                </Row>
            </Fragment >
        )
    }
}
export default Category