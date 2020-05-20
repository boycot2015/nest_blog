import React, { useState, useEffect, Fragment } from 'react';
import { Form, Button, Checkbox, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Head from 'next/head';
import Router from 'next/router';
import userApi from '../api/user';
import { setCookie } from 'nookies'
import { aesEncrypt } from '../utils'
import { Base64 } from 'js-base64';

const NormalLoginForm = (props) => {
    const onFinish = values => {
        values.password = aesEncrypt(values.password)
        userApi.login(values).then(res => {
            let userinfo = {}
            if (res && res.success) {
                setCookie(props, 'token', res.data)
                window.localStorage.setItem('userinfo', JSON.stringify(Base64.decode(res.data.split('.')[1])))
                Router.push('/')
            } else {
                message.error(res.message)
            }
        })
    };

    return (
        <Form
            name="normal_login"
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
                    placeholder="密码"
                />
            </Form.Item>
            <Form.Item className="text-left">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <a className="login-form-forgot" href="">
                        忘记密码
                    </a>
                </Form.Item>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', height: '40px' }} className="login-form-button">
                    登录
                </Button>
            </Form.Item>
            未注册？<a href="/register">注册</a>
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
                    <title>用户登录</title>
                </Head>
                <div className='login-box pad20'>
                    <NormalLoginForm props={this.props}></NormalLoginForm>
                </div>
            </div>
        )
    }
}
export default Login