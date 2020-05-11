import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    HttpException,
    UploadedFiles
} from '@nestjs/common';
import { responseStatus } from "../../utils";
import { createWriteStream } from 'fs';
import { join } from 'path';

export class UploadService {
    uploadFile(file, body) {
        const cws = createWriteStream(join(__dirname, '../../../../public/upload', `${body.name}-${Date.now()}-${file.originalname}`))
        cws.write(file.buffer);
        return Promise.resolve({
            message: '上传图片成功',
            data: join('file:///', __dirname, '../../../../public/upload/', `${body.name}-${Date.now()}-${file.originalname}`)
        });
    }
}