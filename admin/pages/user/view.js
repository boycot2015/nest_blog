import React, { useState, Fragment } from 'react';
import {
    Form, Tag, message,
    Button, Row, Col, Input,
    Select, Table, Cascader, Upload
} from 'antd';
import Head from 'next/head';
import Router from 'next/router';
import {
    uploadFile,
    aesDecrypt,
    aesEncrypt
} from '@/utils';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
const { Option, OptGroup } = Select;
function handleChange (value) {
    console.log(`selected ${value}`);
}

const AdvancedSearchForm = (props) => {
    const [form] = Form.useForm();
    const getFields = () => {
        const children = [
            {
                label: '头像',
                type: 4,
                required: true,
                name: 'avatar',
                placeholder: '头像'
            },
            {
                label: '用户名',
                type: 1,
                required: true,
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
        const uploadButton = (
            <div>
                {props.state.loading ? <LoadingOutlined className="text-gray-400" style={{ fontSize: '32px' }} /> : <PlusOutlined className="text-gray-400" style={{ fontSize: '32px' }} />}
                <div className="ant-upload-text"></div>
            </div>
        );
        const { avatar } = props.state;
        children.map((el, indx) => {
            node.push(
                <Form.Item
                    name={el.name}
                    label={el.label}
                    key={el.name}
                    style={{ width: 600 }}
                    rules={[
                        {
                            message: el.placeholder,
                        },
                    ]}
                >
                    {el.type === 1 ? <Input type={el.inputType || 'text'} disabled style={{ border: 0, background: 'white' }} placeholder={el.placeholder} /> :
                        el.type === 2 ? <span className="ml-3 text-gray-ccc">{props.state.status === 1001 ? '启用' : '禁用'}</span> :
                            el.type === 3 ? <Cascader placeholder="请选择" disabled style={{ border: 0, background: 'white' }} options={options} onChange={handleChange} changeOnSelect /> :
                                el.type === 4 ?
                                    <Upload
                                        disabled
                                        name="avatar"
                                        accept="image/*"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        fileList={avatar}
                                        customRequest={props.handleFileChange}
                                    >
                                        {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                    </Upload> : null}
                </Form.Item>
                // <Row gutter={12}>
                //     <Col span={10} key={indx}>
                //     </Col>
                // </Row>
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
            disabled={true}
            name="advanced_search"
            labelAlign={'right'}
            wrapperCol={{ span: 18, offset: 0 }}
            labelCol={{ span: 4, offset: 0 }}
            layout={'horizontal'}
            initialValues={props.state.data}
            className="ant-advanced-search-form"
            onFinish={onFormSubmit}
        >
            {getFields()}
            {/* <Button type="primary" htmlType="submit" style={{ width: 100 }}>
                提交
            </Button>
            <Button
                style={{ margin: '0 8px', width: 100 }}
                onClick={() => {
                    Router.push('/user')
                }}
            >
                返回
            </Button> */}
            {/* <Row gutter={10}>
                <Col span={10} offset={1} style={{ textAlign: 'left' }}>
                </Col>
            </Row> */}
        </Form>
    );
};
class User extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ ctx, $api }) {
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const { query } = ctx
        if (query.id) {
            const res = await $api.user.getById({ id: query.id })
            // console.log(res.data.password, 'avatar')
            if (res && res.success) {
                res.data.password = aesDecrypt(res.data.cipher)
                res.data.repassword = res.data.password
                return { loading: false, data: res.data, avatar: res.data.avatar }
            } else {
                return { loading: true, data: {} }
            }
            // if (!process.browser) {
            // } else {
            //     // 没有请求服务器的情况下在此使用缓存
            //     const usersData = JSON.parse(sessionStorage.getItem('users'));
            //     // 对查询的数据进行过滤和返回
            //     return { data: usersData }
            // }
        } else {
            return { loading: false, data: {} }
        }
    }
    state = {
        loading: true,
        hasData: true,
        ...this.props
    }
    async handlerFormSubmit (values) {
        this.setState({ loading: true })
        // 发送服务器请求
        let { username, password, status, email } = values
        let avatar = this.state.avatar
        password = aesEncrypt(password)
        // console.log({ username, password, status, avatar, email }, this.state.data, 'asdasdasdasdasd')
        const res = await $api.user.edit({ ...this.state.data, username, password, status, avatar, email })
        if (res && res.success) {
            if (this.state.userinfo.id === this.state.data.id) {
                message.warning('用户信息发生变化，请重新登录！')
                Router.push('/login')
                return
            }
            Router.push('/user')
        } else {
            res && message.error(res.message)
            this.setState({ loading: false, data: {} })
        }
    }
    handleFileChange = async info => {
        this.setState({ loading: true });
        const res = await uploadFile(info)
        if (res && res.success) {
            this.setState({
                avatar: res.data,
                loading: false,
            })
        }
    };
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
                    <title>用户中心</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>用户中心</span>
                </h3>
                <AdvancedSearchForm
                    state={this.state}
                    handleFileChange={(info) => this.handleFileChange(info)}
                    setParentState={this.handlerFormSubmit.bind(this)}
                />
            </Fragment>
        )
    }
}
export default User