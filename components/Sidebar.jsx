import React from 'react';
import PropTypes from 'prop-types';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const children = this.props.children.map((x, i) => <li key={i}>{x}</li>
        );

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

Sidebar.propTypes = { children: PropTypes.array.isRequired };

export default Sidebar;
