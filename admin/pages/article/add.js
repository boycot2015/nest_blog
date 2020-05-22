import React, { Fragment } from 'react';
import { Editor as BraftEditor } from '@/components/Editor'
import { Button, Select, Tag, message, Input } from 'antd';
import Router, { withRouter } from 'next/router'
function tagRender (props) {
    const { label, value, closable, onClose } = props;
    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
        'green', 'cyan', 'blue', 'geekblue', 'blue', 'purple'];
    console.log(props, 'data')
    return (
        <Tag
            key={value}
            color={colors[Math.floor(Math.random() * (colors.length - 1))]}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}>
            {label}
        </Tag>
    );
}
class ArticleAdd extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        articleForm: {
            title: '',
            content: '',
            tags: ''
        },
        tagsList: this.props.tagsList,
        categoryList: this.props.categoryList,
        total: this.props.total
    }
    static async getInitialProps ({ query,  $api }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const res = await $api.tag.get()
        const cateRes = await $api.category.get()
        // console.log(res.data, cookies, 'data')
        if (res && res.success && cateRes && cateRes.success) {
            return {
                loading: false,
                tagsList: res.data[0].map(el => ({
                    value: el.id,
                    label: el.value,
                    id: el.id
                })),
                categoryList: cateRes.data[0].map(el => ({
                    value: el.id,
                    label: el.value,
                    id: el.id
                })),
                total: res.data[1]
            }
        } else {
            return {
                loading: true,
                tagsList: [],
                total: 0
            }
        }

    }
    setArticle (callback) {
        return callback(this.state.articleForm)
    }
    handleTagSelect (value, arr) {
        console.log(value, 'ASDAS')
        arr = arr.map(el => el.id) || []
        this.setState({ articleForm: { ...this.state.articleForm, tags: arr } })
    }
    submit (status) {
        let data = { ...this.state.articleForm, status }
        console.log(data, 'tag')
        if (!data.title) {
            message.error('文章标题不能为空！')
            return true
        }
        if (data.content === '<p></p>') {
            message.error('文章内容不能为空！')
            return true
        }
        $api.article.add({ data }).then(res => {
            if (res && res.success) {
                Router.push('/article')
            } else {
                res && message.error(res.message)
            }
        })
    }
    render () {
        return (
            <Fragment>
                <h3 className='text-gray-600 text-lg leading-4 mb-10 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>添加文章</span>
                    <div className="float-right">
                        <Button className="mr-5" type='primary' onClick={() => this.submit(1002)}>保存草稿</Button>
                        <Button type='primary' ghost onClick={() => this.submit(1001)}>发布</Button>
                    </div>
                </h3>
                <div className="form-container">
                    <div className="title mb-10">
                        <div className="text-gray-600 text-sm leading-4 mb-5 border-solid border-b-2 pb-4 border-orange-f9">一、文章标题</div>
                        <Input
                            style={{ width: '500px' }}
                            onChange={(e) => {
                                this.setState({ articleForm: { ...this.state.articleForm, title: e.target.value } })
                            }}
                            value={this.state.articleForm.title}
                            placeholder="请输入标题"></Input>
                    </div>
                    <article>
                        <div className="text-gray-600 text-sm leading-4 mb-5 border-solid border-b-2 pb-4 border-orange-f9">二、文章内容</div>
                        <BraftEditor
                            value={this.state.articleForm.content}
                            onChange={(value) => {
                                this.setArticle((article) => {
                                    article.content = value;
                                    return article;
                                });
                            }}
                        ></BraftEditor>
                    </article>
                    <div className="tag-list">
                        <div className="text-gray-600 text-sm leading-4 mt-5 mb-5 border-solid border-b-2 pb-4 border-orange-f9">三、关联标签</div>
                        <Select
                            mode="multiple"
                            tagRender={tagRender}
                            placeholder="选择或搜索标签"
                            defaultValue={[]}
                            onChange={(value, arr) => this.handleTagSelect(value, arr)}
                            style={{ width: '500px' }}
                            options={this.state.tagsList}
                        />
                    </div>
                    <div className="tag-list">
                        <div className="text-gray-600 text-sm leading-4 mt-5 mb-5 border-solid border-b-2 pb-4 border-orange-f9">三、关联分类</div>
                        <Select
                            mode="multiple"
                            tagRender={tagRender}
                            placeholder="选择或搜索分类"
                            defaultValue={[]}
                            onChange={(value, arr) => this.handleTagSelect(value, arr)}
                            style={{ width: '500px' }}
                            options={this.state.categoryList}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default withRouter(ArticleAdd)