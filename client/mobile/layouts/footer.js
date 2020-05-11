import React from 'react'
import Link from 'next/link';
import Router from 'next/router';
import { routes } from '../config';

class Footer extends React.Component {
    constructor (props) {
        super(props)
    }
    state = {
        activeIndex: this.props.activeIndex
    }
    handleNextPage (el) {
        this.setState({
            activeIndex: el.path
        })
        Router.push(el.path)
    }
    render () {
        return (
            <div className='footer flexbox-h align-c'>
                {routes.map(el => {
                    return (
                        el.meta.showInMenu ?
                        <div
                        key={el.name}
                        onClick={ ()=> { this.handleNextPage(el) } }
                        className={'footer-item flexbox-v align-c flex1 tc ' + (this.state.activeIndex === el.path ? 'active': '')}
                        >
                            <span className={'icon '+ el.meta.icon }></span>
                            <span className='text'>{el.meta.menuTitle ? el.meta.menuTitle : el.meta.title}</span>
                        </div> : null
                    )
                })}
            </div>
        )
    }
}
export default Footer