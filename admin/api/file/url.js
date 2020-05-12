const prefix = '/file'
export default {
    uploadFile: prefix + '/upload', // 上传文件
    get: prefix + '/get', // 获取上传文件列表
    getById: prefix + '/getById', // 根据id获取上传文件详情
    uploadFiles: prefix + '/upload/files', // 批量上传文件
    uploadFileFields: prefix + '/upload/fileFields', // 上传文件
}