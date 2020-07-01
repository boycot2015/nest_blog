import React, { Fragment } from 'react';
import Router, { withRouter } from 'next/router'
import Head from 'next/head';
import { Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import {
    List, Card, Progress,
    Skeleton, Avatar,
    Calendar,
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
        const res = await $api.home.datas()
        // console.log(res, 'res.data')
        if (res && res.success) {
            return {
                loading: true,
                currentTime: timeFilter(res.data.currentTime),
                deadline: timeFilter(res.data.deadline),
                deadTitle: res.data.deadTitle,
                homeData: res.data.newLeast,
                datas: res.data,
                total: res.data.total,
            }
        } else {
            return {
                loading: true,
                currentTime: timeFilter(Date.now()),
                data: [],
                datas: {},
                deadTitle: '',
                deadline: new Date('2020-06-25 00:00:00').getTime(),
                total: 999
            }
        }
    }
    state = {
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
                data: (this.state.datas.publicData && this.state.datas.publicData.data.map(el => el.time)) || [],
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
                    data: (this.state.datas.publicData && this.state.datas.publicData.data.map(el => el.value)) || [],
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
                    data: (this.state.datas.visitorData && this.state.datas.visitorData.data.map(el => el.value)) || [],
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
        const { loading, deadline, deadTitle } = this.state;
        return (
            <Fragment>
                <Head>
                    <title>首页</title>
                </Head>
                {/* Link内需要a标签，不然爬虫识别不了，不用a可以加passHref，提高爬虫识别率 */}

                {/* <Link href="/userList" passHref>
                </Link> */}
                <div span={24} className='flex mb-4'>
                    <Calendar className='mr-10' style={{ width: 300, height: 325, border: '1px solid #e8e8e8', borderRadius: 5, boxShadow: '0 0 15px #e8e8e8' }} fullscreen={false} />
                    <div className='flex-1 flex flex-col'>
                        <div className='flex flex-row'>
                            <div className='flex flex-1 flex-col'>
                                <span className=' text-gray-600'>当前时间</span>
                                <p className='text-2xl text-gray-900 mb-0 font-normal'>{this.state.currentTime}</p>
                            </div>
                            <div className='flex-1 flex flex-col'>
                                <Countdown className='flex-1 text-2xl text-gray-900 font-normal' title={deadTitle + "倒计时"} value={deadline} format="D 天 H 时 m 分 s 秒" />
                            </div>
                        </div>
                        <div className='flex-1 flex flex-col'>
                            <h3 className='text-gray-600 text-lg leading-4 mt-3 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>最新动态</h3>
                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={this.state.homeData}
                                renderItem={item => (
                                    <List.Item>
                                        <Skeleton loading={loading} buttonActive>
                                            <Card title={item.title} bodyStyle={{ height: 155, overflow: 'hidden', borderRadius: 5, boxShadow: '0 0 15px #e8e8e8' }}>
                                                <div style={{ height: 100, overflow: 'hidden' }} onClick={() => Router.push('/article/view?id=' + item.id)} style={{ maxHeight: 100, maxWidth: 350, margin: '0 auto', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: item.content }}>
                                                </div>
                                                <p className="time">发布于 · <span className="text-orange-400">{React.$filters.timeFilter(new Date(item.createTime).getTime())}</span></p>
                                            </Card>
                                        </Skeleton>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
                </div>
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