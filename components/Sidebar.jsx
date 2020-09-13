import React from 'react';
import PropTypes from 'prop-types';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const children = this.props.children ?
            React.Children.map(this.props.children, (x, i) => <li key={i}>{x}</li>
            ) :
            null;

        return (
            <ul className='sidebar'>
                <li onClick={this.showMenu} id='hamburger'>
                    <i className='fas fa-bars'></i>
                </li>
                {children}
            </ul>
        );
    }
}

Sidebar.propTypes = { children: PropTypes.object };

export default Sidebar;
