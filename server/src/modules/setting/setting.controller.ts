import { Controller, Get, Post, Body, Query, Request, UseGuards, RequestMapping } from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiTags, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.decorator';
export class QueryDt {
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

    @ApiProperty({
        description: '按创建时间排序',
        type: 'text',
        required: false
    })
    order_by_update: string
}
class SettingVo {
    @ApiProperty({
        description: '轮播图',
        required: false
    })
    banner: string

    @ApiProperty({
        description: '主题颜色',
        required: false
    })
    theme: object

    @ApiProperty({
        description: '网站配置',
        required: false
    })
    siteConfig: object

    @ApiProperty({
        description: '通知公告',
        required: false
    })
    notice: string
    // @ApiProperty({
    //     description: '设置id',
    //     required: true
    // })
    // id: string
}
@ApiTags('网站基本信息配置')
@Controller('setting')
export class SettingController {
    constructor(private settingService: SettingService) { }
    @Get('/get')
    // @UseGuards(AuthGuard())
    @ApiOperation({ summary: '获取设置信息' })
    get(@Query() data: QueryDt) {
        return this.settingService.get({ ...data })
    }
    @Get('/get/page')
    // @UseGuards(AuthGuard())
    @ApiOperation({ summary: '获取设置信息' })
    getByPage(@Query() data: QueryDt) {
        return this.settingService.getByPage({ ...data })
    }
    @Post('/add')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '新增设置信息' })
    add(@User() user, @Body() data: SettingVo) {
        return this.settingService.add({ ...data, user })
    }
    @Post('/edit')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '编辑设置信息' })
    edit(@User() user, @Body() data: SettingVo ) {
        // console.log(user, data, 'user')
        return this.settingService.edit({ ...data, user })
    }
    @Post('/delete')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '删除设置信息' })
    delete(@Query() id: number) {
        return this.settingService.delete(id)
    }
    // @Post('/getIp')
    // @RequestMapping({path: '/getIp', method: 5})
    @Get('/getIp')
    // @UseGuards(AuthGuard())
    @ApiOperation({ summary: '获取用户ip信息' })
    getIp(@Request() req, @Query() data) {
        return this.settingService.getIp({ ...data, ...req })
    }
}