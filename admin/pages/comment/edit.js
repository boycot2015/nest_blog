import React, { Fragment } from 'react';
import { Editor as BraftEditor } from '@/components/Editor'
import { Button, Select, Tag, message, Input } from 'antd';
import Router, { withRouter } from 'next/router'
const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
    'green', 'cyan', 'blue', 'geekblue', 'blue', 'purple'];
function tagRender (props) {
    const { label, value, closable, onClose } = props;
    return (
        <Tag color={colors[Math.floor(Math.random() * (colors.length - 1))]} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
            {value}
        </Tag>
    );
}
class ArticleEdit extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        loading: false,
        articleForm: this.props.articleForm,
        tagsList: this.props.tagsList,
        total: this.props.total
    }
    static async getInitialProps ({ ctx, $api }) {
        // 从query参数中回去id
        const { query } = ctx
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const [res, detail] = await Promise.all([await $api.tag.get(), await $api.article.getById({ params: { id: query.id } })])
        if (res && res.success && detail && detail.success) {
            const { id, title, content, tags } = detail.data
            return {
                loading: false,
                tagsList: res.data[0].map(el => ({
                    value: el.value,
                    label: el.label,
                    id: el.id
                })),
                articleForm: {
                    id, title, content,
                    tags: (tags && tags.map(el => ({
                        value: el.value,
                        label: el.label,
                        id: el.id
                    }))) || [],
                    total: res.data[1]
                }
            }
        } else {
            return {
                loading: true,
                tagsList: [],
                articleForm: {
                    title: '',
                    content: '',
                    tags: []
                }
            }
        }

    }
    setArticle (callback) {
        return callback(this.state.articleForm)
    }
    handleTagSelect (value, arr) {
        this.setState({ articleForm: { ...this.state.articleForm, tags: arr } })
    }
    submit (status) {
        const { tags, id, title, content } = this.state.articleForm
        let data = { id, title, content, status, tags: tags.map(el => el.id) || [] }
        if (!data.title) {
            message.error('文章标题不能为空！')
            return true
        }
        if (data.content === '<p></p>') {
            message.error('文章内容不能为空！')
            return true
        }
        $api.article.edit({ data }).then(res => {
            if (res && res.success) {
                Router.push('/article')
            } else {
                message.error(res.message)
            }
        })
    }
    render () {
        return (
            <Fragment>
                <h3 className='text-gray-600 text-lg leading-4 mb-10 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>编辑文章</span>
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
                            styles={{
                                height: 400
                            }}
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
                            defaultValue={this.state.articleForm.tags}
                            onChange={(value, arr) => this.handleTagSelect(value, arr)}
                            style={{ width: '500px' }}
                            labelInValue
                            options={this.state.tagsList}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default withRouter(ArticleEdit)