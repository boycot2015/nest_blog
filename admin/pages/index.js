import React, { Fragment } from 'react';
import Router, { withRouter } from 'next/router'
import Head from 'next/head';
import { Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import {
    List, Card, Progress,
    Skeleton, Avatar,
    Statistic, Row, Col
} from 'antd';
const { Meta } = Card;
import { timeFilter } from '@/utils'
const { Countdown } = Statistic;

class Home extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ $api }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        const res = await $api.article.get({ current: 1, pageSize: 10 })
        const datas = await $api.home.datas()
        if (datas && datas.success) {
            return {
                loading: true,
                deadline: new Date('2020-10-01 00:00:00').getTime(),
                homeData: res.data[0].slice(0, 4),
                datas: datas.data,
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: res.data[1],
                    pageSizeOptions: [5, 10, 20, 50]
                },
            }
        } else {
            return {
                loading: true,
                data: [],
                datas: {},
                deadline: new Date('2020-10-01 00:00:00').getTime(),
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: 999,
                    pageSizeOptions: [5, 10, 20, 50]
                }
            }
        }
    }
    state = {
        // new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日 ' + new Date().toLocaleTimeString()
        currentTime: timeFilter(Date.now()),
        queryData: {},
        hasData: true,
        ...this.props
    }
    getOption () {
        const option = {
            title: {
                text: '近30天文章发布及访问记录',
                // subtext: '数据统计'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['发布', '访问']
            },
            toolbox: {
                show: false,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    magicType: { type: ['line', 'bar'] },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLabel: {//坐标轴刻度标签的相关设置。
                    // interval: 1,
                    // rotate: "30"
                },
                data: this.state.datas.publicData.data.map(el => el.time),
                // ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} 篇/人次'
                }
            },
            series: [
                {
                    name: '发布',
                    type: 'line',
                    smooth: true,
                    // data: [11, 11, 15, 13, 12, 13, 10],
                    data: this.state.datas.publicData.data.map(el => el.value),
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
                {
                    name: '访问',
                    type: 'line',
                    smooth: true,
                    // data: [0, 2, 2, 5, 3, 2, 0],
                    data: this.state.datas.visitorData.data.map(el => el.value),
                    markPoint: {
                        data: [
                            { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' },
                            [{
                                symbol: 'none',
                                x: '90%',
                                yAxis: 'max'
                            }, {
                                symbol: 'circle',
                                label: {
                                    normal: {
                                        position: 'start',
                                        formatter: '最大值'
                                    }
                                },
                                type: 'max',
                                name: '最高点'
                            }]
                        ]
                    }
                }
            ]
        };
        return option;
    }
    componentDidMount () {
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 100);
        setInterval(() => {
            this.setState({
                currentTime: timeFilter(Date.now())
            })
        }, 1000);
    }

    render () {
        const { loading, deadline } = this.state;
        return (
            <Fragment>
                <Head>
                    <title>首页</title>
                </Head>
                {/* Link内需要a标签，不然爬虫识别不了，不用a可以加passHref，提高爬虫识别率 */}

                {/* <Link href="/userList" passHref>
                </Link> */}
                <div span={24} className='flex mb-4'>
                    <div className='flex-1 flex flex-col'>
                        <span className=' text-gray-600'>当前时间</span>
                        <p className='text-2xl text-gray-900 font-normal'>{this.state.currentTime}</p>
                    </div>
                    <Countdown className='flex-1 text-2xl text-gray-900 font-normal' title="国庆节倒计时" value={deadline} format="D 天 H 时 m 分 s 秒" />
                </div>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>最新动态</h3>
                <List
                    className='mb-5'
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={this.state.homeData}
                    renderItem={item => (
                        <List.Item>
                            <Skeleton loading={loading} buttonActive>
                                <Card title={item.title} bodyStyle={{ height: 150, overflow: 'hidden' }}>
                                    <div onClick={() => Router.push('/article/view?id='+item.id)} style={{ maxHeight: 100, maxWidth: 350, margin: '0 auto', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: item.content }}>
                                    </div>
                                </Card>
                            </Skeleton>
                        </List.Item>
                    )}
                />
                <h3 className='text-gray-600 text-lg leading-4 mb-6 mt-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>文章发布记录统计</h3>
                <Row gutter={16}>
                    <Col span={24}>
                        {/* <Statistic title="发布记录" value={112893} /> */}
                        <Skeleton loading={loading} buttonActive>
                            <ReactEcharts
                                option={this.getOption()}
                                style={{ height: '340px' }}
                                className='react_for_echarts' />
                        </Skeleton>
                    </Col>
                    {/* <Col span={12}>
                        <Statistic title="浏览记录" value={112893} precision={2} />
                        <Button style={{ marginTop: 16 }} type="primary">
                            Recharge
                        </Button>
                    </Col> */}
                </Row>
            </Fragment>
        );
    }
}
export default Home;