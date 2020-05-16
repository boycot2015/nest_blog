import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    HttpException,
    UploadedFiles
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from "../../entities/file.entity";
import { responseStatus } from "../../utils";
import { createWriteStream } from 'fs';
import { join } from 'path';

export class FileService {
    constructor(@InjectRepository(File)
    private readonly fileRepository: Repository<File>) { }
    async create(data) {
        const res = await this.fileRepository.findOne({ fileName: data.fileName });
        if (!res) {
            await this.fileRepository.save(data);
            return responseStatus.success.message
        }
        else throw new HttpException(`文件已存在，请重新上传！`, 400);
    }
    async get(data) {
        data.current = data.current || 1
        data.pageSize = data.pageSize || 10
        const { current = 1, pageSize = 12, status, ...otherParams } = data;
        let query = this.fileRepository.createQueryBuilder('file')
        query.orderBy('update_time', 'DESC')
        query.skip(pageSize * (current - 1))
            .take(pageSize)
        const res = await query.getManyAndCount();
        if (!res) {
            throw new HttpException(`文件不存在！`, 400);
        }
        return res
    }
    async getById(id: number) {
        if (id) {
            const res = await this.fileRepository.findOne({ id });
            if (!res) {
                throw new HttpException(`文件不存在！`, 400);
            }
            return res
        }
        throw new HttpException(`文件不存在！`, 400);
    }
    async delete(id: number) {
        if (id) {
            const res = await this.fileRepository.findOne({ id });
            if (!res) {
                throw new HttpException(`文件不存在！`, 400);
            }
            await this.fileRepository.remove(res)
            return responseStatus.success.message
        }
        throw new HttpException(`参数为空~`, 400);
    }
}