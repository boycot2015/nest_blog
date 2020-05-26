import React, { Fragment } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button, List, Carousel } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;
class Home extends React.Component {
  constructor (props) {
    super(props)
  }
  state = {
    banners: this.props.banners,
    imgHeight: 176,
    ...this.props
  }
  static async getInitialProps( { api } ) {
    const res = await api.home.datas()
    const banners = await api.file.get()
    console.log(res, 'datas')
    return {
      data: res.data,
      banners: banners.data[0],
    }
  }
  render () {
      return (
          <Fragment>
            <Head title={'next-ssr'}>
              {/* <meta content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport" /> */}
              {/* <script src="../static/js/antm-viewport.min.js" as="script"></script> */}
              {/* <script src="../static/js/common.js" as="script"></script> */}
              {/* <link rel="stylesheet" href='../static/scss/index.scss'></link> */}
            </Head>
            {/* Link内需要a标签，不然爬虫识别不了，不用a可以加passHref，提高爬虫识别率 */}
        
            {/* <Link href="/userList" passHref>
              <Button type="primary">用户列表页</Button>
            </Link> */}
              <h1 className={'h-3 border-b border-gray-300 leading-3 text-center text-x32'}>首页</h1>
              <Carousel className="space-carousel"
                frameOverflow="visible"
                cellSpacing={10}
                slideWidth={0.8}
                autoplay
                infinite
                beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                afterChange={index => this.setState({ slideIndex: index })}
              >
                {this.state.banners.map((val, index) => (
                  <a
                    key={val.url}
                    href="http://www.alipay.com"
                    style={{
                      display: 'block',
                      position: 'relative',
                      top: this.state.slideIndex === index ? -10 : 0,
                      height: this.state.imgHeight,
                      boxShadow: '2px 1px 1px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <img
                      src={val.url}
                      alt=""
                      style={{ width: '100%', verticalAlign: 'top' }}
                      onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({ imgHeight: 'auto' });
                      }}
                    />
                  </a>
                ))}
              </Carousel>
              <div
              className="pl-1 pr-1"
              >
                {this.props.data.newLeast.map((el, i) => (
                  <List
                    key={el.id}
                    className={`my-list ${i!==this.props.data.newLeast.length - 1 ? 'mb-1' : ''}`}
                    >
                    <Item data-seed="logId"
                    className="border-b border-gray-e8"
                    >{el.title}</Item>
                    <Item
                      multipleLine
                      onClick={() => {}}
                      platform="android"
                    >
                      <Brief><div className="h-8 overflow-hidden" dangerouslySetInnerHTML={{__html:el.content}}></div></Brief>
                    </Item>
                  </List>
                ))}
              </div>
          </Fragment>
        )
    }
}

export default Home;