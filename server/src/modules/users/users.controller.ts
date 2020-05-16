import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { Users } from '../../entities/users.entity';
import { AuthGuard } from '@nestjs/passport';
export class QueryDt {
    @ApiProperty({
        description: '用户名',
        required: false
    })
    username: string;

    @ApiProperty({
        description: '状态',
        required: false
    })
    status: string;

    @ApiProperty({
        description: '注册时间',
        type: 'datetime',
        required: false
    })
    createTime: Date;

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

export class UserForm {
    @ApiProperty({
        description: '头像',
        required: true
    })
    avatar: string;
    @ApiProperty({
        description: '用户名'

    })
    username: string;

    @ApiProperty({
        description: '邮箱',
        required: false

    })
    email: string;

    @ApiProperty({
        description: '密文'

    })
    cipher: string;

    @ApiProperty({
        description: '密码'
    })
    password: string
}

export class UserState {
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

@ApiTags('用户信息')
@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('/get')
    @ApiOperation({ summary: '获取用户列表' })
    getAllUsers(@Query() data: QueryDt) {
        return this.usersService.getAllUsers(data)
    }

    @Get('/get/ById')
    @ApiOperation({ summary: '获取用户' })
    @ApiQuery({ name: 'id', description: '用户id', required: true })
    getUser(@Query('id') id) {
        return this.usersService.getUser(+id)
    }

    @Post('/login')
    @ApiOperation({ summary: '用户登录' })
    login(@Body() user: UserForm) {
        return this.usersService.login(user)
    }
    @Post('/add')
    @ApiOperation({ summary: '创建用户' })
    @UseGuards(AuthGuard())
    public addUser(@Body() user: UserForm) {
        return this.usersService.addUser(user)
    }
    @Post('/edit')
    @ApiOperation({ summary: '编辑用户' })
    @UseGuards(AuthGuard())
    public editUser(@Body() user: UserForm) {
        return this.usersService.editUser(user)
    }
    @Post('/delete')
    @ApiOperation({ summary: '删除用户' })
    @ApiQuery({ name: 'id', description: '用户id', required: true })
    @UseGuards(AuthGuard())
    public delete(@Query('id') id: number) {
        return this.usersService.delete(id)
    }
    @Post('/status')
    @ApiOperation({ summary: '更改用户状态' })
    @ApiQuery({ name: 'id', description: '用户id', required: true })
    @UseGuards(AuthGuard())
    public status(@Body() userStatus: UserState) {
        return this.usersService.setStatus(userStatus)
    }
}