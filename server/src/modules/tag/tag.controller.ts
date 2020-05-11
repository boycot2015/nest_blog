import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { TagService } from "./tag.service";
import { ApiTags, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Tag } from '../../entities/tag.entity';

class TagForm {
    @ApiProperty({
        description: '标签名称',
        required: true
    })
    label: string;
    @ApiProperty({
        description: '标签值',
        required: true
    })
    value: string;
    @ApiProperty({
        description: '标签状态',
        default: 1001,
        required: false
    })
    status: number; // 标签状态

    @ApiProperty({
        description: '访客可见',
        default: false,
        required: false
    })
    visitors: boolean;
}
// class QueryForm {
//     @ApiProperty({
//         description: '标签名称',
//         required: false
//     })
//     label: number;
//     @ApiProperty({
//         description: '标签状态',
//         required: false
//     })
//     status: number; // 标签状态
// }


@Controller('tag')
@ApiTags('标签列表')
export class TagController {
    constructor(private tagService: TagService) { }
    @Get('/get')
    @ApiOperation({ summary: '获取标签列表', description: "获取标签列表" })
    // @UseGuards(AuthGuard())
    getTagList(@Query() data) {
        return this.tagService.get(data)
    }

    @Get('/getById')
    @ApiOperation({ summary: '获取标签详情', description: "获取标签详情" })
    @ApiQuery({ name: 'id', example: 1, description: '标签id' })
    getTagById(@Query('id') id): Promise<Tag> {
        return this.tagService.getById(+id)
    }

    @Post('/add')
    @ApiOperation({ summary: '新增标签', description: "新增标签" })
    addTag(@Body() data: TagForm) {
        return this.tagService.create(data)
    }

    @Post('/edit')
    @ApiOperation({ summary: '编辑标签', description: "编辑标签" })
    editTag(@Body() data: TagForm) {
        return this.tagService.edit(data)
    }

    @Post('/delete')
    @ApiOperation({ summary: '删除标签', description: "删除标签" })
    @ApiQuery({ name: 'id', type: 'number' })
    deleteTag(@Query() data) {
        return this.tagService.delete(data.id)
    }
}
