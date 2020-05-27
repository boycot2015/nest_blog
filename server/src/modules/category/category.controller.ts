import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from "./category.service";
import { ApiTags, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Category } from '../../entities/category.entity';

class TagForm {
    @ApiProperty({
        description: '分类名称',
        required: true
    })
    label: string;
    @ApiProperty({
        description: '分类值',
        required: true
    })
    value: string;
    @ApiProperty({
        description: '分类状态',
        default: 1001,
        required: false
    })
    status: number; // 分类状态

    @ApiProperty({
        description: '访客可见',
        default: false,
        required: false
    })
    administrator: boolean;
}
// class QueryForm {
//     @ApiProperty({
//         description: '分类名称',
//         required: false
//     })
//     label: number;
//     @ApiProperty({
//         description: '分类状态',
//         required: false
//     })
//     status: number; // 分类状态
// }


@Controller('category')
@ApiTags('分类列表')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }
    @Get('/get')
    @ApiOperation({ summary: '获取分类列表', description: "获取分类列表" })
    get(@Query() data) {
        return this.categoryService.get(data)
    }

    @Get('/getById')
    @ApiOperation({ summary: '获取分类详情', description: "获取分类详情" })
    @ApiQuery({ name: 'id', example: 1, description: '分类id' })
    getById(@Query('id') id): Promise<Category> {
        return this.categoryService.getById(+id)
    }

    @Post('/add')
    @ApiOperation({ summary: '新增分类', description: "新增分类" })
    @UseGuards(AuthGuard())
    addTag(@Body() data: TagForm) {
        return this.categoryService.create(data)
    }

    @Post('/edit')
    @ApiOperation({ summary: '编辑分类', description: "编辑分类" })
    @UseGuards(AuthGuard())
    editTag(@Body() data: TagForm) {
        return this.categoryService.edit(data)
    }

    @Post('/delete')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '删除分类', description: "删除分类" })
    @ApiQuery({ name: 'id', type: 'number' })
    deleteTag(@Query() data) {
        return this.categoryService.delete(data.id)
    }
}
