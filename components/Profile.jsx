import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Post from './Post.jsx';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = { posts: null };
    }

    async componentDidMount() {
        if (!this.props.user) {
            // Try fetching the user details
            if (localStorage.getItem('token')) {
                const results = await fetch('/api/user/info', {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: localStorage.getItem('token') })
                });
                const data = await results.json();
                this.props.toggleLogin(data.user);
            }
        }

        const posts = await fetch('/api/user/posts', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: localStorage.getItem('token') })
        });
        const postData = await posts.json();

        this.setState({ posts: postData.posts });
    }

    render() {
        if (!this.props.user) {return <Navbar user={null} />;}

        const postsDiv = this.state.posts ?
            this.state.posts.map((x, i) => <Post key={i} name={this.props.user.name}
                username={this.props.user.username}
                content={x.content}
                dp={this.props.user.dp}
                currentUsername={this.props.user.username}/>) :
            null;

        return (
            <main>
                <Navbar user={this.props.user} />
                <div className="row" style={{ marginTop: '70px' }}>
                    <div className="col-4 col-gap-3">
                        <div style={{ display: 'flex' }}>
                            <img src={this.props.user.dp } />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <h3 style={{ color: 'white' }}>{this.props.user.name}</h3><br />
                                <p className='poster-username' style={{ color: 'white' }}>
                                    @{this.props.user.username}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <button className="col-4 col-gap-4">
                        <Link to='/settings'>
                            <i className="fas fa-cogs"></i>
                            <span style={{
                                color: 'white',
                                textDecoration: 'none'
                            }}>Settings</span>
                        </Link>
                    </button>
                </div>
                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col-4 col-gap-4">
                        {postsDiv}
                    </div>
                </div>
            </main>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired
};

export default Profile;

