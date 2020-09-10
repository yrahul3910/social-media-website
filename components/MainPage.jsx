import React from 'react';
import {Link} from 'react-router-dom';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Get token by calling the /api/authenticate
        
        // Use the token to get all friends' posts
        
        // Add posts to state
    }

    render() {
        return (
            <div>
                <h1><Link to="/login">Placeholder</Link></h1>
            </div>
        );
    }
}
