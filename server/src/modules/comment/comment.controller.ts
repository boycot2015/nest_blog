import { Controller, Get, Post, Body, Request, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiTags, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { getClientIP, parseUserAgent } from '../../utils';

export class QueryDt {
    @ApiProperty({
        description: '用户名',
        required: false
    })
    name: string;

    @ApiProperty({
        description: '评论内容',
        required: false
    })
    content: string;

    @ApiProperty({
        description: '邮箱',
        required: false

    })
    email: string;

    @ApiProperty({
        description: '状态',
        required: false
    })
    status: string;

    @ApiProperty({
        description: '当前页数',
        type: 'text',
        required: false
    })
    currentPage: number;

    @ApiProperty({
        description: '当前页码数',
        type: 'text',
        required: false
    })
    pageSize: number;
}

export class CommentForm {
    @ApiProperty({
        description: '用户名',
        required: true
    })
    name: string;

    @ApiProperty({
        description: '评论内容'

    })
    content: string;

    @ApiProperty({
        description: '邮箱',
        required: false

    })
    email: string;
    @ApiProperty({
        description: '文章id',
        required: true

    })
    articleId: string;
}

export class CommentState {
    @ApiProperty({
        description: '评论id',
        required: true
    })
    id: number;

    @ApiProperty({
        description: '状态',
        required: false
    })
    status: string;
}

export class CommentBatchState {
    @ApiProperty({
        description: '评论ids',
        required: true
    })
    ids: string;

    @ApiProperty({
        description: '状态',
        required: false
    })
    status: string;
}

@ApiTags('评论信息')
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Get('/get')
    // @UseGuards(AuthGuard())
    @ApiOperation({ summary: '获取评论列表' })
    getAllComment(@Query() data: QueryDt) {
        return this.commentService.getAllComment(data)
    }

    @Get('/get/ById')
    @ApiOperation({ summary: '获取评论' })
    @ApiQuery({ name: 'id', description: '评论id', required: true })
    getComment(@Query('id') id) {
        return this.commentService.getComment(+id)
    }
    @Post('/add')
    @ApiOperation({ summary: '新增评论' })
    // @UseGuards(AuthGuard())
    public addComment(@Request() req, @Body() Comment: CommentForm) {
        let userAgent = req.headers['user-agent'];
        userAgent = parseUserAgent(userAgent)
        return this.commentService.addComment({ ...Comment, ip: getClientIP(req), userAgent })
    }

    @Post('/delete')
    @ApiOperation({ summary: '删除评论' })
    @ApiQuery({ name: 'id', description: '评论id', required: true })
    @UseGuards(AuthGuard())
    public delete(@Query('id') id: number) {
        return this.commentService.delete(id)
    }

    @Post('/delete/batch')
    @ApiOperation({ summary: '批量删除评论' })
    // @ApiQuery({ name: 'ids', description: '评论ids', required: true })
    @UseGuards(AuthGuard())
    public batchDelete(@Body() data) {
        return this.commentService.batchDelete(data)
    }

    @Post('/status')
    @ApiOperation({ summary: '更改评论状态' })
    @ApiQuery({ name: 'id', description: '评论id', required: true })
    @UseGuards(AuthGuard())
    public status(@Body() commentStatus: CommentState) {
        return this.commentService.setStatus(commentStatus)
    }

    @Post('/status/batch')
    @ApiOperation({ summary: '批量更改评论状态' })
    @UseGuards(AuthGuard())
    public batchStatus(@Body() commentStatus: CommentBatchState) {
        return this.commentService.batchStatus(commentStatus)
    }
}