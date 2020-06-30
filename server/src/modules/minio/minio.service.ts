import * as Minio from 'minio';
import { Client, ClientOptions } from 'minio';
import {
    Controller,
    Post,
    Body,
    Res,
    UseInterceptors,
    HttpException,
    UploadedFile,
    UploadedFiles
} from '@nestjs/common';
import { aesDecrypt, responseStatus } from "../../utils";
export class MinioService {
    options: ClientOptions;
    minioClient: Client;

    constructor(private opts: ClientOptions) {
        this.options = opts;
        this.initial();
    }

    initial() {
        this.minioClient = new Minio.Client({
            ...this.options,
            // endPoint: '192.168.1.175',
            endPoint: '106.13.8.33',
            // endPoint: '47.113.87.100',
            port: 9000,
            useSSL: false,
            accessKey: 'minioadmin',
            secretKey: 'minioadmin',
        });
    }

    createBucket(bucketName) {
        return new Promise((resolve, reject) => {
            this.minioClient.makeBucket(bucketName, 'us-east-1', err => {
                if (err) {
                    reject(err);
                } else {
                    resolve('success');
                }
            });
        });
    }

    isExistsBucket(bucketName) {
        return new Promise((resolve, reject) => {
            this.minioClient.bucketExists(bucketName)
        });
    }
    async uploadFile(fileName, file: Buffer, type, BucketName = 'blog') {
        this.initial();
        if (!this.minioClient.bucketExists(BucketName)) {
            await this.createBucket(BucketName);
        }
        const metaData = {
            'Content-Type': type,
        };
        try {
            return await this.minioClient.putObject(
                BucketName,
                fileName,
                file,
                1024,
                metaData
            );
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }
    async getObject(fileName, type = 'image/jpeg', BucketName = 'blog') {
        this.initial();
        try {
            return await this.minioClient.getObject(BucketName, fileName);
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }
    async getFileUrl(fileName, type = 'image/jpeg', BucketName = 'blog') {
        this.initial();
        try {
            return await this.minioClient.presignedUrl('GET', BucketName, fileName, 24 * 60 * 60 * 7)
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }
    async getFileUrls(BucketName = 'blog', files) {
        this.initial();
        try {
            for (const file of files[0]) {
                file.url = await this.minioClient.presignedUrl('GET', BucketName, file.fileName)
            }
            // console.log(files, 'files')
            return Promise.resolve(files)
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }
    async removeObject(fileName, type = 'image/jpeg', BucketName = 'blog') {
        try {
            await this.minioClient.removeObject(BucketName, fileName);
            return responseStatus.success.message
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }
}