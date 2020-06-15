let baseUrl = 'http://106.13.8.33:4000/'

const env = process.env.NODE_ENV
console.log(env, 'env')
switch (env) {
    case 'development':
        // baseUrl = 'http://192.168.0.111:4000';
        baseUrl = 'http://192.168.1.175:4000';
        break;
    case 'production':
        baseUrl = 'http://106.13.8.33:4000'
        break;
    default:
        break;
}
export {
    baseUrl
}
