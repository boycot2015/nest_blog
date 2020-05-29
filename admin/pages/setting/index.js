import React, { Fragment } from 'react';
import Head from 'next/head';
import {
    Modal, Menu, ConfigProvider,
    Button, Form, Input, Radio,
    Avatar, notification, Row, Col,
    Carousel, Upload, message, Card
} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    RobotOutlined,
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
    UploadOutlined
} from '@ant-design/icons';
const { Dragger } = Upload;
let selectedBanner = {}
const BannerOptionsForm = ({ visible, initProps, onSubmit, handleUpload, onCancel, handleDelete }) => {
    const [form] = Form.useForm();
    const { playWay = 0, title, link, url } = initProps
    form.setFieldsValue({
        playWay, title, link, url
    });
    return (
        <Modal
            visible={visible}
            // okText="保存"
            // cancelText="取消"
            title="修改轮播图属性"
            maskClosable={false}
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
                    <Button type="primary" ghost onClick={handleDelete}>删除</Button>
                ]
            }
        // onCancel={onCancel}
        // onOk={() => {
        //     form
        //         .validateFields()
        //         .then(async values => {
        //             await onSubmit(values);
        //             form.resetFields();
        //         })
        //         .catch(info => {
        //             console.log('Validate Failed:', info);
        //         });
        // }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    playWay, title, link
                }}
            >
                <Form.Item
                    name="url"
                    label="图片"
                >
                    <Upload
                        customRequest={(option) => handleUpload(option)}
                        showUploadList={false}
                    >
                        <div className="text-lg h-20" style={{ width: '400px', margin: '0 auto' }}>
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
class Setting extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ $api }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        let res = await $api.setting.get()
        console.log(res.data, '$api')
        if (res && res.success) {
            let data = {
                banner: [],
                notice: {},
                siteConfig: {},
                theme: {},
                id: ''
            }
            if (res && res.data[0].length) {
                data.banner = res.data[0][0].banner !== null ? JSON.parse(res.data[0][0].banner) : []
                data.notice = res.data[0][0].notice !== null ? JSON.parse(res.data[0][0].notice) : {}
                data.siteConfig = res.data[0][0].siteConfig !== null ? JSON.parse(res.data[0][0].siteConfig) : {}
                data.theme = res.data[0][0].theme !== null ? JSON.parse(res.data[0][0].theme) : {}
                data.id = res.data[0][0].id
            }
            return {
                data
            }
        }
        return {
            data: {
                banner: [],
                notice: {},
                siteConfig: {},
                theme: {},
                id: ''
            }
        }
    }
    state = {
        ...this.props,
        showModal: false
    }
    handleUpload (option) {
        if (this.state.data.banner.length >= 5) {
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
    handleSetBannerOptions (item) {
        selectedBanner = item
        this.setState({
            showModal: true
        })
    }
    handleAddNotice (data) {
        let { notice } = this.state.data
        if (!notice.title || !notice.link) {
            message.error('请填写公告信息！')
            return false
        }
        this.setState({
            data: {
                ...this.state.data
            }
        })
    }
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

    handleCancel = () => {
        selectedBanner = {}
        this.setState({
            showModal: false,
        });
    };

    handleDelete () {
        this.setState({
            showModal: false,
            data: {
                ...this.state.data,
                banner: this.state.data.banner.filter(el => el.index !== selectedBanner.index)
            }
        })
        selectedBanner = {}
    }

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
        if (this.state.id) {
            api = 'editConfig'
        }
        $api.setting[api](this.state.data).then(res => {
            if (res && res.success) {
                $api.setting.get().then(res => {
                    if (res && res.success) {
                        message.success(res.message)
                        let data = (res.data && res.data[0].length && res.data[0]) || [{
                            banner: '[]',
                            notice: '{}',
                            siteConfig: '{}',
                            theme: '{}'
                        }]
                        this.setState({
                            banner: data && JSON.parse(data[0].banner),
                            notice: data && JSON.parse(data[0].notice),
                            theme: data && JSON.parse(data[0].theme) || {},
                            siteConfig: data && JSON.parse(data[0].siteConfig) || {},
                            id: data && data[0].id || ''
                        })
                    }
                })
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
                            style={{ height: 280 }}
                            className={'section border p-2 border-dashed border-orange-f9'}>
                            <Carousel
                                autoplay
                                effect="fade">
                                {this.state.data.banner.length ?
                                    this.state.data.banner.map(item => (
                                        <div key={item.index} onClick={this.handleSetBannerOptions.bind(this, item)}>
                                            <a><img src={item.url} /></a>
                                            <h3>{item.title}</h3>
                                        </div>)) :
                                    <Dragger
                                        multiple
                                        customRequest={(option) => this.handleUpload(option)}
                                        showUploadList={false}
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
                                        <SettingOutlined key="setting" />,
                                        <EditOutlined key="edit" />,
                                        <EllipsisOutlined key="ellipsis" />
                                    ]}>
                                        <div className="theme" style={{ height: 170, width: '100%' }}>
                                            <div className="left float-left" style={{ width: 40, height: 170, backgroundColor: 'blue' }}></div>
                                            <div className="top float-right" style={{ width: 'calc(100% - 40px)', height: 20, backgroundColor: 'green' }}></div>
                                            <div className="main" style={{ width: '100%', height: 170, backgroundColor: 'black' }}></div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div className="flex flex-1 flex-col mt-5 lg:mt-0">
                            <div className={'section mb-5'}>
                                <h3 className='text-gray-600 text-x22 leading-4 mb-5 pl-2'>
                                    <span>三、公告配置</span>
                                </h3>
                                <div className="mt-5 lg:mt-0 lg:inline-block">
                                    <Input placeholder="添加活动公告名称"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, notice: { ...this.state.data.notice, title: e.target.value } } })}
                                        value={this.state.data.notice.title} />
                                </div>
                                <div className="mt-5 lg:mt-0 lg:inline-block">
                                    <Input placeholder="添加活动公告链接"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, notice: { ...this.state.data.notice, link: e.target.value } } })}
                                        value={this.state.data.notice.link} />
                                </div>
                            </div>
                            <div className={'section mb-5'}>
                                <h3 className='text-gray-600 text-x22 leading-4 mb-5 pl-2'>
                                    <span>四、网站信息配置</span>
                                </h3>
                                <div className="mt-5 lg:mt-0 lg:inline-block">
                                    <Input placeholder="github仓库地址"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, siteConfig: { ...this.state.data.siteConfig, gitHub: e.target.value } } })}
                                        value={this.state.data.siteConfig.gitHub} />
                                </div>
                                <div className="mt-5 lg:mt-0 lg:inline-block">
                                    <Input placeholder="博主邮箱地址"
                                        onChange={(e) => this.setState({ data: { ...this.state.data, siteConfig: { ...this.state.data.siteConfig, email: e.target.value } } })}
                                        value={this.state.data.siteConfig.email} />
                                </div>
                            </div>
                            <Button className="mt-5 w-40" type='primary' onClick={() => this.submit(1002)}>保存</Button>
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
                </div>
            </Fragment>
        )
    }
}
export default Setting