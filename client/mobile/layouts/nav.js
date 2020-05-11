import React from 'react'
import { routes } from '../config/index';
let navRoutes = routes.filter(el => el.meta && el.meta.showInNav)
class Nav extends React.Component {
    constructor (props) {
        super(props)
    }
    handleBack (path) {
        this.props.setActiveRouter(path)
    }
    render () {
        return (
            <div className='nav-menu'>
                {navRoutes.map((el, index) => (
                    <span
                    className={`${index < navRoutes.length - 1 ? 'border-r-2 ': ' '}pr-1 pl-1 `}
                    key={el.path}
                    onClick={() => this.handleBack(el)}>
                        {el.meta.menuTitle || el.meta.title}
                    </span>
                ))}
            </div>
        )
    }
}
export default Nav