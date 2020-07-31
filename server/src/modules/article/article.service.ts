import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from "../../entities/article.entity";
import { responseStatus, filterTreeData } from "../../utils";
import * as dayjs from 'dayjs';
import { TagService } from '../tag/tag.service';
import { AuthService } from '../auth/auth.service';
import { CategoryService } from '../category/category.service';
import { tianApi } from '../../api';
@Injectable()
export class ArticleService {
    constructor(@InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
        private readonly authService: AuthService,
        private readonly categoryService: CategoryService,
        private readonly tagService: TagService
    ) { }
    async get(data) {
        data.current = data.current || 1
        data.pageSize = data.pageSize || 10
        // console.log(data, 'asdada')
        // 1. 准备工作：注入Repository，创建queryBuilder
        // 条件筛选和分页查询代码
        let queryBy = this.articleRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.comment', 'comment')
            // .andWhere('comment.status = :status', { status: 1001 })
            .leftJoinAndSelect('article.category', 'category')
            .andWhere('article.isDelete=:delete').setParameter('delete', false)

        // 2. 条件筛选查询，如名称、类型等，传入对应字段即可
        // queryBy = queryBy.where(data as Partial<Article>)
        const { current = 1, pageSize = 12, status, order, category, tag, ...otherParams } = data;
        if (status) {
            queryBy.andWhere('article.status=:status').setParameter('status', status);
        }
        if (category) {
            let categoryIds = category.split(',');
            queryBy.andWhere('article.categoryId=:category').setParameter('category', categoryIds[categoryIds.length - 1]);
        }
        if (tag) {
            let tagId = ('' + tag).split(',');
            queryBy.leftJoinAndSelect('article.tags', 'tag').andWhere('tag.id = :id', { id: tagId })
        } else {
            queryBy.leftJoinAndSelect('article.tags', 'tag')
        }
        // 普通排序
        queryBy = queryBy.orderBy('article.updateTime', 'DESC')
        // .addOrderBy('article.create_time', 'DESC')
        if (order) {
            queryBy = queryBy.orderBy('article.createTime', order || 'DESC')
        }
        if (otherParams) {
            Object.keys(otherParams).forEach((key) => {
                queryBy
                    .andWhere(`article.${key} LIKE :${key}`)
                    .setParameter(`${key}`, `%${otherParams[key]}%`);
            });
        }

        // 分页
        queryBy = queryBy
            .skip(pageSize * (current - 1))
            .take(pageSize)
        // 获取结果及(非分页的)查询结果总数
        // 或使用 .getMany() 不会返回总数
        if (data.category || data.tag) {
            return await queryBy.getManyAndCount()
        }
        /**
         * 合并第三方新闻接口与博客接口一同返回
         * 对接第三方sdk api
         */
        let newsList = []
        /**
         *  {
            "ctime": "2020-07-31 17:45:07",
            "title": "特朗普改口不推迟大选：他干的这些事，历史上其他总统也干了",
            "description": "2020年美国迎来四年一次的总统选举，在新冠疫情与“黑人之死”事件的影响下，白宫会否迎来新主人？",
            "picUrl": "http://p26-tt.byteimg.com/img/web-union/678f56ef-3d4e-47cb-9eb7-724769ce9ebd~tplv-tt-cs0:1125:555.jpg",
            "url": "http://toutiao.com/group/6854697468815281672/",
            "source": "热榜内容"
            }
         */
        let listRes = { result: null, newslist: [], code: 200 }
        listRes = await tianApi.getNewsList({ word: data.title })
        if (listRes.code === 200) {
            newsList = listRes.newslist
            newsList.map(el => {
                 el.content = el.description
                 el.createTime = el.ctime
                 el.comment = []
                 el.img = el.picUrl
                 el.status = 1001
                 el.category = {
                    createTime: el.ctime,
                    id: el.uniquekey,
                    label: null,
                    parentId: null,
                    status: 1001,
                    updateTime: el.ctime,
                    value: el.category
                }
            })
        }
        let res = await queryBy.getManyAndCount()
        if (current > 1) {
            return Promise.resolve(res)
        }
        res[0] = [...newsList, ...res[0]]
        // console.log(res[0], 'newsRes')
        // return await queryBy.getManyAndCount()
        return Promise.resolve(res)
    }
    /**
     * 获取新闻关键词
     */
    async getKeyWord () {
        let keyWordRes = await tianApi.hotKeyWord()
        if (keyWordRes && keyWordRes.code === 200) {
            keyWordRes.newslist = keyWordRes.newslist.map(el => el.keyword)
            return Promise.resolve([...keyWordRes.newslist])
        } else {
            throw new HttpException(keyWordRes.msg, responseStatus.failed.code);
        }
    }
    /**
     * 获取所以文章
     */
    async getAll(data) {
        let queryBy = this.articleRepository.createQueryBuilder('article')
        const { order } = data
        queryBy = queryBy.leftJoinAndSelect('article.comment', 'comment')
            // .andWhere('comment.status = :status', { status: 1001 })
            .orderBy('article.updateTime', 'ASC')
        if (order) {
            queryBy = queryBy
            .orderBy('article.createTime', order || 'DESC')
        }
        let newsList = []
        let listRes = await tianApi.getNewsList({})
        if (listRes.code === 200) {
            newsList = listRes.newslist
            newsList.map(el => {
                    el.content = el.description
                    el.createTime = el.ctime
                    el.comment = []
                    el.img = el.picUrl
                    el.status = 1001
                    el.category = {
                        createTime: el.ctime,
                        id: el.uniquekey,
                        label: null,
                        parentId: null,
                        status: 1001,
                        updateTime: el.ctime,
                        value: el.category
                    }
            })
        }
        // 获取结果及(非分页的)查询结果总数
        // 或使用 .getMany() 不会返回总数
        newsList = newsList.slice(0,2)
        let res = await queryBy.getManyAndCount()
        res[0] = res[0].slice(0, 2)
        res[0] = newsList.concat(res[0])
        // console.log(res, 'keyWordRes')
        return Promise.resolve(res)
        // return await queryBy.getManyAndCount()
    }
    /**
     * 创建文章 create(data: Partial<Article>): Promise<Article>
     * @param data
     */
    async create(data): Promise<any> {
        // article.id = this.articles.length + 1
        // this.articles.push(article)
        // return Promise.resolve('操作成功');
        const { title } = data;
        const exist = await this.articleRepository.findOne({ where: { title } });

        if (exist) {
            throw new HttpException('文章标题已存在', responseStatus.failed.code);
        }
        let { tags = [], categoryId = null } = data
        if (data.status === '1001') {
            Object.assign(data, {
                updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            });
        }
        tags = await this.tagService.findByIds(('' + tags).split(','))
        if (categoryId) {
            let categoryIds = categoryId.split(',');
            let lastId = categoryIds[categoryIds.length - 1];
            categoryId = await this.categoryService.getById(lastId);
        }
        const newArticle = await this.articleRepository.create({
            ...data,
            category: categoryId,
            tags
        });
        return await this.articleRepository.save(newArticle);
    }
    /**
     *  更新指定文章
     * @param data
     */
    async edit(data): Promise<Article> {
        const oldArticle = await this.articleRepository.findOne({ id: data.id });
        if (!oldArticle) {
            throw new HttpException('查询文章不存在！', responseStatus.failed.code);
        }
        let { tags, categoryId } = data;

        if (tags) {
            tags = await this.tagService.findByIds(('' + tags).split(','));
        }
        if (categoryId && categoryId !== null) {
            let categoryIds = categoryId.split(',');
            let lastId = categoryIds[categoryIds.length - 1];
            categoryId = await this.categoryService.getById(lastId);
        }
        const newArticle = {
            ...data,
            updateTime:
                oldArticle.status === '1001' && status === '1002'
                    ? dayjs().format('YYYY-MM-DD HH:mm:ss')
                    : oldArticle.updateTime,
        };

        if (tags) {
            Object.assign(newArticle, { tags });
        } else {
            Object.assign(newArticle, { tags: [] });
        }
        if (categoryId) {
            Object.assign(newArticle, { category: categoryId });
        } else {
            Object.assign(newArticle, { category: null });
        }
        const { id, ...otherParams } = newArticle
        // const updatedArticle = await this.articleRepository.merge(
        //     oldArticle,
        //     newArticle
        // );
        const updatedArticle = { ...oldArticle, ...otherParams }
        return this.articleRepository.save(updatedArticle);
    }
    /**
     * 根据id删除文章
     * @param id 
     */
    async delete(id) {
        // console.log(id, 'iddddddd')
        const res = await this.articleRepository.findOne({ id: +id })
        if (res) {
            await this.articleRepository.save({ ...res, isDelete: true })
            return responseStatus.success.message
        }
        else throw new HttpException(`暂无数据`, 404);
    }
    /**
     * 根据id获取文章
     * @param id 文章id
     */
    async getById(id: number) {
        // const article = this.articles.find(article => article.id === id)
        // return Promise.resolve(article);
        const res = await this.articleRepository.findOne({ id }, { relations: ['comment'] })
        if (!res) throw new HttpException(`暂无数据`, 404);

        // 新增访客量
        const updatedArticle = { ...res, visitor: (+res.visitor) + 1 }
        await this.articleRepository.save(updatedArticle);

        let queryBy = this.articleRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.tags', 'tag')
            .leftJoinAndSelect("article.comment", "comment")
            .leftJoinAndSelect('article.category', 'category')
            .orderBy('comment.create_time', 'DESC')
        // queryBy.leftJoinAndSelect('article.category', 'category')
        //     .orderBy('category.create_time', 'DESC')
        queryBy = queryBy.andWhere(`article.id=${id}`)
        // console.log(await queryBy.getOne(), 'queryBy.getOne()')
        let data = await queryBy.getOne()
        data.comment = filterTreeData(data.comment, null)
        let resData = { ...data, categoryId: '' }
        let categoryId = []
        if (data.category !== null) {
            categoryId.push(data.category.id)
            if (data.category.parentId !== null) {
                categoryId.unshift(data.category.parentId)
                let category = await this.categoryService.getById(data.category.parentId);
                if (category.parentId !== null) {
                    categoryId.unshift(category.parentId)
                }
            }
            resData.categoryId = categoryId.join(',')
        }
        return Promise.resolve(resData)
    }
    // 设置文章状态
    async setStatus({ id, status }) {
        if (!id || !status) {
            throw new HttpException("参数为空", responseStatus.failed.code);
        }
        let existUser = await this.articleRepository.findOne({ id })
        if (!existUser) {
            throw new HttpException("文章不存在！", responseStatus.failed.code);
        }
        const updatedArticle = { ...existUser, status }
        await this.articleRepository.save(updatedArticle)
        return responseStatus.success.message
    }
}
