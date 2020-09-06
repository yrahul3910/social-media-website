import React from 'react';
import {Link} from 'react-router-dom';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {text: 'Hello World!'};
        this.click = this.click.bind(this);
    }

    click() {
        this.setState({text: 'Hello Universe!'});
    }

    render() {
        return (
            <div>
                <h1><Link to="/login">{this.state.text}</Link></h1>
                <button onClick={this.click}>Change state</button>
            </div>
        );
    }
}
