import React, { useState, Fragment } from 'react';
import Head from 'next/head';
import {
    Form, Tag, notification,
    Button, Row, Col, Input,
    Select, Table, Cascader,
    Badge, message, Modal,
    Tree
} from 'antd';
import {
    filterTreeData
} from '@/utils';
let selectedCategory = {}
// const { Option } = Select
const CategoryForm = (props) => {
    const [form] = Form.useForm();
    const [formLayout] = useState('inline');
    let colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
        'green', 'cyan', 'blue', 'geekblue', 'blue', 'purple'];
    const handleSubmitForm = (value) => {
        props.setCategoryData(value)
    }
    setTimeout(() => {
        !props.isEdit && form.resetFields()
    }, 200)
    const handleTagClick = (category, e) => {
        let {
            parentId = null,
            value,
            id,
            label
        } = e.node
        parentId = (parentId && [parentId]) || null
        props.categories.map(el => {
            if (el.id === e.node.parentId) {
                if (el.parentId !== null) {
                    parentId.unshift(el.parentId)
                }
            }
        })
        form.setFieldsValue({
            parentId,
            value,
            id,
            label
        });
        selectedCategory = {
            parentId,
            value,
            id,
            label
        }
        props.setCategoryStatus(true)
    }
    const resetField = () => {
        form.resetFields()
        selectedCategory = {
            parentId: null,
            value: '',
            id: '',
            label: ''
        }
        props.setCategoryStatus(false)
    }
    const handleCloseCategory = async () => {
        await props.handleDelete(selectedCategory)
    }

    let categoryOptions = props.categories
    categoryOptions = filterTreeData(JSON.parse(JSON.stringify(categoryOptions)), null)
    let defaultOption = {
        id: '',
        parentId: null,
        value: '作为顶级分类'
    }
    categoryOptions.unshift(defaultOption)
    return (
        <Form
            layout={formLayout}
            name="basic"
            onFinish={handleSubmitForm}
            style={{ width: 1200 }}
            initialValues={props.state.initData}
            form={form}>
            <Row>
                {<Col span={10}
                    style={{ borderRight: '1px solid #e8e8e8', paddingRight: 20, marginRight: 40 }}>
                    <Form.Item
                        name='parentId'
                        style={{ marginBottom: 20 }}
                        label="选择上级分类"
                        rules={[
                            {
                                required: true,
                                message: '请选择上级分类',
                            }
                        ]}>
                        <Cascader
                            options={categoryOptions}
                            // showSearch={{ filter }}
                            // defaultValue={[]}
                            fieldNames={{ label: 'value', value: 'id' }}
                            placeholder={'选择上级分类'}
                            changeOnSelect={true} />
                    </Form.Item>
                    <Form.Item
                        name='value'
                        rules={[
                            {
                                required: true,
                                message: '请输入分类名称',
                            }
                        ]}>
                        <Input placeholder="请输入分类名称"
                            value={props.categories[0] && props.categories[0].value}></Input>
                    </Form.Item>
                    <Form.Item name='id' style={{ display: 'none' }}>
                        <Input hidden
                            value={props.categories[0] && props.categories[0].value}></Input>
                    </Form.Item>
                    <Form.Item style={{ marginTop: 20 }}>
                        <Button htmlType="submit">{props.isEdit ? '编辑' : '新增'}</Button>
                        {props.isEdit ? <Button style={{ marginLeft: 20 }} type="primary" onClick={() => { handleCloseCategory() }}>{'删除'}</Button> : null}
                        {<Button style={{ marginLeft: 20 }} ghost type="primary" onClick={resetField}>{'重置'}</Button>}
                    </Form.Item>
                </Col>}
                <Col span={10} >
                    <Form.Item style={{ minWidth: 500, maxWidth: 800 }}>
                        <Tree
                            showLine={true}
                            onSelect={handleTagClick}
                            defaultExpandedKeys={[categoryOptions[1] && categoryOptions[1].id]}
                            treeData={categoryOptions.slice(1)}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
class Category extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        data: this.props.data,
        total: this.props.total,
        isEdit: false,
        initData: {}
    }
    static async getInitialProps ({ $api, userinfo }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const res = await $api.category.get()
        // console.log(res.data, cookies, 'data')
        if (res && res.success) {
            return {
                loading: false,
                data: res.data[0],
                total: res.data[1],
                userinfo
            }
        } else {
            return {
                loading: true,
                data: [],
                total: 0,
                userinfo
            }
        }

    }
    handleDelete (data) {
        let params = {}
        params.params = { id: data.id }
        Modal.confirm({
            title: '温馨提示',
            content: '确认删除？',
            okText: '确认',
            onOk: () => {
                $api.category.delete(params).then(res => {
                    res && !res.success && message.error(res.message)
                    res && res.success && message.success(res.data)
                    res && res.success && $api.category.get().then(res => {
                        this.setState({
                            isEdit: false,
                            data: res.data[0]
                        })
                    })
                })
            },
            cancelText: '取消'
        })
    }
    handleSetCategory (data) {
        let api = data.id && this.state.isEdit ? 'edit' : 'add';
        let params = {}
        params.data = {}
        const { parentId, value, id } = data
        let len = parentId.length - 1
        params.data.value = value
        api === 'edit' && (params.data.id = id)
        params.data.parentId = parentId[len] || null
        $api.category[api](params).then(res => {
            res && !res.success && message.error(res.message)
            res && res.success && message.success(res.data)
            res && res.success && $api.category.get().then(res => {
                this.setState({
                    data: res.data[0]
                })
            })
        })
    }
    render () {
        return (
            <Fragment>
                <Head>
                    <title>分类管理</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>分类管理</h3>
                <Row>
                    <Col span={16} >
                        <CategoryForm
                            isEdit={this.state.isEdit}
                            state={this.props}
                            handleDelete={(value) => this.handleDelete(value)}
                            setCategoryStatus={(value) => this.setState({ isEdit: value })}
                            setCategoryData={(value) => this.handleSetCategory(value)}
                            categories={this.state.data} />
                    </Col>
                </Row>
            </Fragment >
        )
    }
}
export default Category