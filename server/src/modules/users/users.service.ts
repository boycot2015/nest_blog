import { Injectable, HttpException } from '@nestjs/common';
// import { HttpException } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from "../../entities/users.entity";
import { aesDecrypt, responseStatus } from "../../utils";
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
        private readonly authService: AuthService) { }
    // private insertUserData = {
    //     id: '',
    //     avatar: '',
    //     username: '',
    //     cipher: '',
    //     password: '',
    //     email: '',
    //     visitors: true
    // }
    async getAllUsers(data) {
        // return Promise.resolve(this.users);
        data.current = data.current || 1
        data.pageSize = data.pageSize || 10
        console.log(data, 'asdada')
        // 1. 准备工作：注入Repository，创建queryBuilder
        // 条件筛选和分页查询代码
        let queryBy = this.usersRepository.createQueryBuilder()
        // 2. 条件筛选查询，如名称、类型等，传入对应字段即可
        // .where(data as Partial<Users>)
        const { current = 1, pageSize = 10, status, ...otherParams } = data;
        if (status) {
            queryBy.andWhere('users.status=:status').setParameter('status', status);
        }

        if (otherParams) {
            Object.keys(otherParams).forEach(key => {
                queryBy
                    .andWhere(`users.${key} LIKE :${key}`)
                    .setParameter(`${key}`, `%${otherParams[key]}%`);
            });
        }
        // 3. 时间范围筛选
        if (data && data['update_time.start'] && data['update_time.end']) {
            queryBy = queryBy.andWhere('update_time BETWEEN :start AND :end', {
                start: data['update_time.start'],
                end: data['update_time.end']
            })
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

        /* 其中限制获取的条数，用 take 和 limit 都可以，官方给出的文档说明
        take: 
            * Sets maximal number of entities to take.
        limit:     
            * Set's LIMIT - maximum number of rows to be selected.
            * NOTE that it may not work as you expect if you are using joins.
            * If you want to implement pagination, and you are having join in your query,
            * then use instead take method instead.
        因此限制返回条数的话，首先考虑使用take，limit 是 take 的功能子集
        */
        // 5. 获取结果及(非分页的)查询结果总数
        // 或使用 .getMany() 不会返回总数

        return await queryBy.getManyAndCount()
    }
    async login(data) {
        let { password } = data
        // password = decryptByDES(password);
        password = aesDecrypt(password, data.cipher)
        const loginUser = await this.usersRepository.findOne({ 'username': data.username, 'password': password })
        if (!loginUser) throw new HttpException("用户名或密码错误,请重新输入！", responseStatus.failed.code);
        const { status } = loginUser
        if (loginUser && (status + '' === '1001')) return this.authService.signIn(loginUser)
        else if ((status + '' === '1002')) throw new HttpException("该账户已被冻结，请联系管理员！", responseStatus.failed.code);
    }
    async getUser(id: number): Promise<Users> {
        // console.log(id, 'userid')
        // const user = this.users.find((user) => user.id === id);
        if (!id) {
            throw new HttpException("用户名不存在！", 404);
        }
        // return Promise.resolve(user);
        const query = await this.usersRepository.findOne(id)
        if (query) return query
        else throw new HttpException("用户名不存在！", 404);
    }
    async addUser(user) {
        // user.id = this.users.length + 1
        // this.users.push(user);
        // return Promise.resolve('操作成功！');
        if (!user) {
            throw new HttpException("参数为空", responseStatus.failed.code);
        }
        const hasUser = await this.usersRepository.findOne({ 'username': user.username })
        // console.log(hasUser)
        if (hasUser) {
            throw new HttpException("用户名已存在,请重新输入！", responseStatus.failed.code);
        } else {
            let insertUserData = {
                avatar: '',
                username: '',
                cipher: '123456',
                password: '',
                email: '',
                visitors: true
            }
            insertUserData.password = aesDecrypt(user.password, insertUserData.cipher)
            const isRightPwd = await this.usersRepository.findOne({ 'username': user.username, 'password': user.password })
            !isRightPwd && new HttpException("用户名或密码错误,请重新输入！", responseStatus.failed.code)
            insertUserData.avatar = user.avatar
            insertUserData.cipher = user.password
            insertUserData.username = user.username
            insertUserData.email = user.email
            await this.usersRepository.save(insertUserData)
            return responseStatus.success.message
        }
    }
    async editUser(user) {
        if (!user) {
            throw new HttpException("参数为空", responseStatus.failed.code);
        }
        let existUser = await this.usersRepository.findOne({ id: user.id })
        // console.log(hasUser)
        if (!existUser) {
            throw new HttpException("用户名不存在！", responseStatus.failed.code);
        } else {
            let insertUserData = {
                avatar: '',
                username: '',
                cipher: '123456',
                password: '',
                email: '',
                status: {}
            }
            insertUserData.password = aesDecrypt(user.password, insertUserData.cipher)
            insertUserData.avatar = user.avatar
            insertUserData.username = user.username
            insertUserData.cipher = user.password
            insertUserData.email = user.email
            insertUserData.status = user.status
            const updatedUser = { ...existUser, ...insertUserData }
            await this.usersRepository.save(updatedUser)
            return responseStatus.success.message
        }
    }
    async delete(id) {
        // user.id = this.users.length + 1
        // this.users.push(user);
        // return Promise.resolve('操作成功！');
        if (!id) {
            throw new HttpException("参数为空", responseStatus.failed.code);
        }
        const hasUser = await this.usersRepository.findOne({ id })
        // console.log(hasUser)
        if (!hasUser) {
            throw new HttpException("用户不存在！", responseStatus.failed.code);
        } else {
            await this.usersRepository.remove(hasUser)
            return responseStatus.success.message
        }
    }
    async setStatus({ id, status }) {
        if (!id || !status) {
            throw new HttpException("参数为空", responseStatus.failed.code);
        }
        let existUser = await this.usersRepository.findOne({ id })
        // console.log(hasUser)
        if (!existUser) {
            throw new HttpException("用户不存在！", responseStatus.failed.code);
        }
        const updatedUser = { ...existUser, status }
        await this.usersRepository.save(updatedUser)
        return responseStatus.success.message
    }
}