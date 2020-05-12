import React, { useState, Fragment } from 'react';
import {
    Form, Tag, notification,
    Button, Row, Col, Input,
    Select, Table, Cascader,
    Badge
} from 'antd';
import Head from 'next/head';
import Router from 'next/router';
const { Option, OptGroup } = Select;
const columns = [
    {
        title: '用户名',
        dataIndex: 'username',
        align: 'center',
        key: 'username',
        width: 150,
        rowKey: record => record.dataIndex,
        render: text => <a>{text}</a>,
    },
    {
        title: '账号状态',
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        rowKey: record => record.dataIndex,
        render: status =>
            <span>
                <Badge status={status === 1001 ? 'success' : 'default'} />
                {status === 1001 ? '启用' : '禁用'}
            </span>,
    },
    {
        title: '电子邮箱',
        align: 'center',
        dataIndex: 'email',
        key: 'email',
        width: 150,
        rowKey: record => record.dataIndex
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
        align: 'center',
        key: 'action',
        width: 150,
        rowKey: record => record.dataIndex,
        render: (text, record) => (
            <span>
                <a style={{ marginRight: 16 }} href="/user/view">查看</a>
                <a style={{ marginRight: 16 }} href="/user/view">禁用</a>
                <a>删除</a>
            </span>
        ),
    },
];
function handleChange (value) {
    console.log(`selected ${value}`);
}
const options = [
    {
        value: 'web',
        label: '前端',
        children: [
            {
                value: 'js',
                label: 'js',
                children: [
                    {
                        value: 'ts',
                        label: 'ts',
                    },
                ],
            },
        ],
    },
    {
        value: 'server',
        label: '后端',
        children: [
            {
                value: 'springBoot',
                label: 'springBoot',
                children: [
                    {
                        value: 'Redis',
                        label: 'Redis',
                    },
                ],
            },
        ],
    }
]
const AdvancedSearchForm = (props) => {
    const [form] = Form.useForm();
    const getFields = () => {
        const children = [
            {
                label: '用户名',
                type: 1,
                name: 'username',
                placeholder: '用户名'
            },
            {
                label: '状态',
                type: 2,
                name: 'status',
                placeholder: '状态'
            },
            {
                label: '邮箱',
                type: 1,
                name: 'email',
                placeholder: '邮箱'
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
                            el.type === 2 ? <Select placeholder="请选择" onChange={handleChange}>
                                <Option value={1001}>启用</Option>
                                <Option value={1002}>禁用</Option>
                                {/* <OptGroup label="Manager">
                                    </OptGroup> */}
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
class User extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ ctx, router, api }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        // let token = Base64.decode(req.headers[''])
        const res = await api.user.get({ params: {} })
        if (res && res.success) {
            return {
                loading: false,
                data: res.data[0],
                pageData: {
                    current: 1,
                    pageSize: 3,
                    total: res.data[1],
                    pageSizeOptions: [10, 20, 50, 100]
                },
            }
        } else {
            return {
                loading: true,
                data: [],
                pageData: {
                    current: 1,
                    pageSize: 3,
                    total: 999,
                    pageSizeOptions: [10, 20, 50, 100]
                }
            }
        }
    }
    state = {
        loading: true,
        data: this.props.data,
        pageData: this.props.pageData,
        queryData: {},
        hasData: true
    }
    async handlerFormSubmit (values, isPage) {
        isPage && this.setState({ loading: true, pageData: values })
        !isPage && this.setState({
            loading: true,
            queryData: values,
            pageData: {
                current: 1,
                pageSize: 3,
                total: this.state.pageData.total,
                pageSizeOptions: [10, 20, 50, 100]
            }
        })
        // 发送服务器请求
        const { current, pageSize } = isPage ? values : this.state.pageData
        const params = { current, pageSize, ...this.state.queryData }
        console.log(values, params, 'Text content did not match')
        const res = await $api.user.get({ params })
        // console.log(res.data.data[0], 'asdasdasdasdasd')
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
    componentDidMount () {
        this.setState({ loading: false })
        // 如果没有缓存，通过localStorage在本地缓存数据
        sessionStorage.setItem('users', JSON.stringify(this.props.data))
    }
    render () {
        const { ...state } = this.state
        return (
            <Fragment>
                <Head>
                    <title>用户列表</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>用户列表</span>
                    {/* process.browser && localStorage.getItem('userinfo') && !JSON.parse(localStorage.getItem('userinfo')).visitors &&  */}
                    {<Button className='float-right' onClick={() => Router.push('/user/add')} type='primary'>创建用户</Button>}
                </h3>
                <AdvancedSearchForm setParentState={this.handlerFormSubmit.bind(this)} />
                <Table
                    {...this.state}
                    rowKey={(record, index) => index}
                    dataSource={state.hasData ? this.state.data : null}
                    columns={columns}
                    onChange={(pageData) => this.handlerFormSubmit(pageData, true)}
                    pagination={{ ...this.state.pageData }}
                />
            </Fragment>
        )
    }
}
export default User