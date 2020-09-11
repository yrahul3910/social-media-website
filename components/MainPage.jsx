import React from 'react';
import { Link } from 'react-router-dom';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1><Link to="/login">Placeholder</Link></h1>
            </div>
        );
    }
}
