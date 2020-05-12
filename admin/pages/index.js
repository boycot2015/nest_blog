import React, { Fragment } from 'react';
import Router, { withRouter } from 'next/router'
import Head from 'next/head';
import { Button } from 'antd';
import {
    List, Card, Progress,
    Skeleton, Avatar,
    Statistic, Row, Col
} from 'antd';
const { Meta } = Card;
import { timeFilter } from '@/utils'
const { Countdown } = Statistic;

const deadline = new Date('2020-10-01 00:00:00').getTime(); // Moment is also OK
class Home extends React.Component {
    constructor(props) {
        super(props)
    }
    static async getInitialProps ({ api }) {
        // 从query参数中回去id
        //通过process的browser属性判断处于何种环境：Node环境下为false,浏览器为true
        // 发送服务器请求
        let articleListData = []
        const res = await api.article.get({ current: 1, pageSize: 10 })
        if (res && res.success) {
            return {
                loading: false,
                homeData: res.data[0].slice(0, 4),
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: res.data[1],
                    pageSizeOptions: [3, 10, 20, 50, 100]
                },
            }
        } else {
            return {
                loading: true,
                data: [],
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: 999,
                    pageSizeOptions: [3, 10, 20, 50, 100]
                }
            }
        }
        if (!process.browser) {
        } else {
            // 没有请求服务器的情况下在此使用缓存
            articleListData = JSON.parse(sessionStorage.getItem('articleList'));
            // 对查询的数据进行过滤和返回
            return { data: articleListData }
        }
    }
    state = {
        // new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日 ' + new Date().toLocaleTimeString()
        currentTime: timeFilter(Date.now()),
        loading: true,
        homeData: this.props.homeData,
        pageData: this.props.pageData,
        queryData: {},
        hasData: true
    }

    componentDidMount () {
        setInterval(() => {
            this.setState({
                currentTime: timeFilter(Date.now())
            })
        }, 1000);
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }
    render () {
        const { loading } = this.state;
        return (
            <Fragment>
                <Head>
                    <title>首页</title>
                </Head>
                {/* Link内需要a标签，不然爬虫识别不了，不用a可以加passHref，提高爬虫识别率 */}

                {/* <Link href="/userList" passHref>
                </Link> */}
                <div span={24} className='flex mb-5'>
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
                            <Skeleton loading={!loading} avatar active>
                                <Card title={item.title} bodyStyle={{ height: 120 }}>
                                    <div style={{maxHeight: 100, overflow: 'hidden'}} dangerouslySetInnerHTML={{ __html: item.content }}>
                                    </div>
                                </Card>
                            </Skeleton>
                        </List.Item>
                    )}
                />
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>最新访客量</h3>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="Active Users" value={112893} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
                        <Button style={{ marginTop: 16 }} type="primary">
                            Recharge
                        </Button>
                    </Col>
                </Row>
                <Progress
                    type="circle"
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }}
                    percent={80}
                />
            </Fragment>
        );
    }
}
export default Home;