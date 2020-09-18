import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.showMenu = this.showMenu.bind(this);
        this.nav = React.createRef();
    }

    showMenu() {
        this.nav.current.classList.toggle('expanded');
    }

    render() {
        let userItem;
        if (this.props.user) {
            userItem = <Fragment>
                <li>
                    <img style={{
                        borderRadius: '50%',
                        width: '40px'
                    }} src={this.props.user.dp} />
                    <Link to='/profile'>{this.props.user.name}</Link>
                </li>
            </Fragment>;
        }
        else {
            userItem = <li><Link to='/login'>Log in</Link></li>;
        }

        return (
            <ul className='nav-sticky' ref={this.nav}>
                <li onClick={this.showMenu} id='hamburger'>
                    <i className='fas fa-bars'></i>
                </li>
                <li><Link to="/"><h3>social.io</h3></Link></li>
                <li className='search'><input type="search" style={{ width: '50vw' }} placeholder="Search"/></li>
                {userItem}
            </ul>
        );
    }
}

Navbar.propTypes = { user: PropTypes.object };

export default Navbar;
