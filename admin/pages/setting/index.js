import React, { Fragment } from 'react';
import Head from 'next/head';
import {
    Layout, Menu, ConfigProvider,
    Button, Dropdown, Breadcrumb,
    Avatar, notification, Input,
    Upload
} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    RobotOutlined,
    SmileOutlined,
    PlusOutlined,
    GithubOutlined,
    UploadOutlined,
    BgColorsOutlined
} from '@ant-design/icons';
class Setting extends React.Component {
    constructor() {
        super()
    }
    static async getInitialProps ({ $api }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        $api = $api || {}
        return { $api }
    }
    render () {
        const props = {
            action: this.props.$api && this.props.$api.file.url.uploadFile,
            listType: 'picture',
            defaultFileList: [],
        };
        return (
            <Fragment>
                <Head>
                    <title>自定义装修</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-10 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>自定义装修</span>
                </h3>
                <div className={'container'}>
                    <div className={'section mb-5'}>
                        <div className={'section w-100 h-40 border border-dashed border-orange-f9'}></div>
                        <Upload {...props} multiple>
                            <Button type="primary" className={'mt-5'} icon={<UploadOutlined />}>上传轮播图</Button>
                        </Upload>
                    </div>
                    <div className={'section mb-5'}>
                        <div className={'section w-100 h-40 border border-dashed border-orange-f9'}></div>
                        <Input placeholder="添加公告名称" />
                        <Button type="primary" className={'mt-5'} icon={<PlusOutlined />} >添加公告</Button>
                    </div>
                    <div className="float-right">
                        <Button className="mr-5" type='primary' onClick={() => this.submit(1002)}>保存草稿</Button>
                        <Button type='primary' ghost onClick={() => this.submit(1001)}>发布</Button>
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default Setting