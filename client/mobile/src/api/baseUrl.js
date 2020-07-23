let baseUrl = 'http://localhost:4000'

const env = process.env.NODE_ENV
console.log(env, 'env')
switch (env) {
    case 'development':
        baseUrl = 'http://localhost:4000';
        break;
    case 'test':
        baseUrl = 'http://106.13.8.33:4000';
        break;
    case 'production':
        baseUrl = 'http://www.blog.api.boycot.top'
        break;
    default:
        break;
}
export {
    baseUrl
}
