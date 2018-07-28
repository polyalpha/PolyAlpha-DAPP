import React, {Component} from 'react';
import {
    Menu,
    Container,
    Image,
} from 'semantic-ui-react';
import Head from 'next/head';
import routes from 'next-routes';

const Link = routes().Link;

// const fixedMenuStyle = {
//     backgroundColor: '#fff',
//     border: '1px solid #ddd',
//     boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
// }

class Header extends Component {
    render() {
        let fixed = true;
        let pathname = "/"
        return (
            <div>
            <Head>
                <link rel="stylesheet" href="static/css/semantic.css"/>
            </Head>
            <Menu
            borderless
            fixed={fixed ? 'top' : null}
            inverted={!fixed}
            pointing={!fixed}
            secondary={!fixed}
            // style={fixedMenuStyle}
            >
                <Link route="/">
                    <a className={pathname == '/' ? 'active item' : 'item'}>
                        Messenger POC
                    </a>
                </Link>
                <Link route="/">
                    <a className={pathname == '/daico' ? 'active item' : 'item'}>
                        DAICO
                    </a>
                </Link>
                <Link route="/">
                    <a className={pathname == '/feedback' ? 'active item' : 'item'}>
                        Feedback
                    </a>
                </Link>
            </Menu>
            </div>
        )
    }
}

export default Header;