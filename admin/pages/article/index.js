import React, { useState, Fragment } from 'react';
import {
    Form, Row, Col, Input,
    Select, Table, Tag,
    notification, Badge,
    message, Modal,
    Button, Cascader
} from 'antd';
import Head from 'next/head';
import $api from '@/api/apiList';
import Router, { withRouter } from 'next/router'
import { Editor as BraftEditor } from '@/components/Editor'
import Base64 from 'js-base64'
const { Option, OptGroup } = Select;
const columns = (props) => {
    return [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 100,
            align: 'center',
            rowKey: record => record.dataIndex,
            render: text => <a>{text}</a>,
        },
        {
            title: '内容概述',
            dataIndex: 'content',
            key: 'content',
            width: 200,
            ellipsis: 2,
            // colSpan: 6,
            rowKey: record => record.dataIndex,
            render: text => <div style={{maxHeight: 100, overflow: 'hidden'}} dangerouslySetInnerHTML={{ __html: text }}></div>,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            align: 'center',
            key: 'status',
            rowKey: record => record.dataIndex,
            render: status => (
                <span>
                    <Badge status={status === 1001 ? 'success' : status === 1002 ? 'warning' : 'error'} />
                    {status === 1001 ? '已发布' : status === 1002 ? '待审核' : '审核不通过'}
                </span>
            ),
        },
        {
            title: '标签',
            key: 'tags',
            width: 150,
            align: 'center',
            rowKey: record => record.dataIndex,
            dataIndex: 'tags',
            render: tags => (
                <span>
                    {tags.map((tag, index) => {
                        let color = index > 1 ? 'geekblue' : 'green';
                        if (tag.value === '前端') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag.id} className="mb-2">
                                {tag.value.toUpperCase()}
                            </Tag>
                        );
                    })}
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (text, record) => (
                <span>
                    <a style={{ marginRight: 16 }} onClick={() => props.handleReview(record.id)}>查看</a>
                    <a style={{ marginRight: 16 }} onClick={() => Router.push('/article/edit?id=' + record.id)}>编辑</a>
                    {record.status === 1002 && <a span style={{ marginRight: 16 }} >发布</a>}
                    {(record.status === 1002 || record.status === 1003) && <a onClick={() => props.handleDelete(record.id)}> 删除</a>}
                </span>
            ),
        },
    ];
}
function handleChange (value) {
    console.log(`selected ${value}`);
}
const AdvancedSearchForm = (props) => {
    const [form] = Form.useForm();
    const getFields = () => {
        const children = [
            {
                label: '标题',
                type: 1,
                name: 'title',
                placeholder: '标题'
            },
            {
                label: '状态',
                type: 2,
                name: 'status',
                placeholder: '状态',
                options: [{
                    code: '',
                    description: '全部'
                }, {
                    code: 1001,
                    description: '已发布'
                }, {
                    code: 1002,
                    description: '待审核'
                }, {
                    code: 1003,
                    description: '审核不通过'
                }]
            },
            {
                label: '分类',
                type: 2,
                name: 'category',
                placeholder: '分类',
                options: [{
                    code: '',
                    description: '全部'
                }, {
                    code: 1001,
                    description: '前端'
                }, {
                    code: 1002,
                    description: '后台'
                }, {
                    code: 10010,
                    description: 'linux'
                }]
            }];
        let node = []
        children.map((el, indx) => {
            node.push(
                <Col span={4} key={indx}>
                    <Form.Item
                        name={el.name}
                        label={el.label}
                        rules={[
                            {
                                required: el.required,
                                message: el.placeholder,
                            },
                        ]}
                    >
                        {el.type === 1 ? <Input placeholder={el.placeholder} /> :
                            el.type === 2 ?
                                <Select placeholder="请选择" onChange={handleChange}>
                                    {el.options.map(val => (<Option key={val.code} value={val.code}>{val.description}</Option>))}
                                </Select> :
                                el.type === 3 ? <Cascader placeholder="请选择" options={options} onChange={handleChange} changeOnSelect /> : null}
                    </Form.Item>
                </Col>
            )
        })
        return node;
    };

    const onFormSubmit = values => {
        props.setParentState(values)
        console.log(values, 'onFormSubmit')
    };
    return (
        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            initialValues={{
                name: '',
                status: '',
                category: ''
            }}
            onFinish={onFormSubmit}
        >
            <Row gutter={18}>
                {getFields()}
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        查询
                </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={async () => {
                            await form.resetFields();
                            onFormSubmit()
                        }}
                    >
                        重置
                </Button>
                </Col>
            </Row>
        </Form>
    );
};
class Article extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ api }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        let articleListData = []
        const res = await api.article.get({ current: 1, pageSize: 10 })
        if (res && res.success) {
            return {
                loading: false,
                data: res.data[0],
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: res.data[1],
                    pageSizeOptions: [3, 10, 20, 50, 100]
                },
            }
        } else {
            return {
                loading: true,
                data: [],
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: 999,
                    pageSizeOptions: [3, 10, 20, 50, 100]
                }
            }
        }
        if (!process.browser) {
        } else {
            // 没有请求服务器的情况下在此使用缓存
            articleListData = JSON.parse(sessionStorage.getItem('articleList'));
            // 对查询的数据进行过滤和返回
            return { data: articleListData }
        }
    }

    state = {
        loading: true,
        data: this.props.data,
        pageData: this.props.pageData,
        queryData: {},
        hasData: true,
        modalVisible: false,
        reviewData: {}
    }
    async handlerFormSubmit (values, isPage) {
        isPage && this.setState({ loading: true, pageData: values })
        !isPage && this.setState({
            loading: true,
            queryData: values,
            pageData: {
                current: 1,
                pageSize: 10,
                total: this.state.pageData.total,
                pageSizeOptions: [3, 10, 20, 50, 100]
            }
        })
        // 发送服务器请求
        const { current, pageSize } = isPage ? values : this.state.pageData
        const queryData = {}
        for (const key in this.state.queryData) {
            if (this.state.queryData[key]) {
                queryData[key] = this.state.queryData[key]
            }
        }
        const params = { current, pageSize, ...queryData }
        this.getPageData(params)
    }
    async getPageData (params = {}) {
        const { current, pageSize } = params
        const res = await $api.article.get({ params })
        if (res && res.success) {
            this.setState({
                loading: false,
                data: res.data[0],
                pageData: {
                    current,
                    pageSize,
                    total: res.data[1]
                }
            })
        } else {
            this.setState({
                loading: false,
                data: [],
                pageData: {
                    current,
                    pageSize,
                    total: 0,
                }
            })
        }
    }
    handleDelete = (id) => {
        $api.article.delete({ params: { id } }).then(res => {
            if (res && res.success) {
                message.success(res.data)
                this.getPageData()
            } else {
                message.error(res.message)
            }
        })
    }
    handleReview (id) {
        $api.article.getById({ params: { id } }).then(res => {
            if (res && res.success) {
                this.setState({ reviewData: res.data, modalVisible: true })
            } else {
                message.error(res.message)
            }
        })
    }
    setArticle (callback) {
        return callback(this.state.reviewData)
    }
    componentDidMount () {
        this.setState({ loading: false })
        // 如果没有缓存，通过localStorage在本地缓存数据
        sessionStorage.setItem('articleList', JSON.stringify(this.props.data))
    }
    setModalVisible (modalVisible) {
        this.setState({ modalVisible });
    }
    render () {
        const { ...state } = this.state
        return (
            <Fragment>
                <Head>
                    <title>文章列表</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>文章列表</h3>
                <AdvancedSearchForm setParentState={this.handlerFormSubmit.bind(this)} />
                <Table
                    {...this.state}
                    rowKey={(record, index) => index}
                    dataSource={state.hasData ? this.state.data : null}
                    columns={columns(this)}
                    handleDelete={(val) => this.handleDelete(val)}
                    handleReview={(val) => this.handleReview(val)}
                    onChange={(pageData) => this.handlerFormSubmit(pageData, true)}
                    pagination={{
                        ...this.state.pageData,
                        showSizeChanger: true,
                        showTitle: (total, range) => '页',
                        showTotal: (total, range) => `共 ${total} 条`
                    }}
                />
                <Modal
                    title="文章详情"
                    centered
                    width={800}
                    footer={null}
                    visible={this.state.modalVisible}
                    onOk={() => this.setModalVisible(false)}
                    onCancel={() => this.setModalVisible(false)}
                >
                    <div className="review-content">
                        <h3 className="text-xl mb-5">{this.state.reviewData.title}</h3>
                        {/* <div dangerouslySetInnerHTML={{ __html: this.state.reviewData.content }}></div> */}
                        <BraftEditor
                            value={this.state.reviewData.content}
                            onChange={(value) => {
                                this.setArticle((article) => {
                                    article.content = value;
                                    return article;
                                });
                            }}
                            readOnly
                        ></BraftEditor>
                        <p className="tags">
                            <h3 className="text-2 mb-5 mt-5">关联标签</h3>
                            <span>
                                {this.state.reviewData.tags && this.state.reviewData.tags.map((tag, index) => {
                                    let color = index > 1 ? 'geekblue' : 'green';
                                    if (tag.value === '前端') {
                                        color = 'volcano';
                                    }
                                    return (
                                        <Tag color={color} key={tag.id} className="mb-1">
                                            {tag.value.toUpperCase()}
                                        </Tag>
                                    );
                                })}
                            </span>
                        </p>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}
export default Article