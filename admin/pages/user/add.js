import React, { useState, Fragment } from 'react';
import {
    Form, Tag, message,
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
                {props.state.loading ? <LoadingOutlined className="text-gray-400" style={{ fontSize: '32px' }} /> : <PlusOutlined className="text-gray-400" style={{ fontSize: '32px' }} />}
                <div className="ant-upload-text"></div>
            </div>
        );
        const { imageUrl } = props.state;
        children.map((el, indx) => {
            node.push(
                <Form.Item
                    name={el.name}
                    label={el.label}
                    key={el.name}
                    style={{ width: 600 }}
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
                                        customRequest={props.handleFileChange}
                                    >
                                        <Input type={el.inputType || 'text'} hidden value={imageUrl} placeholder={el.placeholder} />
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
        // console.log(values, 'onFormSubmit')
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
                    props.resetAvatar()
                }}
            >
                重置
            </Button>
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
    static async getInitialProps ({ ctx }) {
        // const res = await axios.get('http://localhost:4000/users', { params: query })
        // console.log(res.data.data[0], 'asdasdasdasdasd')
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        return { loading: false, data: { status: 1001 } }
    }
    state = {
        loading: true,
        data: this.props.data,
        hasData: true
    }
    async handlerFormSubmit (values) {
        this.setState({ loading: true })
        // 发送服务器请求
        const { username, password, status, email } = values
        let avatar = this.state.imageUrl
        // console.log({ username, password, status, avatar, email }, 'asdasdasdasdasd')
        const res = await  $api.user.add({ username, password, status, avatar, email })
        if (res && res.success) {
            Router.push('/user')
        } else {
            message.error(res.message)
            this.setState({ loading: false, data: [] })
        }
    }
    handleFileChange = async info => {
        this.setState({ loading: true });
        const res = await uploadFile(info)
        if (res && res.success) {
            this.setState({
                imageUrl: res.data,
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
                    <title>创建用户</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>创建用户</span>
                </h3>
                <AdvancedSearchForm
                    state={this.state}
                    resetAvatar={() => this.setState({ imageUrl: '' })}
                    handleFileChange={(info) => this.handleFileChange(info)}
                    InitFormData={this.state.data}
                    setParentState={this.handlerFormSubmit.bind(this)}
                />
            </Fragment>
        )
    }
}
export default User