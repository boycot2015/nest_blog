import { Injectable, HttpException } from '@nestjs/common';
// import { HttpException } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from "../../entities/comment.entity";
import { aesDecrypt, responseStatus } from "../../utils";
import { ArticleService } from '../article/article.service';
@Injectable()
export class CommentService {
    constructor(@InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
        private readonly articleService: ArticleService) { }
    // private insertCommentData = {
    //     id: '',
    //     avatar: '',
    //     Commentname: '',
    //     cipher: '',
    //     email: '',
    //     email: '',
    //     administrator: true
    // }
    async getAllComment(data) {
        // return Promise.resolve(this.Comment);
        data.current = data.current || 1
        data.pageSize = data.pageSize || 10
        console.log(data, 'asdada')
        // 1. 准备工作：注入Repository，创建queryBuilder
        // 条件筛选和分页查询代码
        let queryBy = this.commentRepository.createQueryBuilder('comment')
        // queryBy.leftJoinAndSelect('comment.article', 'comment')
        // 2. 条件筛选查询，如名称、类型等，传入对应字段即可
        // .where(data as Partial<Comment>)
        const { current = 1, pageSize = 10, status, ...otherParams } = data;
        if (status) {
            queryBy.andWhere('comment.status=:status').setParameter('status', status);
        }

        if (otherParams) {
            Object.keys(otherParams).forEach(key => {
                queryBy
                    .andWhere(`comment.${key} LIKE :${key}`)
                    .setParameter(`${key}`, `%${otherParams[key]}%`);
            });
        }

        // 普通排序
        queryBy = queryBy.orderBy('update_time', 'DESC')

        // 自定义条件，且多重排序
        // 例如：update_time字段为 ${data.start} 的优先显示,然后再在此基础上再进行时间和状态的排序
        queryBy = queryBy
            // .orderBy(`case update_time when update_time="${data['order_by_update']}" then 1 else 0 end`)
            .addOrderBy('status', 'ASC')
            .addOrderBy('create_time', 'DESC')
        queryBy = queryBy
            .skip(pageSize * (current - 1))
            .take(pageSize)
        // 5. 获取结果及(非分页的)查询结果总数
        // 或使用 .getMany() 不会返回总数

        return await queryBy.getManyAndCount()
    }
    async getComment(id: number): Promise<Comment> {
        // console.log(id, 'Commentid')
        // const Comment = this.Comment.find((Comment) => Comment.id === id);
        if (!id) {
            throw new HttpException("评论不存在！", 404);
        }
        // return Promise.resolve(Comment);
        const query = await this.commentRepository.findOne(id)
        if (query) return query
        else throw new HttpException("评论不存在！", 404);
    }
    async addComment(comment) {
        let colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
            'green', 'cyan', 'blue', 'geekblue', 'blue', 'purple'];
        if (!comment) {
            throw new HttpException("参数为空", responseStatus.failed.code);
        }
        const hasComment = await this.commentRepository.findOne({ 'name': comment.name, 'content': comment.content })
        if (hasComment) {
            throw new HttpException("评论已存在,请重新输入！", responseStatus.failed.code);
        } else {
            let insertCommentData = {
                avatar: colors[Math.floor(Math.random() * (colors.length - 1))],
                ...comment
            }
            const article = await this.articleService.getById(comment.articleId)
            const newcCommentData = await this.commentRepository.create({
                ...insertCommentData,
                article
            });
            console.log(newcCommentData, 'insertCommentData')
            await this.commentRepository.save(newcCommentData)
            return responseStatus.success.message
        }
    }
    async delete(id) {
        // Comment.id = this.Comment.length + 1
        // this.Comment.push(Comment);
        // return Promise.resolve('操作成功！');
        if (!id) {
            throw new HttpException("参数为空", responseStatus.failed.code);
        }
        const hasComment = await this.commentRepository.findOne({ id })
        // console.log(hasComment)
        if (!hasComment) {
            throw new HttpException("评论不存在！", responseStatus.failed.code);
        } else {
            await this.commentRepository.remove(hasComment)
            return responseStatus.success.message
        }
    }
    async setStatus({ id, status }) {
        if (!id || !status) {
            throw new HttpException("参数为空", responseStatus.failed.code);
        }
        let existComment = await this.commentRepository.findOne({ id })
        // console.log(hasComment)
        if (!existComment) {
            throw new HttpException("评论不存在！", responseStatus.failed.code);
        }
        const updatedComment = { ...existComment, status }
        await this.commentRepository.save(updatedComment)
        return responseStatus.success.message
    }
}