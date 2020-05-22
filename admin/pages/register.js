import React, { useState, useEffect, Fragment } from 'react';
import { Form, Button, Checkbox, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Head from 'next/head';
import Router from 'next/router';
import { aesEncrypt } from '../utils'
import { Base64 } from 'js-base64';

const NormalLoginForm = (props) => {
    const onFinish = values => {
        values.password = aesEncrypt(values.password)
        $api.user.register(values).then(res => {
            if (res && res.success) {
                message.success(res.message + ',2s后跳转登录页')
                setTimeout(() => {
                    Router.push('/login')
                }, 2000);
            } else {
                res && message.error(res.message)
            }
        })
    };

    return (
        <Form
            name="register"
            className="login-form text-center"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入密码!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="请输入密码"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请再次输入密码!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="请再次输入密码"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', height: '40px' }} className="login-form-button">
                    用户注册
                </Button>
            </Form.Item>
            已注册？<a href="/login">登录</a>
        </Form>
    );
};

class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <div className='login-container flexbox-v align-c'>
                <Head>
                    <title>用户注册</title>
                </Head>
                <div className='login-box pad20'>
                    <NormalLoginForm props={this.props}></NormalLoginForm>
                </div>
            </div>
        )
    }
}
export default Login