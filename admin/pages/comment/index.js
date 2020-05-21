import React, { useState, Fragment } from 'react';
import {
    Form, Row, Col, Input,
    Select, Table, Tag,
    message, Modal,
    Button, Cascader
} from 'antd';
import Head from 'next/head';
import Router, { withRouter } from 'next/router'
import { Editor as BraftEditor } from '@/components/Editor'
import Base64 from 'js-base64'
import { copyCode } from '@/utils'


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
            width: 80,
            align: 'center',
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
                    <a style={{ marginRight: 16 }} onClick={() => props.handleView(text)}>查看</a>
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
    static async getInitialProps ({ $api, userinfo }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        let articleListData = []
        const res = await $api.comment.get({ current: 1, pageSize: 5 })
        if (res && res.success) {
            return {
                loading: false,
                data: res.data[0],
                pageData: {
                    current: 1,
                    pageSize: 5,
                    total: res.data[1],
                    pageSizeOptions: [5, 10, 20, 50]
                },
                userinfo,
            }
        } else {
            return {
                loading: true,
                data: [],
                pageData: {
                    current: 1,
                    pageSize: 5,
                    total: 999,
                    pageSizeOptions: [5, 10, 20, 50]
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
        userinfo: this.props.userinfo
    }
    async handlerFormSubmit (values, isPage) {
        isPage && this.setState({ loading: true, pageData: values })
        !isPage && this.setState({
            loading: true,
            queryData: values,
            pageData: {
                current: 1,
                pageSize: 5,
                total: this.state.pageData.total,
                pageSizeOptions: [5, 10, 20, 50]
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
    // 删除评论
    handleDelete (item) {
        $api.comment.delete({ id: item.id }).then(res => {
            if (res && res.success) {
                message.success(res.data)
                this.getPageData({ pageSize: 5, current: 1 })
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
    }
    setModalVisible (modalVisible) {
        this.setState({ modalVisible });
    }
    render () {
        const { ...state } = this.state
        return (
            <Fragment>
                <Head>
                    <title>文件列表</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>文件列表</h3>
                {/* <AdvancedSearchForm setParentState={this.handlerFormSubmit.bind(this)} /> */}
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
                    title="评论详情"
                    width={600}
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