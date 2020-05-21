import { Injectable } from '@nestjs/common';
import { ArticleService } from "./modules/article/article.service";
import { timeFormat, getOneMonthDateList } from "./utils";

@Injectable()
export class AppService {
    constructor(private articleService: ArticleService) { }
    getHello(): string {
        return 'Hello World!';
    }
    async getDatas(): Promise<object> {
        const res = await this.articleService.getAll()
        let data = {
            publicData: {
                total: res[1],
                data: []
            },
            visitorData: {
                total: 0,
                data: []
            }
        }
        res[0].map(el => {
            if (el.status + '' === '1001') {
                if (data.publicData.data.length) {
                    let canAdd = true
                    data.publicData.data.map((val, index) => {
                        let elDay = new Date(el.createTime).getDate()
                        let valDay = new Date(val.time).getDate()
                        if (elDay === valDay) {
                            canAdd = false
                            data.publicData.data[index].value += 1
                        }
                    })
                    canAdd && data.publicData.data.push({
                        time: timeFormat(new Date(el.createTime).getTime(), 'YYYY-MM-DD'),
                        value: 1,
                    })
                } else {
                    data.publicData.data.push({
                        time: timeFormat(new Date(el.createTime).getTime(), 'YYYY-MM-DD'),
                        value: 1
                    })
                }
                if (data.visitorData.data.length) {
                    let canAdd = true
                    data.visitorData.data.map((val, index) => {
                        let elDay = new Date(el.createTime).getDate()
                        let valDay = new Date(val.time).getDate()
                        console.log(elDay, valDay, 'elDay')
                        if (elDay === valDay) {
                            canAdd = false
                            data.visitorData.data[index].value += +(el.visitor === null ? 0 : +el.visitor)
                        }
                    })
                    canAdd && data.visitorData.data.push({
                        time: timeFormat(new Date(el.createTime).getTime(), 'YYYY-MM-DD'),
                        value: el.visitor === null ? 0 : +el.visitor
                    })
                    data.visitorData.total += +(el.visitor === null ? 0 : +el.visitor)
                } else {
                    data.visitorData.data.push({
                        time: timeFormat(new Date(el.createTime).getTime(), 'YYYY-MM-DD'),
                        value: el.visitor === null ? 0 : +el.visitor
                    })
                    data.visitorData.total = +(el.visitor === null ? 0 : +el.visitor)
                }
            }
        })
        data.publicData.data = getOneMonthDateList().map(date => {
            let dateItem = {
                time: timeFormat(new Date(date).getTime(), 'YYYY-MM-DD'),
                value: 0
            }
            let existArr = data.publicData.data.map((el) => {
                if (date === el.time) {
                    console.log(el, 'getOneMonthDateList()');
                    return el
                }
            })
            existArr && existArr.map(val => {
                if (val && val.time === date) {
                    dateItem = val
                }
            })
            return dateItem
        })
        data.visitorData.data = getOneMonthDateList().map(date => {
            let dateItem = {
                time: timeFormat(new Date(date).getTime(), 'YYYY-MM-DD'),
                value: 0
            }
            let existArr = data.visitorData.data.map((el) => {
                if (date === el.time) {
                    return el
                }
            })
            existArr && existArr.map(val => {
                if (val && val.time === date) {
                    dateItem = val
                }
            })
            return dateItem
        })
        // console.log(data.publicData.data, 'getOneMonthDateList()');
        return Promise.resolve(data)
    }
}
