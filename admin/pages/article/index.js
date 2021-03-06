import React, { useState, Fragment } from 'react';
import _ from 'lodash';
import {
    Form, Row, Col, Input,
    Select, Table, Tag, Badge,
    message, Modal, Switch,
    Button, Cascader
} from 'antd';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';

import Head from 'next/head';
import Router, { withRouter } from 'next/router'
import { Editor as BraftEditor } from '@/components/Editor'
import { filterTreeData } from '@/utils'

const { Option, OptGroup } = Select;
const columns = (props) => {
    return [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            ellipsis: 2,
            align: 'center',
            rowKey: record => record.dataIndex,
            render: text => <a title={text}>{text}</a>,
        },
        {
            title: '分类',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 100,
            align: 'center',
            rowKey: record => record.dataIndex,
            render: text => <a style={{ color: 'orange' }}>{text}</a>,
        },
        {
            title: '内容概述',
            dataIndex: 'content',
            key: 'content',
            width: 300,
            ellipsis: 3,
            // colSpan: 6,
            rowKey: record => record.dataIndex,
            render: (text, record) => <div
                onClick={() => props.handleReview(record)}
                style={{ maxHeight: 85, overflow: 'hidden' }}
                dangerouslySetInnerHTML={{ __html: text }}>
            </div>,
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
                    {tags && tags.map((tag, index) => {
                        let color = index > 1 ? 'geekblue' : 'green';
                        if (tag.value === '前端') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag.id} style={{ marginBottom: 10 }}>
                                {tag.value[0].toUpperCase() + tag.value.slice(1)}
                            </Tag>
                        );
                    })}
                </span>
            ),
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
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
            rowKey: record => record.dataIndex,
            render: time => React.$filters.timeFilter(new Date(time).getTime())
        },
        {
            title: '修改时间',
            align: 'center',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 150,
            rowKey: record => record.dataIndex,
            render: time => React.$filters.timeFilter(new Date(time).getTime())
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (text, record) => (
                <span>
                    <a style={{ marginRight: 16 }} onClick={() => props.handleReview(record)}>查看</a>
                    <a style={{ marginRight: 16 }} onClick={() => Router.push('/article/edit?id=' + record.id)}>编辑</a>
                    {record.status === 1002 && <a style={{ marginRight: 16 }} onClick={() => props.handleChangeStatus(record)}>发布</a>}
                    {<a onClick={() => props.handleDelete(record)}> 删除</a>}
                    {/* (record.status === 1002 || record.status === 1003) &&  */}
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
    setTimeout(() => {
        props.state.reset && form.resetFields()
    }, 100);
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
                    id: '',
                    value: '全部'
                }, {
                    id: 1001,
                    value: '已发布'
                }, {
                    id: 1002,
                    value: '待审核'
                }, {
                    id: 1003,
                    value: '审核不通过'
                }]
            },
            {
                label: '标签',
                type: 2,
                name: 'tag',
                placeholder: '标签',
                options: props.state.tagList
            },
            {
                label: '分类',
                type: 3,
                name: 'category',
                placeholder: '分类',
                options: props.state.categoryList
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
                                    {el.options.map(val => (
                                        <Option
                                            key={val.id}
                                            value={val.id}
                                        >
                                            {val.description || val.value}
                                        </Option>
                                    ))}
                                </Select> :
                                el.type === 3 ? <Cascader
                                    fieldNames={{ label: 'value', value: 'id' }}
                                    placeholder="请选择"
                                    options={el.options}
                                    onChange={handleChange}
                                    changeOnSelect /> : null}
                    </Form.Item>
                </Col>
            )
        })
        return node;
    };

    const onFormSubmit = values => {
        props.setParentState(values)
        // console.log(values, 'onFormSubmit')
    };
    return (
        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            initialValues={{
                name: '',
                status: '',
                categoryId: ''
            }}
            onFinish={onFormSubmit}
        >
            <Row gutter={24}>
                {getFields()}
                <Col span={4} style={{ textAlign: 'right' }}>
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
                <Col span={8} style={{ textAlign: 'right' }}>
                    {/* <Button
                        type="primary" style={{ marginRight: 10 }}
                        onClick={props.handleRowSelectionChange}>
                        多选
                    </Button> */}
                    <Form.Item label="多选" style={{ width: !props.rowSelection ? 100 : 300, marginLeft: 10 }}>
                        <Switch
                            style={{ marginRight: 10 }}
                            checked={!!props.rowSelection}
                            onChange={props.handleRowSelectionChange} />
                        {props.rowSelection ?
                            <Button style={{ marginRight: 10 }}
                                disabled={!(props.rowSelection &&
                                    props.rowSelection.selectedRowKeys &&
                                    props.rowSelection.selectedRowKeys.length)}
                                type="primary" onClick={props.handleBatchDelete}>
                                {/* {console.log(props.rowSelection)} */}
                                批量删除
                            </Button> : null}
                        {props.rowSelection ?
                            <Button style={{ marginRight: 10 }}
                                disabled={!(props.rowSelection &&
                                    props.rowSelection.selectedRowKeys &&
                                    props.rowSelection.selectedRowKeys.length)}
                                type="primary" onClick={props.handleBatchStatus}>
                                批量审核
                            </Button> : null}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
class Article extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ $api }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const [res, cateRes, tagRes] = await Promise.all([
            await $api.article.get({ current: 1, pageSize: 10 }),
            await $api.category.get(),
            await $api.tag.get()])
        if (res && res.success && cateRes && cateRes.success && tagRes && tagRes.success) {
            return {
                loading: false,
                data: res.data[0],
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: res.data[1],
                    pageSizeOptions: [5, 10, 20, 50]
                },
                categoryList: filterTreeData((cateRes.data[0]), null),
                tagList: tagRes.data[0]
            }
        } else {
            return {
                loading: true,
                data: [],
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: 999,
                    pageSizeOptions: [5, 10, 20, 50]
                },
                categoryList: [],
                tagList: [],
            }
        }
    }

    state = {
        queryData: {},
        hasData: true,
        modalVisible: false,
        reviewData: {},
        ...this.props,
        comment: {
            name: '',
            email: '',
            content: ''
        },
        rowSelection: undefined
    }
    async handlerFormSubmit (values, isPage) {
        isPage && this.setState({ loading: true, pageData: values, reset: false })
        !isPage && this.setState({
            loading: true,
            queryData: values,
            pageData: {
                current: 1,
                pageSize: 10,
                total: this.state.pageData.total,
                pageSizeOptions: [5, 10, 20, 50]
            },
            reset: false,
            rowSelection: undefined
        })
        // 发送服务器请求
        const { current, pageSize } = isPage ? values : this.state.pageData
        const queryData = {}
        for (const key in this.state.queryData) {
            if (this.state.queryData[key]) {
                queryData[key] = this.state.queryData[key]
            }
            if (key.includes('category') && this.state.queryData[key]) {
                queryData[key] = this.state.queryData[key].join(',')
            }
        }
        const params = { current, pageSize, ...queryData }
        this.getPageData(params)
    }
    async getPageData (params = {}) {
        const { current, pageSize } = params
        const [res, cateRes, tagRes] = await Promise.all([
            await $api.article.get({ ...params }),
            await $api.category.get(),
            await $api.tag.get()])
        if (res && res.success && cateRes && cateRes.success && tagRes && tagRes.success) {
            this.setState({
                loading: false,
                data: res.data[0],
                pageData: {
                    current,
                    pageSize,
                    total: res.data[1]
                },
                categoryList: filterTreeData((cateRes.data[0]), null),
                tagList: tagRes.data[0]

            })
        } else {
            this.setState({
                loading: false,
                data: [],
                pageData: {
                    current,
                    pageSize,
                    total: 0,
                },
                categoryList: [],
                tagList: []
            })
        }
    }
    handleDelete = (item, isBatch) => {
        const { pageData, queryData } = this.state
        const { pageSize, current } = pageData
        // console.log(this.state, 'asdasdsa')
        let params = {}
        let api = isBatch ? 'batchDelete' : 'delete'
        isBatch ? (params.ids = item.join(',')) : (params.id = item.id)
        Modal.confirm({
            title: '温馨提示',
            icon: <ExclamationCircleOutlined />,
            content: '确认删除？',
            okText: '确认',
            maskClosable: true,
            centered: true,
            onOk: () => {
                $api.article[api]({ ...params }).then(res => {
                    if (res && res.success) {
                        message.success(res.data)
                        this.setState({ reset: true, rowSelection: undefined })
                        this.getPageData({ pageSize, current, ...queryData })
                    } else {
                        res && message.error(res.message)
                    }
                })
            },
            cancelText: '取消'
        })
    }
    handleReview (item) {
        // $api.article.getById({ params: { id } }).then(res => {
        //     if (res && res.success) {
        //         this.setState({ reviewData: res.data, modalVisible: true })
        //     } else {
        //         message.error(res.message)
        //     }
        // })
        if (item.url) {
            window.open(item.url)
        } else {
            Router.push('/article/view?id=' + item.id)
        }
    }

    // 批量删除
    handleBatchDelete () {
        this.handleDelete(this.state.rowSelection.selectedRowKeys, true)
    }
    // 批量修改状态
    handleBatchStatus () {
        this.handleChangeStatus(this.state.rowSelection.selectedRowKeys, true)
    }

    async handleChangeStatus (item, isBatch) {
        status = item.status === 1001 ? 1002 : 1001
        let api = isBatch ? 'batchStatus' : 'status'
        let params = { status }
        isBatch ? (params.ids = item.join(',')) : (params.id = item.id)
        Modal.confirm({
            title: '温馨提示',
            icon: <ExclamationCircleOutlined />,
            maskClosable: true,
            centered: true,
            content: '确认审核,审核通过后可展示在列表',
            okText: '审核通过',
            cancelText: '审核不通过',
            onOk: async () => {
                const res = await $api.article[api]({ ...params })
                if (res && res.success) {
                    message.success(res.message)
                    this.setState({ reset: true, rowSelection: undefined })
                    this.handlerFormSubmit({})
                    return
                }
                res && message.error(res.message)
            },
            onCancel: async (e) => {
                if (e.triggerCancel) return // 点击遮罩层关闭弹框不执行操作
                params.status = 1003
                // console.log( params, 'icon: <ExclamationCircleOutlined />,');
                const res = await $api.article[api]({ ...params })
                if (res && res.success) {
                    message.success(res.message)
                    this.setState({ reset: true, rowSelection: undefined })
                    this.handlerFormSubmit({})
                    return Promise.resolve()
                }
                res && message.error(res.message)
                return Promise.resolve()
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
                const { pageSize, current } = this.state.pageData
                this.getPageData({ pageSize, current, status: '' })
                return
            }
            res && message.error(res.message)
        })
    }
    componentDidMount () {
        this.setState({ loading: false })
        // 如果没有缓存，通过localStorage在本地缓存数据
        // sessionStorage.setItem('articleList', JSON.stringify(this.props.data))
    }
    setModalVisible (modalVisible) {
        this.setState({ modalVisible });
    }
    /**
   * @name: 手动选中复选框
   * @msg: 
   * @param {type} 
   * @return: 
   */
    onSelect = (record, selected) => {
        let mySelectedRows = this.state.rowSelection.selectedRows;
        if (selected) {
            mySelectedRows.push(record);
        } else {
            _.remove(mySelectedRows, (o) => { return o.id === record.id });
        }
        const selectedRowKeys = _.map(mySelectedRows, 'id');
        console.log(selectedRowKeys, 'selectedRowKeys')
        this.setState({
            rowSelection: {
                ...this.state.rowSelection,
                selectedRowKeys,
                selectedRows: mySelectedRows
            }
        })
    }
    onSelectAll = (selected, selectedRows, changeRows) => {
        let mySelectedRows = this.state.rowSelection.selectedRows;
        const changeRowKeys = _.map(changeRows, 'id');
        if (selected) {
            // 先连接再进行一次去重
            mySelectedRows = _.uniqBy(_.concat(mySelectedRows, changeRows), 'id')
        } else {
            // 先判断包含再移除
            _.remove(mySelectedRows, (o) => { return _.includes(changeRowKeys, o.id) })
            // mySelectedRows = []
        }
        const selectedRowKeys = _.map(mySelectedRows, 'id')
        this.setState({
            rowSelection: {
                ...this.state.rowSelection,
                selectedRowKeys,
                selectedRows: mySelectedRows
            }
        })
    }
    handleRowSelectionChange = enable => {
        this.setState({
            rowSelection: enable ? {
                selectedRowKeys: [],
                selectedRows: [],
                // onChange: this.onSelectionChange.bind(this),
                onSelect: this.onSelect.bind(this),
                onSelectAll: this.onSelectAll.bind(this)
            } : undefined
        })
    }
    render () {
        const { ...state } = this.state
        return (
            <Fragment>
                <Head>
                    <title>文章列表</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>文章列表</h3>
                <AdvancedSearchForm state={this.state} {...state}
                    setParentState={this.handlerFormSubmit.bind(this)}
                    handleBatchDelete={this.handleBatchDelete.bind(this)}
                    handleBatchStatus={this.handleBatchStatus.bind(this)}
                    handleRowSelectionChange={this.handleRowSelectionChange.bind(this)} />
                <Table
                    {...this.state}
                    width={1200}
                    rowKey={(record, index) => record.id}
                    dataSource={state.hasData ? this.state.data : null}
                    columns={columns(this)}
                    handleDelete={(val) => this.handleDelete(val)}
                    handleReview={(val) => this.handleReview(val)}
                    scroll={{ y: 450 }}
                    onChange={(pageData) => this.handlerFormSubmit(pageData, true)}
                    pagination={{
                        ...this.state.pageData,
                        position: ['bottomRight'],
                        showSizeChanger: true,
                        showTitle: (total, range) => <span>'页'</span>,
                        showTotal: (total, range) => <span>{`共 ${total} 条`}</span>
                    }}
                />
                <Modal
                    title="文章详情"
                    centered
                    width={880}
                    footer={null}
                    visible={this.state.modalVisible}
                    onCancel={() => this.setModalVisible(false)}
                >
                    <div className="review-content" style={{ height: 780, paddingRight: 20, overflow: 'hidden', overflowY: 'auto' }}>
                        <h3 className="text-xl mb-5">{this.state.reviewData.title}</h3>
                        {/* <div dangerouslySetInnerHTML={{ __html: this.state.reviewData.content }}></div> */}
                        <div className="review-content-main">
                            {this.state.modalVisible && <BraftEditor
                                value={this.state.reviewData.content}

                                onChange={(value) => {
                                    this.setArticle((article) => {
                                        article.content = value;
                                        return article;
                                    });
                                }}
                                readOnly
                            ></BraftEditor>}
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
                            <h3 className="text-xl mb-5">评论</h3>
                            <BraftEditor
                                style={{ height: 100 }}
                                value={this.state.comment.content}
                                onChange={(value) => {
                                    this.setComment((comment) => {
                                        comment.content = value;
                                        return comment;
                                    });
                                }}
                            ></BraftEditor>
                            {/* onChange={(e) => {
                                this.setState({ articleForm: { ...this.state.articleForm, title: e.target.value } })
                            }} */}
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
                </Modal>
            </Fragment>
        )
    }
}
export default Article