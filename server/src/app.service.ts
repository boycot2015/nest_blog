import { Injectable } from '@nestjs/common';
import { ArticleService } from "./modules/article/article.service";
import { SettingService } from "./modules/setting/setting.service";
import { timeFormat, getOneMonthDateList } from "./utils";

@Injectable()
export class AppService {
    constructor(private articleService: ArticleService,
        private settingService: SettingService) { }
    getHello(): string {
        return 'Hello World!';
    }
    async getDatas(): Promise<object> {
        const res = await this.articleService.getAll()
        const config = await this.settingService.get({})
        let activity = JSON.parse(config[0][0].activity)
        let deadline = new Date(activity.time).getTime()
        let deadTitle = activity.name
        // console.log(config, 'config')
        let newLeast = res[0].filter(el => el.status + '' === '1001')
        newLeast = newLeast.length > 4 ? newLeast.slice(-4) : newLeast
        let data = {
            currentTime: Date.now(),
            deadline,
            deadTitle,
            newLeast: newLeast,
            publicData: {
                total: res[1],
                data: []
            },
            visitorData: {
                total: 0,
                data: []
            },
            total: res[1]
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
                        // console.log(elDay, valDay, 'elDay')
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
