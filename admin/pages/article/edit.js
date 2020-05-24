import React, { Fragment } from 'react';
import { Editor as BraftEditor } from '@/components/Editor'
import { Button, Select, Tag, message, Input, Cascader } from 'antd';
import Router, { withRouter } from 'next/router'
import { filterTreeData } from '@/utils'
const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
    'green', 'cyan', 'blue', 'geekblue', 'blue', 'purple'];
function tagRender (props) {
    const { label, value, closable, onClose } = props;
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
class ArticleEdit extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ ctx, $api }) {
        // 从query参数中回去id
        const { query } = ctx
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const [res, detail, cateRes] = await Promise.all([await $api.tag.get(),
        await $api.article.getById({ params: { id: query.id } }),
        await $api.category.get()])
        if (res && res.success && detail && detail.success) {
            const { id, title, content, tags, category } = detail.data
            let categoryOptions = filterTreeData((cateRes.data[0]), null)
            return {
                loading: false,
                tagsList: res.data[0].map(el => ({
                    value: el.id,
                    label: el.value,
                    id: el.id
                })),
                categoryList: categoryOptions,
                articleForm: {
                    id, title, content,
                    tags: (tags && tags.map(el => ({
                        value: el.id,
                        label: el.value,
                        id: el.id
                    }))) || [],
                    category: (category && category !== null && category.split(',')) || '',
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
                    category: '',
                    tags: []
                }
            }
        }

    }
    state = {
        loading: false,
        articleForm: this.props.articleForm,
        categoryList: this.props.categoryList,
        tagsList: this.props.tagsList,
        total: this.props.total
    }
    setArticle (callback) {
        return callback(this.state.articleForm)
    }
    handleTagSelect (value, arr) {
        console.log(value, arr, 'value, selectedOptions');
        this.setState({ articleForm: { ...this.state.articleForm, tags: arr } })
    }
    categorySelect (value, arr) {
        let categoryName = arr.map(el => el.value).join('>')
        this.setState({ articleForm: { ...this.state.articleForm, category: value.join(','), categoryName } })
    }
    submit (status) {
        let { tags, category } = this.state.articleForm
        if (category && category instanceof Array) category = category.join(',')
        let data = { ...this.state.articleForm, status, category, tags: tags.map(el => el.id) || [] }
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
                res && message.error(res.message)
            }
        })
    }
    render () {
        return (
            <Fragment>
                <h3 className='text-gray-600 text-lg leading-4 mb-10 divide-x border-solid border-l-4 pl-2 border-orange-f9'>
                    <span>编辑文章</span>
                    <div className="float-right">
                        <Button className="mr-5" type='primary' onClick={() => this.submit(1002)}>保存待审核</Button>
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
                        >
                        </Select>
                    </div>
                    <div className="tag-list">
                        <div className="text-gray-600 text-sm leading-4 mt-5 mb-5 border-solid border-b-2 pb-4 border-orange-f9">三、关联分类</div>
                        {/* <Select
                            mode="multiple"
                            tagRender={tagRender}
                            placeholder="选择或搜索分类"
                            defaultValue={[]}
                            onChange={(value, arr) => this.handleTagSelect(value, arr)}
                            style={{ width: '500px' }}
                            options={this.state.categoryList}
                        /> */}
                        <Cascader
                            options={this.state.categoryList}
                            // showSearch={{ filter }}
                            defaultValue={this.state.articleForm.category ? [this.state.articleForm.category] : ''}
                            fieldNames={{ label: 'value', value: 'id' }}
                            placeholder={'选择上级分类'}
                            onChange={(value, selectedOptions) => this.categorySelect(value, selectedOptions)}
                            changeOnSelect={true} />
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default withRouter(ArticleEdit)