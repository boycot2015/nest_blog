import {
    Controller,
    Post,
    Body,
    Req,
    Query,
    Get,
    Param,
    UseInterceptors,
    HttpException,
    UploadedFile,
    UseGuards,
    UploadedFiles
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { responseStatus } from "../../utils";
import { createWriteStream } from 'fs';
import { join } from 'path';
import { WebConfig } from '../../../config/inex';
import { FileService } from './file.service';
import { MinioService } from '../minio/minio.service';

@Controller('file')
@ApiTags('文件上传')
export class UploadController {
    constructor(
        private fileService: FileService,
        private minioService: MinioService,
    ) { }

    @Get('/getById')
    @ApiOperation({ summary: '获取文件', description: "获取文件" })
    @ApiQuery({name: 'id', description: '根据id获取指定文件', required: true})
    async GetFile (@Query() id: number) {
        const res = await this.fileService.getById(id)
        return await this.minioService.getFileUrl(res.fileName)
    }
    @Get('/get')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '获取文件', description: "获取文件" })
    async GetFileList (@Query() query) {
        const res = await this.fileService.get(query)
        const data = await this.minioService.getFileUrls('blog', res)
        return Promise.resolve(data)
    }

    @Post('/delete')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '删除文件', description: "删除文件" })
    @ApiQuery({ name: 'id', description: "删除文件" })
    async deleteFile (@Query('id') id: number) {
        const res = await this.fileService.getById(id)
        await this.minioService.removeObject(res.fileName)
        return await this.fileService.delete(id)
    }

    @Post('/upload')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '上传文件', description: "上传文件" })
    @ApiParam({name: 'file', type: 'file', required: true})
    @UseInterceptors(FileInterceptor('file')) // file对应HTML表单的name属性
    async UploadedFile(@UploadedFile('file') file, @Body() body) {
        const fileHash = `${body.name}-${Date.now()}-${file.originalname}`
        await this.minioService.uploadFile(fileHash, file.buffer, file.mimetype);
        await this.fileService.create({fileName: fileHash})
        return this.minioService.getFileUrl(fileHash)
    }

    @Post('/upload/files')
    //注意此处是FilesInterceptor而上面是FileFieldsInterceptor
    @ApiOperation({ summary: '批量上传文件', description: "批量上传文件" })
    @UseInterceptors(FilesInterceptor('files')) //多个文件name属性相同的情况下
    @UseGuards(AuthGuard())
    async UploadedFiles(@Body() body, @UploadedFiles() files) {
        let filesArr = []
        for (const file of files) {
            const fileHash = `${body.name}-${Date.now()} -${file.originalname}`
            await this.minioService.uploadFile(fileHash, file.buffer, file.mimetype)
            filesArr.push(await this.minioService.getFileUrl(fileHash))
        }
        return Promise.resolve(filesArr)
    }

    @Post('/upload/fileFields')
    //注意此处是FileFieldsInterceptor代表多文件的name不同的拦截器
    // @UseInterceptors(FileFieldsInterceptor([
    //     { name: 'pic1', maxCount: 1 },
    //     { name: 'pic2', maxCount: 1 }
    // ]))
    @UseInterceptors(FileFieldsInterceptor([{
        name: 'front',
        maxCount: 1
    },
    {
        name: 'back',
        maxCount: 1
    },
    ]))
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '上传多个字段的文件', description: "上传多个字段的文件" })
    UploadedFileFields(@UploadedFiles() files, @Body() body) {
        if (!body.name) {
            throw new HttpException('请求参数错误.', responseStatus.failed.code)
        }
        for (const file of files) {
            const writeImage = createWriteStream(join(__dirname, '../../../../public/upload', `${body.name}-${Date.now()}-${file.originalname}`))
            writeImage.write(file.buffer)
        }
    }

    @Get('/minio/list')
    getMinioObject() {
        this.minioService.getObject('banner (1).jpg')
    }
}