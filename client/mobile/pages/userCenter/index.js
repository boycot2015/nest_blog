import React, { Fragment } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button} from 'antd-mobile';

class UserCenter extends React.Component {
  constructor (props) {
    super (props)
  }
  static async getInitialProps( { api } ) {
    const res = await api.user.getById({id: 1})
    console.log(res, 'user')
    if (res && res.success) {
      return {
        userInfo: res.data
      }
    } else {
      return {
        userInfo: {}
      }
    }
  }
  render () {
    return (
      <Fragment>
          <h1>个人中心</h1>
          <div className="flex flex-column" style={{flexDirection: "column"}}>
            <span className="user_id">{this.props.id}</span>
            <span className="user_name">{this.props.username}</span>
          </div>
      </Fragment>
    )
  }
}
export default UserCenter;