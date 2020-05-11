import axios from 'axios';
import baseUrl from './baseUrl';
import qs from "qs";
import Router from 'next/router';

/****** 创建axios实例 ******/
const service = axios.create({
    baseURL: baseUrl,  // api的base_url
    timeout: 5000  // 请求超时时间
});

/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
    config.method === 'post'
        ? config.data = config.headers['Content-Type'] === 'application/x-www-form-urlencoded' ?
        qs.stringify({...config.data}) : {...config.data}
        : config.params = {...config.params};
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
}, error => {  //请求错误处理
    Promise.reject(error)
});

/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
    response => {  //成功请求到数据
        //这里根据后端提供的数据进行对应的处理
        if (response.status === 200) {
            return response.data;
        } else {
            return Promise.reject(response)
        }
    },
    error => {  //响应错误处理
        console.log(error);
        if (error.statusCode === 401) {
            Router.push('/login')
        }
        console.log(JSON.stringify(error));
        return Promise.reject(error)
    }
);
export default service;