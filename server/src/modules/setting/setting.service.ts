import { Injectable, HttpException } from '@nestjs/common';
// import { HttpException } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from "../../entities/setting.entity";
import { parseUserAgent, responseStatus, getClientIP } from "../../utils";
import { UsersService } from '../users/users.service';
@Injectable()
export class SettingService {
    constructor(@InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly usersService: UsersService) { }
    async get(data) {
        // console.log(data.websiteId, 'websiteId')
        if (data.websiteId) {
            return await this.settingRepository.findOne(data.websiteId)
        } else {
            return await this.settingRepository.findOne(1)
        }
    }
    async getByPage (data) {
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
        const { current = 1, pageSize = 10, status, ...otherParams } = data;
        queryBy = queryBy
            .skip(pageSize * (current - 1))
            .take(pageSize)
        // 或使用 .getMany() 不会返回总数

        return await queryBy.getManyAndCount()
    }
    async add(data) {
        const { banner, notice, siteConfig, theme, activity } = data
        if (!banner || !notice) {
            throw new HttpException(`参数为空！`, 400);
        }
        let res = await this.settingRepository.save({ banner, notice, siteConfig, theme, activity });
        await this.usersService.setWebsiteId({ ...data.user, websiteId: res.id })
        return res
    }
    async edit(data) {
        const { id, banner, notice, siteConfig, theme, activity } = data
        if (id && banner && notice) {
            const res = await this.settingRepository.findOne({ id });
            const updatedcategory = await this.settingRepository.merge(
                res, { banner, notice, siteConfig, theme, activity }
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
    getIp (params) {
        let userAgent = params.headers['user-agent'];
        userAgent = parseUserAgent(userAgent)
        console.log({userAgent, ...getClientIP(params) }, 'clientIP')
        return Promise.resolve({
            ip: getClientIP(params),
            userAgent
        })
    }
}