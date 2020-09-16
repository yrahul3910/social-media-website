import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Post from './Post.jsx';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true,
            fail: false,
            posts: []
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('token');

        if (!token) {
            this.setState({ loggedIn: false });
            return;
        }

        const response = await fetch('/api/feed', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        const data = await response.json();
        if (!data.success) {
            this.setState({ loggedIn: false });
            return;
        }

        this.setState({ posts: data.posts });
    }

    render() {
        if (!this.state.loggedIn) {return <Redirect to='/login' />;}

        const posts = this.state.posts ?
            this.state.posts.map((x, i) => <Post key={i} name={x.username}
                username={x.username} content={x.content} dp={x.pic} />) :
            null;
        return (
            <div>
                <h1><Link to="/login">Placeholder</Link></h1>
                {posts}
            </div>
        );
    }
}
