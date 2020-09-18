import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Post from './Post.jsx';
import Navbar from './Navbar.jsx';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true,
            fail: false,
            posts: [],
            username: ''
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('token');

        if (!token) {
            this.setState({ loggedIn: false });
            return;
        }

        /*
         * Get user info
         * Try fetching the user details
         */
        const results = await fetch('/api/user/info', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        let data = await results.json();
        this.setState({ username: data.username });

        const response = await fetch('/api/feed', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        data = await response.json();
        if (!data.success) {
            this.setState({ loggedIn: false });
            return;
        }

        this.setState({ posts: data.posts });
    }

    render() {
        if (!this.state.loggedIn) {return <Redirect to='/login' />;}

        const posts = this.state.posts ?
            this.state.posts.map((x, i) => <div key={i} className="row" style={{ display: 'block' }}>
                <div className="col-4 col-gap-4">
                    <Post name={x.username}
                        username={x.username} content={x.content} currentUsername={this.props.user.username}
                        dp={x.pic} />
                </div>
            </div>) :
            null;
        return (
            <main>
                <Navbar user={this.props.user} />
                <div className="col-4 col-gap-4">
                    {posts}
                </div>
            </main>
        );
    }
}

MainPage.propTypes = { user: PropTypes.object };

export default MainPage;
