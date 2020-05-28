import React, { Fragment } from 'react';
import Head from 'next/head';
import {
    Modal, Menu, ConfigProvider,
    Button, Form, Input, Radio,
    Avatar, notification,
    Carousel, Upload, message
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
let selectedBanner = {}
const BannerOptionsForm = ({ visible, initProps, onSubmit, onCancel }) => {
    const [form] = Form.useForm();
    const { playWay = 0, title, link } = initProps
    console.log({ playWay, title, link }, 'initialValues')
    return (
        <Modal
            visible={visible}
            title="编辑轮播图"
            okText="保存"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then(async values => {
                        await onSubmit(values);
                        form.resetFields();
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
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
                    name="title"
                    label="标题名称"
                    rules={[
                        {
                            required: true,
                            message: '请输入标题名称!',
                        },
                    ]}
                >
                    <Input value={title} placeholder="请输入标题名称" />
                </Form.Item>
                <Form.Item name="link" label="跳转路径">
                    <Input type="text" placeholder="请输入跳转路径" value={link} />
                </Form.Item>
                <Form.Item name="playWay" label="轮播方式" className="collection-create-form_last-form-item">
                    <Radio.Group value={playWay}>
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
            return {
                data: (res.data && res.data[0].length && res.data[0]) || [{
                    banner: '[]',
                    notice: '{}'
                }]
            }
        }
        return {
            data: [{
                banner: '[]',
                notice: '{}'
            }]
        }
    }
    state = {
        data: {
            banner: this.props.data && JSON.parse(this.props.data[0].banner),
            notice: this.props.data && JSON.parse(this.props.data[0].notice),
            id: this.props.data[0].id || ''
        },
        uploadProps: {
            fileList: []
        },
        bannerForm: {},
        showModal: false
    }
    handleUpload (option) {
        if (this.state.data.banner.length >= 5) {
            message.error('最多可上传5张图片')
            return true
        }
        let formData = new FormData()
        // console.log(option.file, 'option.file')
        formData.append('file', option.file)
        formData.append('name', option.file.uid)
        $api.file.uploadFile(formData).then(res => {
            if (res && res.success) {
                message.success(res.message)
                this.setState({
                    data: {
                        ...this.state.data,
                        banner: [...this.state.data.banner, {
                            url: '',
                            title: '',
                            url: res.data
                        }]
                    }
                })
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
        this.setState({
            showModal: false,
            data: {
                ...this.state.data,
                banner: this.state.data.banner.map(el => {
                    if (el.url === selectedBanner.url) {
                        selectedBanner = {
                            ...el,
                            ...values
                        }
                        return selectedBanner
                    }
                    return el
                })
            }
        });
        console.log(this.state.data.banner, 'banner');
    };

    handleCancel = e => {
        this.setState({
            showModal: false,
        });
    };

    submit () {
        let { notice } = this.state.data
        if (!notice.title || !notice.link) {
            message.error('请填写公告信息！')
            return false
        }
        if (!this.state.id) {
            $api.setting.addConfig(this.state.data).then(res => {
                if (res && res.success) {
                    $api.setting.get().then(res => {
                        if (res && res.success) {
                            message.success(res.message)
                            let data = (res.data && res.data[0].length && res.data[0]) || [{
                                banner: '[]',
                                notice: '{}'
                            }]
                            this.setState({
                                banner: data && JSON.parse(data[0].banner),
                                notice: data && JSON.parse(data[0].notice),
                                id: data && data[0].id || ''
                            })
                        }
                    })
                }
            })
        } else {
            $api.setting.editConfig(this.state.data).then(res => {
                if (res && res.success) {
                    $api.setting.get().then(res => {
                        if (res && res.success) {
                            message.success(res.message)
                            let data = (res.data && res.data[0].length && res.data[0]) || [{
                                banner: '[]',
                                notice: '{}'
                            }]
                            this.setState({
                                banner: data && JSON.parse(data[0].banner),
                                notice: data && JSON.parse(data[0].notice),
                                id: data && data[0].id || ''
                            })
                        }
                    })
                }
            })
        }
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
                        <div
                            style={{ height: 280 }}
                            className={'section border p-2 border-dashed border-orange-f9'}>
                            <Carousel
                                autoplay
                                effect="fade">
                                {this.state.data.banner.length ?
                                    this.state.data.banner.map(item => (
                                        <div key={item.url} onClick={() => this.handleSetBannerOptions(item)}>
                                            <a><img src={item.url} /> </a>
                                            <h3>{item.title}</h3>
                                        </div>)) :
                                    <Upload
                                        multiple
                                        customRequest={(option) => this.handleUpload(option)}
                                        showUploadList={false}
                                    >
                                        <div className="upload-text text-lg">
                                            请上传轮播图
                                        </div>
                                    </Upload>}
                            </Carousel>
                        </div>
                        <Upload
                            multiple
                            customRequest={(option) => this.handleUpload(option)}
                            showUploadList={false}
                        >
                            <Button type="primary" className={'mt-5'} icon={<UploadOutlined />}>上传轮播图</Button>
                        </Upload>
                    </div>
                    <div className={'section mb-5'}>
                        <Input placeholder="添加公告名称"
                            className={'section'}
                            onChange={(e) => this.setState({ data: { ...this.state.data, notice: { ...this.state.data.notice, title: e.target.value } } })}
                            value={this.state.data.notice.title} />
                        <Input placeholder="添加公告链接"
                            className={'section'}
                            onChange={(e) => this.setState({ data: { ...this.state.data, notice: { ...this.state.data.notice, link: e.target.value } } })}
                            value={this.state.data.notice.link} />
                        <Button type="primary"
                            onClick={() => { this.handleAddNotice(this.state.data.notice) }}
                            className={'mt-5'} icon={<PlusOutlined />}
                        >添加公告</Button>
                    </div>
                    <div className="float-left">
                        <Button className="mr-5" type='primary' onClick={() => this.submit(1002)}>保存</Button>
                    </div>
                    <Modal
                        title="Basic Modal"
                        visible={this.state.showModal}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <BannerOptionsForm
                            visible={this.state.showModal}
                            initProps={selectedBanner}
                            onSubmit={(values) => this.handleOk(values)}
                            onCancel={this.handleCancel}
                        />
                    </Modal>
                </div>
            </Fragment>
        )
    }
}
export default Setting