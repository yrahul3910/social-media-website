import React from 'react';

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
            </ul>
        );
    }
}
