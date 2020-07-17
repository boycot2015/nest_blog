import React, { useState, Fragment } from 'react';
import _ from 'lodash';
import {
    Form, Row, Col, Input,
    Select, Table, Badge,
    message, Modal, Switch,
    Button, Cascader
} from 'antd';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import Head from 'next/head';


const { Option, OptGroup } = Select;
const columns = (props) => {
    const { userinfo } = props.state
    return [
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            align: 'center',
            rowKey: record => record.dataIndex,
            render: name => <p className={'ellipsis2'}>{name}</p>,
        },
        {
            title: '用户浏览器',
            dataIndex: 'userAgent',
            key: 'userAgent',
            width: 150,
            align: 'left',
            rowKey: record => record.dataIndex,
        },
        {
            title: '用户IP',
            dataIndex: 'ip',
            key: 'ip',
            width: 200,
            height: 80,
            ellipsis: 2,
            align: 'center',
            rowKey: record => record.dataIndex,
            render: ip =>
                <div className={'ellipsis'}>
                    <span>{ip}</span>
                </div>,
        },
        {
            title: '评论状态',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            height: 80,
            ellipsis: 2,
            align: 'center',
            rowKey: record => record.dataIndex,
            render: status =>
                <div className={'ellipsis'}>
                    <Badge status={status === 1001 ? 'success' : status === 1002 ? 'warning' : 'error'} />
                    <span>{status === 1001 ? '审核通过' : status === 1002 ? '待审核' : '审核不通过'}</span>
                </div>,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 100,
            height: 80,
            ellipsis: 2,
            align: 'center',
            rowKey: record => record.dataIndex,
            render: createTime =>
                <div>
                    <span>{React.$filters.timeFilter(new Date(createTime).getTime())}</span>
                </div>,
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (text, record) => (
                <span>
                    <a style={{ marginRight: (userinfo && userinfo.administrator) || record.status === 1002 ? 16 : 0 }} onClick={() => props.handleView(text)}>查看</a>
                    {record.status === 1002 ? <a style={{ marginRight: 16 }} onClick={() => props.handleAuth(record)}>审核</a> : null}
                    {userinfo && userinfo.administrator && <a style={{ marginRight: 16 }} onClick={() => props.handleDelete(record)}>删除</a>}
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
                label: '关键词',
                type: 1,
                name: 'keyWords',
                placeholder: '关键词'
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
                    description: '已通过'
                }, {
                    code: 1002,
                    description: '待审核'
                }, {
                    code: 1003,
                    description: '审核不通过'
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
    static async getInitialProps ({ $api, userinfo }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const res = await $api.comment.get({ current: 1, pageSize: 10 })
        if (res && res.success) {
            return {
                loading: false,
                data: res.data[0],
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: res.data[1],
                    pageSizeOptions: [10, 20, 30, 50]
                },
                userinfo,
            }
        } else {
            return {
                loading: true,
                data: [],
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: 999,
                    pageSizeOptions: [10, 20, 30, 50]
                },
                userinfo,
            }
        }
    }

    state = {
        loading: true,
        data: this.props.data,
        pageData: this.props.pageData,
        queryData: {},
        hasData: true,
        modalVisible: false,
        reviewData: {},
        userinfo: this.props.userinfo,
        rowSelection: undefined
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
                pageSizeOptions: [10, 20, 30, 50]
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
        this.setState({
            loading: true
        })
        const res = await $api.comment.get(params)
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
    // 查看评论
    handleView = (item) => {
        this.setState({
            reviewData: item
        })
        this.setModalVisible(true)
    }

    // 审核
    handleAuth (item, isBatch) {
        const { pageData, queryData } = this.state
        const { pageSize, current } = pageData
        let api = isBatch ? 'batchStatus' : 'status'
        let params = { status: 1001 }
        isBatch ? (params.ids = item.join(',')) : (params.id = item.id)
        Modal.confirm({
            title: '温馨提示',
            icon: <ExclamationCircleOutlined />,
            maskClosable: true,
            centered: true,
            content: '确认审核,审核通过后可展示在评论区',
            okText: '审核通过',
            cancelText: '审核不通过',
            onOk: () => {
                $api.comment[api]({ ...params }).then(res => {
                    if (res && res.success) {
                        message.success(res.data)
                        this.setState({ reset: true, rowSelection: undefined })
                        this.getPageData({ pageSize, current, ...queryData })
                    } else {
                        res && message.error(res.message)
                    }
                })
            },
            onCancel: (e) => {
                // console.log(e.triggerCancel, 'icon: <ExclamationCircleOutlined />,');
                if (e.triggerCancel) return // 点击遮罩层关闭弹框不执行操作
                params.status = 1003
                $api.comment[api]({ ...params }).then(res => {
                    if (res && res.success) {
                        message.success(res.data)
                        this.setState({ reset: true, rowSelection: undefined })
                        this.getPageData({ pageSize, current, ...queryData })
                        return Promise.resolve(true)
                    } else {
                        res && message.error(res.message)
                    }
                })
                return Promise.resolve()
            }
        })
    }
    // 删除评论
    handleDelete (item, isBatch) {
        const { pageData, queryData } = this.state
        const { pageSize, current } = pageData
        let params = {}
        let api = isBatch ? 'batchDelete' : 'delete'
        isBatch ? (params.ids = item.join(',')) : (params.id = item.id)
        Modal.confirm({
            title: '温馨提示',
            icon: <ExclamationCircleOutlined />,
            content: '确认删除？',
            maskClosable: true,
            centered: true,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                $api.comment[api]({ ...params }).then(res => {
                    if (res && res.success) {
                        message.success(res.data)
                        this.setState({ reset: true, rowSelection: undefined })
                        this.getPageData({ pageSize, current, ...queryData })
                    } else {
                        res && message.error(res.message)
                    }
                })
            }
        })
    }
    // 批量删除
    handleBatchDelete () {
        this.handleDelete(this.state.rowSelection.selectedRowKeys, true)
    }
    // 批量修改状态
    handleBatchStatus () {
        this.handleAuth(this.state.rowSelection.selectedRowKeys, true)
    }

    setArticle (callback) {
        return callback(this.state.reviewData)
    }
    componentDidMount () {
        this.setState({ loading: false })
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
    // onSelectionChange (selectedRowKeys, selectedRows) {
    //   console.log(selectedRowKeys, selectedRows, 'onSelectionChange');
    // }
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
        const { selectedRows, ...state } = this.state
        return (
            <Fragment>
                <Head>
                    <title>评论列表</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>评论列表</h3>
                <AdvancedSearchForm {...state}
                    setParentState={this.handlerFormSubmit.bind(this)}
                    handleBatchDelete={this.handleBatchDelete.bind(this)}
                    handleBatchStatus={this.handleBatchStatus.bind(this)}
                    handleRowSelectionChange={this.handleRowSelectionChange.bind(this)} />
                <Table
                    {...this.state}
                    className="comment-table"
                    scroll={{ y: 510 }}
                    rowKey={(record, index) => record.id}
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
                    title="评论详情"
                    width={600}
                    centered
                    footer={null}
                    visible={this.state.modalVisible}
                    onOk={() => this.setModalVisible(false)}
                    onCancel={() => this.setModalVisible(false)}
                >
                    <div className="review-content">
                        <h3 className="text-xl mb-5">{this.state.reviewData.name}</h3>
                        <div dangerouslySetInnerHTML={{ __html: this.state.reviewData.content }}></div>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}
export default Article