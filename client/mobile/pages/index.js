import React, { Fragment } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button} from 'antd-mobile';

class Home extends React.Component {
  constructor (props) {
    super(props)
  }
  static async getInitialProps( { api } ) {
    const res = await api.user.get()
    console.log(res, 'user')
    return {
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
              <h1>首页</h1>
          </Fragment>
        )
    }
}

export default Home;