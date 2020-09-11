import React from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.showMenu = this.showMenu.bind(this);
        this.nav = React.createRef();
    }

    showMenu() {
        this.nav.current.classList.toggle('expanded');
    }

    render() {
        return (
            <ul className='nav-sticky' ref={this.nav}>
                <li onClick={this.showMenu} id='hamburger'>
                    <i className='fas fa-bars'></i>
                </li>
                <li><Link to="/">social.io</Link></li>
                <li><input type="search" style={{ width: '50vw' }} placeholder="Search"/></li>
                <li><i className='fas fa-cog'></i>
                    <Link to="/profile">
                        {' Profile '}
                    </Link>
                </li>
                <li><i className='fas fa-cog'></i>
                    <Link to="/setting">
                        {' Setting '}
                    </Link>
                </li>
            </ul>
        );
    }
}
