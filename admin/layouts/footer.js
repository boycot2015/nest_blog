import React from 'react'
class Footer extends React.Component {
    constructor() {
        super()
    }
    render () {
        return (
            <div
                class="copyright tc"
                style={{
                    marginBottom: 14
                }}>
                {/* <!-- http://www.beianbeian.com/beianxinxi/c5e8d71f4e4169a4ffe2425ec7b91a4c.html--> */}
                <a href="http://beian.miit.gov.cn" target="_blank">
                    粤ICP备18002072号
            </a>
            </div>
        )
    }
}
export default Footer