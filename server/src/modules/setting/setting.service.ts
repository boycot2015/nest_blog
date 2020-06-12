import { Injectable, HttpException } from '@nestjs/common';
// import { HttpException } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from "../../entities/setting.entity";
import { aesDecrypt, responseStatus } from "../../utils";
import { AuthService } from '../auth/auth.service';
@Injectable()
export class SettingService {
    constructor(@InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>) { }
    async get(data) {
        // data.currentPage = data.currentPage || 1
        // data.pageSize = data.pageSize || 10
        // 1. 准备工作：注入Repository，创建queryBuilder
        // 条件筛选和分页查询代码
        let queryBy = this.settingRepository.createQueryBuilder()
        // 2. 条件筛选查询，如名称、类型等，传入对应字段即可
        queryBy = queryBy.where(data as Partial<Setting>)

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
    async add(data) {
        const { banner, notice, siteConfig, theme } = data
        if (!banner || !notice) {
            throw new HttpException(`参数为空！`, 400);
        }
        await this.settingRepository.save({ banner, notice, siteConfig, theme });
        return responseStatus.success.message
    }
    async edit(data) {
        const { id, banner, notice, siteConfig, theme } = data
        if (id && banner && notice) {
            const res = await this.settingRepository.findOne({ id });
            const updatedcategory = await this.settingRepository.merge(
                res, { banner, notice, siteConfig, theme }
            );
            if (res) {
                await this.settingRepository.save(updatedcategory);
                return responseStatus.success.message
            }
        }
        throw new HttpException(`参数为空！`, 400);
    }
    async delete(id: number) {
        const res = await this.settingRepository.findOne({ id })
        if (res) {
            await this.settingRepository.remove(res)
            return responseStatus.success.message
        }
        throw new HttpException(`参数为空！`, 400);
    }
}