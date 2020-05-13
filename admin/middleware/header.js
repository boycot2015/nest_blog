import axios from '@/api/axios';
export default function ({ req, res }) {
    //获取cookie然后拆成键值对
    console.log(req.headers, 'config.headers')

    if (req && req.headers.cookie) {
        let cookies = req.headers.cookie
        let cookiesArr = []
        let cookiesObj = {}
        cookies = cookies.split(';');
        cookies.map((el, index) => {
            cookiesArr.push(el.split('='))
            cookiesObj[cookiesArr[index][0]] = cookiesArr[index][1]
        });
        axios.defaults.headers.Authorization = 'Bearer ' + cookiesObj.token
        // console.log(axios.defaults.headers, 'req.headers')
    }
    // //设置axios的全局变量
    // axios.defaults.headers['access_token'] = access_token;
    // axios.defaults.headers['cityid'] = cityid
}