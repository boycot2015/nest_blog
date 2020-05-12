import React, { useState, Fragment } from 'react';
import {
    Form, Tag, notification,
    Button, Row, Col, Input,
    Select, Table, Cascader, Upload
} from 'antd';
import Head from 'next/head';
import Router from 'next/router';
import { uploadFile } from '@/utils';
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
                label: '密码',
                type: 1,
                inputType: 'password',
                required: true,
                name: 'password',
                placeholder: '密码'
            },
            {
                label: '确认密码',
                type: 1,
                inputType: 'password',
                required: true,
                name: 'repassword',
                placeholder: '确认密码'
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
                {props.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = props.state;
        children.map((el, indx) => {
            node.push(
                <Form.Item
                    name={el.name}
                    label={el.label}
                    key={el.name}
                    rules={[
                        {
                            required: el.required,
                            message: el.placeholder,
                        },
                    ]}
                >
                    {el.type === 1 ? <Input type={el.inputType || 'text'} placeholder={el.placeholder} /> :
                        el.type === 2 ? <Select placeholder="请选择" onChange={handleChange}>
                            <Option value={1001}>启用</Option>
                            <Option value={1002}>禁用</Option>
                            {/* <OptGroup label="Manager">
                                    </OptGroup> */}
                        </Select> :
                            el.type === 3 ? <Cascader placeholder="请选择" options={options} onChange={handleChange} changeOnSelect /> :
                                el.type === 4 ?
                                    <Upload
                                        name="avatar"
                                        accept="image/*"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        customRequest={uploadFile}
                                        onChange={props.handleChange}
                                    >
                                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
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
        console.log(values, 'onFormSubmit')
    };
    return (
        <Form
            form={form}
            name="advanced_search"
            labelAlign={'right'}
            wrapperCol={{ span: 18, offset: 0 }}
            labelCol={{ span: 4, offset: 0 }}
            layout={'horizontal'}
            initialValues={props.InitFormData}
            className="ant-advanced-search-form"
            onFinish={onFormSubmit}
        >
            {getFields()}
            <Button type="primary" htmlType="submit" style={{ width: 100 }}>
                提交
            </Button>
            <Button
                style={{ margin: '0 8px', width: 100 }}
                onClick={() => {
                    form.resetFields();
                }}
            >
                返回
            </Button>
            {/* <Row gutter={10}>
                <Col span={10} offset={1} style={{ textAlign: 'left' }}>
                </Col>
            </Row> */}
        </Form>
    );
};
class User extends React.Component {
    constructor() {
        super()
    }
    state = {
        loading: true,
        hasData: true
    }
    static async getInitialProps ({ ctx }) {
        // const res = await axios.get('http://localhost:4000/users', { params: query })
        // console.log(res.data.data[0], 'asdasdasdasdasd')
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        if (ctx.query.id) {
            const res = await React.$api.user.getById({ params: ctx.query.id })
            // console.log(res.data.data[0], 'asdasdasdasdasd')
            if (res && res.success) {
                return { loading: false, data: res.data }
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
    async handlerFormSubmit (values) {
        this.setState({ loading: true })
        // 发送服务器请求
        const res = await React.$api.user.add({ data: values })
        console.log(res, 'asdasdasdasdasd')
        if (res && res.success) {
            Router.push('/user')
            // this.setState({ loading: false, data: res.data[0] })
        } else {
            notification.error({
                message: res.message,
                description: res.data
            })
            this.setState({ loading: false, data: [] })
        }
    }
    handleChange = info => {
        
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
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
                    <title>创建用户</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>创建用户</span>
                </h3>
                <AdvancedSearchForm state={this.state} handleChange={(info) => this.handleChange(info)} InitFormData={this.data} setParentState={this.handlerFormSubmit.bind(this)} />
            </Fragment>
        )
    }
}
export default User