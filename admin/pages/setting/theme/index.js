import React from 'react';
import Head from 'next/head';
import Layout from '@/layouts';
class Setting extends React.Component {
    constructor() {
        super()
    }
    render () {
        return (
            <Layout>
                <Head>
                    <title>主题设置</title>
                </Head>
                <h3 className='text-gray-600 text-lg leading-4 mb-5 divide-x border-solid border-l-4 pl-2 border-orange-f9'>设置</h3>
            </Layout>
        )
    }
}
export default Setting