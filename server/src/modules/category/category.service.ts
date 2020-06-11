import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from "../../entities/category.entity";
import { responseStatus } from "../../utils";
@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>) { }
    async get(data) {
        // data.currentPage = data.currentPage || 1
        // data.pageSize = data.pageSize || 10
        // 1. 准备工作：注入Repository，创建queryBuilder
        // 条件筛选和分页查询代码
        let queryBy = this.categoryRepository.createQueryBuilder()
        // 2. 条件筛选查询，如名称、类型等，传入对应字段即可
        queryBy = queryBy.where(data as Partial<Category>)

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
        !data.parentId && (data.parentId = null)
        const res = await this.categoryRepository.findOne({ parentId: data.parentId, value: data.value });
        if (!res) {
            let parent = await this.categoryRepository.findOne({ id: data.parentId })
            if (parent && parent.parentId !== null) {
                parent = await this.categoryRepository.findOne({ id: parent.parentId })
                if (parent && parent.parentId !== null) throw new HttpException(`最多可添加三级分类`, 400)
            }
            await this.categoryRepository.save(data);
            return responseStatus.success.message
        }
        else throw new HttpException(`分类已存在，请重新输入！`, 400);
    }
    async edit(data) {
        const res = await this.categoryRepository.findOne({ id: data.id });
        !data.parentId && (data.parentId = null)
        const value = await this.categoryRepository.findOne({ value: data.value, parentId: data.parentId });
        // if (value) throw new HttpException(`分类已存在，请重新输入！`, 400);
        const updatedcategory = await this.categoryRepository.merge(
            res,
            {
                value: data.value,
                parentId: data.parentId ? data.parentId : null
            }
        );
        if (res) {
            await this.categoryRepository.save(updatedcategory);
            return responseStatus.success.message
        }
        throw new HttpException(`分类不存在！`, 404);
    }
    async delete(id: number) {
        const res = await this.categoryRepository.findOne({ id })
        if (res) {
            await this.categoryRepository.remove(res)
            return responseStatus.success.message
        } else throw new HttpException(`分类不存在！`, 404);
    }
    async getById(id: number): Promise<Category> {
        if (!id) throw new HttpException(`分类不存在！`, 404);
        const res = await this.categoryRepository.findOne({ id })
        if (res) return res
        else throw new HttpException(`分类不存在！`, 404);
    }

    async findByIds(ids): Promise<Array<Category>> {
        return this.categoryRepository.findByIds(ids);
    }
}
