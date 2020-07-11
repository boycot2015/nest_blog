import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from "./article.service";
import { ApiTags, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { Article } from '../../entities/article.entity';
import { AuthGuard } from '@nestjs/passport';
import { Tag } from '../../entities/tag.entity';
import { Category } from '../../entities/category.entity';

class GetArticle {
    @ApiProperty({
        description: '文章标题',
        required: false
    })
    title: string;
    @ApiProperty({
        description: '文章概述',
        required: false
    })
    content: string;

    @ApiProperty({
        description: '状态',
        required: false
    })
    status: string;

    @ApiProperty({
        description: '标签',
        required: false
    })
    tags: Array<Tag>;

    @ApiProperty({
        description: '分类',
        required: false
    })
    category: Category;
}
class ArticleForm {
    @ApiProperty({
        description: '文章标题',
        required: false
    })
    title: string;
    @ApiProperty({
        description: '文章概述',
        required: false
    })
    content: string;

    @ApiProperty({
        description: '标签',
        required: false
    })
    tags: Array<Tag>;

    @ApiProperty({
        description: '分类',
        required: true
    })
    category: Category;

    @ApiProperty({
        description: '访客可见',
        default: false,
        required: false
    })
    administrator: boolean;
}

class EditArticleForm {
    @ApiProperty({
        description: '文章id',
        required: true
    })
    id: number;
    @ApiProperty({
        description: '文章标题',
        required: false
    })
    title: string;
    @ApiProperty({
        description: '文章概述',
        required: false
    })
    content: string;

    @ApiProperty({
        description: '文章分类',
        required: false
    })
    categoryId: string;

    @ApiProperty({
        description: '标签',
        required: false
    })
    tagIds: string;
    @ApiProperty({
        description: '状态',
        default: 1001,
        required: true
    })
    status: string;
    @ApiProperty({
        description: '访客可见',
        default: false,
        required: false
    })
    administrator: boolean;
}
export class ArticleState {
    @ApiProperty({
        description: '用户id',
        required: true
    })
    id: number;

    @ApiProperty({
        description: '状态',
        required: false
    })
    status: string;
}

@Controller('article')
@ApiTags('文章列表')
export class ArticleController {
    constructor(private articleService: ArticleService) { }
    @Get()
    // @UseGuards(AuthGuard())
    @ApiOperation({ summary: '获取文章列表', description: "获取文章列表" })
    get(@Query() data: GetArticle) {
        return this.articleService.get(data)
    }

    @Get('/getById')
    @ApiOperation({ summary: '获取文章详情', description: "获取文章详情" })
    @ApiQuery({ name: 'id', example: 1, description: '文章id', required: true })
    getById(@Query('id') id): Promise<Article> {
        return this.articleService.getById(+id)
    }

    @Post('/add')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '新增文章', description: "新增文章" })
    create(@Body() data: ArticleForm) {
        return this.articleService.create(data)
    }

    @Post('/edit')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '编辑文章', description: "编辑文章" })
    edit(@Body() data: EditArticleForm) {
        return this.articleService.edit(data)
    }

    @Post('/delete')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '删除文章', description: "删除文章" })
    @ApiQuery({ name: 'id', type: 'number', required: true })
    delete(@Query('id') id: number) {
        return this.articleService.delete(id)
    }
    @Post('/status')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '更改用户状态' })
    @ApiQuery({ name: 'id', description: '文章id', required: true })
    @UseGuards(AuthGuard())
    public status(@Body() userStatus: ArticleState) {
        return this.articleService.setStatus(userStatus)
    }
}
