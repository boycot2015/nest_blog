import {
    Controller,
    Post,
    Req,
    Body,
    UseInterceptors,
    HttpException,
    UploadedFile,
    UploadedFiles
} from '@nestjs/common';
import {
    FileInterceptor,
    FilesInterceptor,
    FileFieldsInterceptor
} from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';
import { MinioService } from './minio.service';
// import { UploadService } from '../upload/upload.service';
import { responseStatus, decryptByDES } from "../../utils";
import { createWriteStream } from 'fs';
import { join } from 'path';


@Controller('upload')
@ApiTags('文件上传')
export class MinioController {
    constructor(
        private minioService: MinioService,
        // private uploadSerive: UploadService,
    ) { }
    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadMinio(@UploadedFile() file, @Req() req, @Body() body) {
        const temp = req.header('authorization').split(' ');
        const userId = (decryptByDES(temp[temp.length - 1]) as any)
            .userId;
        const fileHash = `${body.name}-${Date.now()} -${file.originalname}`
        await this.minioService.uploadFile(fileHash, file.buffer, file.mimetype);
        return { fileName: fileHash };
    }

    @Post('/files')
    //注意此处是FilesInterceptor而上面是FileFieldsInterceptor
    @ApiOperation({ summary: '批量上传文件', description: "批量上传文件" })
    @UseInterceptors(FilesInterceptor('files')) //多个文件name属性相同的情况下
    UploadedFiles(@Body() body, @UploadedFiles() files) {
        for (const file of files) {
            const cws = createWriteStream(join(__dirname, '../../../../public/upload/', `${body.name}-${Date.now()}-${file.originalname}`))
            cws.write(file.buffer);
        }
        return '上传多个文件成功';
    }

    @Post('/fileFields')
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
}