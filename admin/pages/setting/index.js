import React, { Fragment } from 'react';
import {
    yellow,
    grey
} from '@ant-design/colors';
import { ColorPicker } from '@/components/ColorPicker';
import Head from 'next/head';
import Router, { withRouter } from 'next/router'
import {
    Modal, Menu, ConfigProvider,
    Button, Form, Input, Radio,
    Avatar, notification, Row, Col,
    Carousel, Upload, message, Card,
    DatePicker
} from 'antd';
import {
    RightOutlined,
    LeftOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
    EllipsisOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import moment from 'moment';
const { Dragger } = Upload;
let selectedBanner = {} // 当前banner配置
let selectedTheme = {} // 当前主题配置

// 轮播图弹框
const BannerOptionsForm = ({ visible, initProps, onSubmit, handleUpload, onCancel, handleDelete }) => {
    const { playWay = 0, title, link, url } = initProps
    const [form] = Form.useForm();
    setTimeout(() => {
        form.setFieldsValue({
            playWay, title, link, url
        });
    }, 100);
    return (
        <Modal
            visible={visible}
            forceRender
            title="修改轮播图属性"
            maskClosable={false}
            width={660}
            centered
            closable={false}
            footer={
                [
                    <Button type="primary" key="submit" onClick={() => {
                        form
                            .validateFields()
                            .then(async values => {
                                await onSubmit(values);
                                form.resetFields();
                            })
                            .catch(info => {
                                console.log('Validate Failed:', info);
                            })
                    }}>保存</Button>,
                    <Button key="back" onClick={onCancel}>取消</Button>,
                    <Button type="primary" key="delete" ghost onClick={() => {
                        handleDelete();
                        form.resetFields();
                    }}>删除</Button>
                ]
            }
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal_1"
                initialValues={{
                    playWay, title, link
                }}
            >
                <Form.Item
                    name="url"
                    label="图片"
                >
                    <Upload
                        fileList={[]}
                        customRequest={(option) => handleUpload(option)}
                        showUploadList={false}
                    >
                        <div className="text-lg h-40" style={{ margin: '0 auto', height: 160 }}>
                            <img src={url} style={{ height: '100%', margin: '0 auto' }} />
                        </div>
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="title"
                    label="标题名称"
                    rules={[
                        {
                            required: true,
                            message: '请输入标题名称!',
                        },
                    ]}
                >
                    <Input placeholder="请输入标题名称" />
                </Form.Item>
                <Form.Item name="link" label="跳转路径">
                    <Input type="text" placeholder="请输入跳转路径" />
                </Form.Item>
                <Form.Item name="playWay" label="轮播方式" className="collection-create-form_last-form-item">
                    <Radio.Group>
                        <Radio value={0}>无</Radio>
                        <Radio value={1}>自动轮播</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

// 主题颜色配置弹框
const ThemeForm = ({ visible, onSubmit, onCancel, handleColorChange, handleBgColorChange, initProps }) => {
    const { showNight = 0, background = grey.primary, color = yellow.primary } = initProps
    // console.log(initProps, 'props')
    const [form] = Form.useForm();
    setTimeout(() => {
        form.setFieldsValue({
            showNight, background, color
        });
    }, 100);
    return (
        <Modal
            visible={visible}
            forceRender
            title="配置主题属性"
            maskClosable={false}
            width={360}
            centered
            closable={false}
            footer={
                [
                    <Button type="primary" key="submit" onClick={() => {
                        form
                            .validateFields()
                            .then(async values => {
                                await onSubmit(values);
                                form.resetFields();
                            })
                            .catch(info => {
                                console.log('Validate Failed:', info);
                            })
                    }}>保存</Button>,
                    <Button key="back" onClick={onCancel}>取消</Button>
                ]
            }
        >
            <Form
                form={form}
                layout="inline"
                name="form_in_modal_2"
                initialValues={{ showNight: false }}
            >
                <Form.Item
                    // name="color"
                    label="主题颜色"
                    rules={[
                        {
                            // required: true,
                            message: '请选择主题颜色!',
                        },
                    ]}
                >
                    <Input placeholder="请输入标题名称" hidden />
                    <ColorPicker color={color} onChange={handleColorChange} />
                </Form.Item>
                <Form.Item
                    // name="background"
                    label="背景颜色">
                    <Input placeholder="请输入标题名称" hidden />
                    <ColorPicker color={background} onChange={handleBgColorChange} />
                </Form.Item>
                <Form.Item name="showNight" label="夜间模式" className="collection-create-form_last-form-item">
                    <Radio.Group>
                        <Radio value={0}>否</Radio>
                        <Radio value={1}>是</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};
class Setting extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ $api, userinfo }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        let data = {
            banner: [],
            notice: {},
            siteConfig: {},
            theme: {},
            activity: {},
            id: userinfo.websiteId || ''
        }
        let res = await $api.setting.get({ websiteId: data.id })
        if (res && res.success) {
            if (res.data) {
                data = { ...res.data, id: data.id }
                for (const key in data) {
                    if (!key.includes('id') && !key.includes('createTime') && !key.includes('updateTime')) {
                        if (key.includes('banner')) {
                            data[key] = data[key] !== null ? JSON.parse(data[key]) : []
                        } else {
                            data[key] = data[key] !== null ? JSON.parse(data[key]) : {}
                        }
                    }
                }
                selectedTheme = data.theme
            }
        }
        return {
            data
        }
    }
    state = {
        ...this.props,
        showModal: false, // 轮播图弹框
        showThemeModal: false // 主题配置弹框
    }

    // 上传/修改轮播图
    handleUpload (option) {
        if (this.state.data.banner.length >= 5 && !selectedBanner.url) {
            message.error('最多可上传5张图片')
            return true
        }
        let formData = new FormData()
        console.log(option.file, 'option.file')
        formData.append('file', option.file)
        formData.append('name', option.file.uid)
        $api.file.uploadFile(formData).then(res => {
            if (res && res.success) {
                message.success(res.message)
                if (!selectedBanner.url) {
                    this.setState({
                        data: {
                            ...this.state.data,
                            banner: [...this.state.data.banner, {
                                link: '',
                                title: '',
                                index: this.state.data.banner.length + 1,
                                url: res.data
                            }]
                        }
                    })
                } else {
                    selectedBanner.url = res.data
                    this.setState({
                        data: {
                            ...this.state.data,
                            banner: this.state.data.banner.map(el => {
                                if (el.index === selectedBanner.index) {
                                    el.url = res.data
                                }
                                return el
                            })
                        }
                    })
                }
            }
        })
    }
    // 点击设置轮播图参数
    handleSetBannerOptions (item) {
        selectedBanner = item
        this.setState({
            showModal: true
        })
    }
    // 轮播图弹框提交
    handleOk = values => {
        const { title, link } = values
        this.setState({
            showModal: false,
            data: {
                ...this.state.data,
                banner: this.state.data.banner.map(el => {
                    if (el.index === selectedBanner.index) {
                        el = {
                            ...el, title, link
                        }
                        return el
                    }
                    return el
                })
            }
        });
        selectedBanner = {}
        console.log(this.state.data.banner, 'banner');
    };
    // 轮播图弹框关闭
    handleCancel = () => {
        this.setState({
            showModal: false,
        });
        setTimeout(() => {
            selectedBanner = {}
        }, 100);
    };
    // 弹框轮播图删除
    handleDelete () {
        Modal.confirm({
            title: '温馨提示',
            icon: <ExclamationCircleOutlined />,
            content: '确认删除？',
            okText: '确认',
            onOk: () => {
                this.setState({
                    showModal: false,
                    data: {
                        ...this.state.data,
                        banner: this.state.data.banner.filter(el => el.index !== selectedBanner.index)
                    }
                })
                selectedBanner = {}
            },
            cancelText: '取消'
        })
    }

    // 主题修改提交
    onThemeSubmit (values) {
        this.setState({
            showThemeModal: false,
            data: {
                ...this.state.data,
                theme: { ...this.props.data.theme, ...values, ...selectedTheme }
            }
        })
        const { theme } = this.state.data
        window.less.modifyVars(//更换主题颜色
            {
                '@primary-color': theme.color,
                '@btn-primary-bg': theme.color,
                '@border-color-base': theme.color,
                '@layout-body-background': theme.background,
                '@layout-header-background': theme.background,
            }
        ).then(() => { console.log('success') })
            .catch(error => {
                console.log(error);
            })
        // console.log(this.state.data.theme, this.props.data.theme, 'themebackground')
    }
    //主题弹框关闭
    onThemeDialogClose () {
        this.setState({
            showThemeModal: false
        })
    }
    // 主题弹框颜色改变
    onColorChange (color) {
        selectedTheme = {
            ...selectedTheme,
            color
        }
    }
    // 主题弹框颜色改变
    onBgColorChange (background) {
        selectedTheme = {
            ...selectedTheme,
            background
        }
    }

    // 提交设置信息
    submit () {
        let { notice, siteConfig, theme, banner } = this.state.data
        let api = 'addConfig';
        if (banner.length < 3) {
            message.error('请最少上传3张轮播图！')
            return false
        }
        if (!notice.title || !notice.link) {
            message.error('请填写公告信息！')
            return false
        }
        if (!siteConfig.gitHub || !siteConfig.email) {
            message.error('请填写网站配置信息！')
            return false
        }
        if (this.state.data.id) {
            api = 'editConfig'
        }
        let data = {
            banner: JSON.stringify(this.state.data.banner),
            notice: JSON.stringify(this.state.data.notice),
            siteConfig: JSON.stringify(this.state.data.siteConfig),
            theme: JSON.stringify(this.state.data.theme),
            activity: JSON.stringify(this.state.data.activity),
            id: this.state.data.id
        }
        // console.log('onOk: ', data)
        $api.setting[api](data).then(res => {
            if (res && res.success) {
                if (res.data && res.data.id) {
                    message.success('网站配置发生变化，请重新登录！')
                    Router.push('/login')
                    return
                }
                $api.setting.get({ websiteId: data.id }).then(res => {
                    if (res && res.success) {
                        message.success(res.message)
                        let data = (res.data) || [{
                            banner: '[]',
                            notice: '{}',
                            siteConfig: '{}',
                            activity: '{}',
                            theme: '{}'
                        }]
                        this.setState({
                            banner: data && JSON.parse(data.banner),
                            notice: data && JSON.parse(data.notice),
                            theme: data && JSON.parse(data.theme) || {},
                            siteConfig: data && JSON.parse(data.siteConfig) || {},
                            activity: data && JSON.parse(data.activity) || {}
                            // id: data && data.id || 1
                        })
                        // 设置全局样式
                        setCookie(this.props.ctx, 'themeColor', data.theme)
                    }
                })
            }
        })
    }
    onTimeOk (value) {
        // console.log('onOk: ', value)
        this.setState({
            data: {
                ...this.state.data,
                activity: {
                    ...this.state.data.activity,
                    time: value._d
                }
            }
        })
    }
    render () {
        return (
            <Fragment>
                <Head>
                    <title>自定义装修</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>自定义装修</span>
                </h3>
                <div className={'container'}>
                    <div className={'section mb-5'}>
                        <h3 className='text-gray-600 text-x22 leading-4 mb-6 pl-2' style={{ width: '100%' }}>
                            <span>一、轮播配置</span>
                            <div className="float-right">
                                <Upload
                                    multiple
                                    fileList={[]}
                                    customRequest={(option) => this.handleUpload(option)}
                                    showUploadList={false}
                                >
                                    <Button type="primary" className="upload-text">
                                        <UploadOutlined />点击上传轮播图
                                    </Button>
                                </Upload>
                            </div>
                        </h3>
                        <div
                            style={{ height: 270 }}
                            className={'section border p-2 border-dashed border-orange-f9'}>
                            <Carousel
                                autoplay
                                arrows={true}
                            // slidecount={this.state.data.banner.length}
                            // nextArrow={<RightOutlined />}
                            // prevArrow={<LeftOutlined />}
                            // effect="silde"
                            >
                                {this.state.data.banner.length ?
                                    this.state.data.banner.map(item => (
                                        <div
                                            key={item.index}
                                            onClick={this.handleSetBannerOptions.bind(this, item)}>
                                            <a><img src={item.url} /><h3>{item.title}</h3></a>
                                        </div>)) :
                                    <Dragger
                                        key={0}
                                        multiple
                                        customRequest={(option) => this.handleUpload(option)}
                                        showUploadList={false}
                                        fileList={[]}
                                    >
                                        <div className="upload-text text-lg">
                                            <UploadOutlined />点击或拖拽上传轮播图
                                            </div>
                                    </Dragger>}
                            </Carousel>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between lg:flex-row">
                        <div className={'section flex-1 mr-4'}>
                            <h3 className='text-gray-600 text-x22 leading-4 mb-5 pl-2'>
                                <span>二、主题样式配置</span>
                            </h3>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Card title="默认主题" bordered={true} actions={[
                                        <EditOutlined key="edit" onClick={() => this.setState({
                                            showThemeModal: true
                                        })} />,
                                        <EllipsisOutlined key="ellipsis" />
                                    ]}>
                                        <div className="theme-box">
                                            <div className="left float-left" style={{ backgroundColor: this.state.data.theme.background }}>背景色</div>
                                            <div className="top float-right" style={{ backgroundColor: this.state.data.theme.background }}>背景色</div>
                                            <div className="main">
                                                <div className="container" style={{ linHeight: '100%', backgroundColor: this.state.data.theme.color }}>
                                                    主题字体颜色
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div className="flex flex-1 flex-col mt-5 lg:mt-0 data-config-centent">
                            <div className={'section mb-5'}>
                                <h3 className='text-gray-600 text-x22 leading-4 mb-5 lg:mb-0 pl-2'>
                                    <span>三、公告配置</span>
                                </h3>
                                <div className="mt-5 lg:inline-block">
                                    <Input placeholder="添加活动公告名称"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, notice: { ...this.state.data.notice, title: e.target.value } } })}
                                        value={this.state.data.notice.title} />
                                </div>
                                <div className="mt-5 lg:inline-block">
                                    <Input placeholder="添加活动公告链接"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, notice: { ...this.state.data.notice, link: e.target.value } } })}
                                        value={this.state.data.notice.link} />
                                </div>
                            </div>
                            <div className={'section mb-5'}>
                                <h3 className='text-gray-600 text-x22 leading-4 mb-5 lg:mb-0 pl-2'>
                                    <span>四、网站信息配置</span>
                                </h3>
                                <div className="mt-5 lg:inline-block">
                                    <Input placeholder="github仓库地址"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, siteConfig: { ...this.state.data.siteConfig, gitHub: e.target.value } } })}
                                        value={this.state.data.siteConfig.gitHub} />
                                </div>
                                <div className="mt-5 lg:inline-block">
                                    <Input placeholder="博主邮箱地址"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, siteConfig: { ...this.state.data.siteConfig, email: e.target.value } } })}
                                        value={this.state.data.siteConfig.email} />
                                </div>
                            </div>
                            <div className={'section mb-5'}>
                                <h3 className='text-gray-600 text-x22 leading-4 mb-5 lg:mb-0 pl-2'>
                                    <span>四、活动时间配置</span>
                                </h3>
                                <div className="mt-5 lg:inline-block">
                                    <Input placeholder="活动名称"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, activity: { ...this.state.data.activity, name: e.target.value } } })}
                                        value={this.state.data.activity.name} />
                                </div>
                                <div className="mt-5 lg:inline-block">
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder="选择活动时间"
                                        value={moment(this.state.data.activity.time)}
                                        showTime
                                        onOk={(val) => this.onTimeOk(val)}
                                    />
                                </div>
                            </div>
                            <Button className="mt-5 w-40" type='primary' onClick={() => this.submit(1002)}>保存</Button>
                        </div>
                    </div>
                </div>
                <BannerOptionsForm
                    visible={this.state.showModal}
                    initProps={selectedBanner}
                    handleUpload={(option) => this.handleUpload(option)}
                    onSubmit={(values) => this.handleOk(values)}
                    onCancel={this.handleCancel.bind(this)}
                    handleDelete={this.handleDelete.bind(this)}
                />
                <ThemeForm
                    visible={this.state.showThemeModal}
                    onSubmit={(values) => this.onThemeSubmit(values)}
                    onCancel={this.onThemeDialogClose.bind(this)}
                    handleColorChange={this.onColorChange.bind(this)}
                    handleBgColorChange={this.onBgColorChange.bind(this)}
                    initProps={this.state.data.theme}
                />
            </Fragment>
        )
    }
}
export default Setting