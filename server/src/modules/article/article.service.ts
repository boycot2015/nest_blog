import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from "../../entities/article.entity";
import { responseStatus, filterTreeData } from "../../utils";
import * as dayjs from 'dayjs';
import { TagService } from '../tag/tag.service';
import { AuthService } from '../auth/auth.service';
import { CategoryService } from '../category/category.service';

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
            .leftJoinAndSelect('article.tags', 'tag')
            .leftJoinAndSelect('article.category', 'category')
            .andWhere('article.isDelete=:delete').setParameter('delete', false)
        // .leftJoinAndSelect('article.comment', 'comment')

        // 2. 条件筛选查询，如名称、类型等，传入对应字段即可
        // queryBy = queryBy.where(data as Partial<Article>)
        const { current = 1, pageSize = 12, status, ...otherParams } = data;
        if (status) {
            queryBy.andWhere('article.status=:status').setParameter('status', status);
        }

        if (otherParams) {
            Object.keys(otherParams).forEach((key) => {
                queryBy
                    .andWhere(`article.${key} LIKE :${key}`)
                    .setParameter(`${key}`, `%${otherParams[key]}%`);
            });
        }

        // 普通排序
        queryBy = queryBy
            .orderBy('article.updateTime', 'DESC')
        //     .addOrderBy('article.create_time', 'DESC')
        // 分页
        queryBy = queryBy
            .skip(pageSize * (current - 1))
            .take(pageSize)
        // 获取结果及(非分页的)查询结果总数
        // 或使用 .getMany() 不会返回总数

        return await queryBy.getManyAndCount()
    }
    /**
     * 获取所以文章
     */
    async getAll() {
        let queryBy = this.articleRepository.createQueryBuilder('article')
        queryBy = queryBy.leftJoinAndSelect('article.comment', 'comment')
            .orderBy('article.updateTime', 'ASC')
        // 获取结果及(非分页的)查询结果总数
        // 或使用 .getMany() 不会返回总数
        return await queryBy.getManyAndCount()
    }
    /**
     * 创建文章
     * @param data
     */
    async create(data: Partial<Article>): Promise<Article> {
        // article.id = this.articles.length + 1
        // this.articles.push(article)
        // return Promise.resolve('操作成功');
        const { title } = data;
        const exist = await this.articleRepository.findOne({ where: { title } });

        if (exist) {
            throw new HttpException('文章标题已存在', responseStatus.failed.code);
        }
        let { tags, category } = data
        if (data.status === '1001') {
            Object.assign(data, {
                updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            });
        }
        tags = await this.tagService.findByIds(('' + tags).split(','))
        category = await this.categoryService.getById(category.id)
        const newArticle = await this.articleRepository.create({
            ...data,
            category,
            tags
        });
        return await this.articleRepository.save(newArticle);
    }
    /**
     *  更新指定文章
     * @param data 
     */
    async edit(data: Partial<Article>): Promise<Article> {
        const oldArticle = await this.articleRepository.findOne({ id: data.id });
        if (!oldArticle) {
            throw new HttpException('查询文章不存在！', responseStatus.failed.code);
        }
        let { tags, category } = data;

        if (tags) {
            tags = await this.tagService.findByIds(('' + tags).split(','));
        }
        if (category) {
            category = await this.categoryService.getById(category.id);
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
        if (category) {
            Object.assign(newArticle, { category });
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
        console.log(id, 'iddddddd')
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
        return Promise.resolve(data)
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
