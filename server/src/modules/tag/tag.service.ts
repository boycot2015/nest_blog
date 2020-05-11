import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from "../../entities/tag.entity";
import { responseStatus } from "../../utils";
@Injectable()
export class TagService {
    constructor(@InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>) { }
    async get(data) {
        data.currentPage = data.currentPage || 1
        data.pageSize = data.pageSize || 10
        console.log(data, 'asdada')
        // 1. 准备工作：注入Repository，创建queryBuilder
        // 条件筛选和分页查询代码
        let queryBy = this.tagRepository.createQueryBuilder()
        // 2. 条件筛选查询，如名称、类型等，传入对应字段即可
        queryBy = queryBy.where(data as Partial<Tag>)

        // 3. 时间范围筛选
        if (data && data['update_time.start'] && data['update_time.end']) {
            queryBy = queryBy.andWhere('update_time BETWEEN :start AND :end', {
                start: data['update_time.start'],
                end: data['update_time.end']
            })
        }
        // 普通排序
        queryBy = queryBy.orderBy('update_time', 'DESC')
        // 5. 获取结果及(非分页的)查询结果总数
        // 或使用 .getMany() 不会返回总数

        return await queryBy.getManyAndCount()
        // return await this.articleRepository.query(data);
    }
    async create(data) {
        // article.id = this.articles.length + 1
        // this.articles.push(article)
        // return Promise.resolve('操作成功');
        const res = await this.tagRepository.findOne({ value: data.value });
        if (!res) {
            await this.tagRepository.save(data);
            return responseStatus.success.message
        }
        else throw new HttpException(`标签已存在，请重新输入！`, 400);
    }
    async edit(data) {
        // article.id = this.articles.length + 1
        // this.articles.push(article)
        // return Promise.resolve('操作成功');
        const res = await this.tagRepository.findOne({ id: data.id });
        const value = await this.tagRepository.findOne({ value: data.value });
        if (value) throw new HttpException(`标签已存在，请重新输入！`, 400);
        const updatedTag = await this.tagRepository.merge(
            res,
            {
                value: data.value
            }
        );
        if (res) {
            await this.tagRepository.save(updatedTag);
            return responseStatus.success.message
        }
        throw new HttpException(`标签不存在！`, 404);
    }
    async delete(id: number) {
        // const article = this.articles.find(_ => _.id === id)
        // if (!article) throw new HttpException("article not found", 404);
        // this.articles = this.articles.filter(_ => _.id !== id)
        // return Promise.resolve('操作成功');

        const res = await this.tagRepository.findOne({ id })
        if (res) {
            await this.tagRepository.remove(res)
            return responseStatus.success.message
        } else throw new HttpException(`标签不存在！`, 404);
    }
    async getById(id: number): Promise<Tag> {
        // const article = this.articles.find(article => article.id === id)
        if (!id) throw new HttpException(`标签不存在！`, 404);
        // return Promise.resolve(article);
        const res = await this.tagRepository.findOne({ id })
        if (res) return res
        else throw new HttpException(`标签不存在！`, 404);
    }
    /**
     * 获取指定标签信息，包含相关文章
     * @param id
     */
    async getArticleById(id, status = null): Promise<Tag> {
        const data = await this.tagRepository
            .createQueryBuilder('tag')
            .leftJoinAndSelect('tag.articles', 'articles')
            .orderBy('articles.updateAt', 'DESC')
            .where('tag.id=:id')
            .orWhere('tag.label=:id')
            .orWhere('tag.value=:id')
            .setParameter('id', id)
            .getOne();

        if (status) {
            data.articles = data.articles.filter((a) => a.status === status);
            return data;
        } else {
            return data;
        }
    }

    async findByIds(ids): Promise<Array<Tag>> {
        return this.tagRepository.findByIds(ids);
    }
}
