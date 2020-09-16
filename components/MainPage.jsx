import React from 'react';
import { Link } from 'react-router-dom';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: 'None',
            // We will dispay four friends
            posts: [
                {
                    username: 'Sun Shine',
                    userinfo: 'At least you have sun shine my friend:)',
                    pic: 'http://localhost:8000/doge.png',
                    post: 'Go make some friends!'
                },
                {
                    username: 'Air',
                    userinfo: 'Air is your frined, take a breath:)',
                    pic: 'http://localhost:8000/doge.png',
                    post: 'Go make some friends!'
                },
                {
                    username: 'Water',
                    userinfo: 'Water is your friend, hydrate yourself:)',
                    pic: 'http://localhost:8000/doge.png',
                    post: 'Go make some friends!'
                },
                {
                    username: 'Trouble',
                    userinfo: 'As they said, trouble is your friend:)',
                    pic: 'http://localhost:8000/doge.png',
                    post: 'Make one more friend, trouble will go.'
                },
            ]
        };
    }

    async componentDidMount() {
        /*
         * Get token from localStorage
         * let token = localStorage.getItem('token');
         */
        const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'+
        'eyJ1c2VybmFtZSI6InVzZXIxIiwibmFtZSI6ImJsYWgiLCJpYXQi'+
        'OjE2MDAxNzgyMTMsImV4cCI6MTYwMDI2NDYxM30.LmYq-JXowykS'+
        'HjMqzGQFygOjN3ACAqeA5nlihEX8_sA';
        const response = await fetch('http://localhost:8000/api/feed', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: t })
        });

        const data = await response.json();

        let i;
        let max = 0; // We only display 4 friends' post the MainPage
        console.log(Object.keys(data).length);
        // We return a array with true/false as the last element, so length - 1
        for (i = 0; i < Object.keys(data).length - 1; i++) {
            console.log('check point 4');
            max++;
            if (max === 4) {
                break;
            }
            console.log(i);
            console.log(max);
            this.setState(({ posts }) => ({
                posts: [
                    ...posts.slice(0, i),
                    {
                        ...posts[i],
                        username: data[i].username,
                        post: data[i].content
                    },
                    ...posts.slice(i+1)
                ]
            }));
            console.log(this.state.posts);
        }
    }

    render() {
        return (
            <div>
                <h1><Link to="/login">Placeholder</Link></h1>
                <div className="wrapper">
                    <div className="pic1">
                        <img src="/doge.png" className='circular--square'/>
                    </div>
                    <div className="pic2">
                        <img src="/doge.png" className='circular--square'/>
                    </div>
                    <div className="pic3">
                        <img src="/doge.png" className='circular--square'/>
                    </div>
                    <div className="pic4">
                        <img src="/doge.png" className='circular--square'/>
                    </div>
                    {/* T block in CSS grid is a1 his */}
                    <div className="posta1">
                        <p>{this.state.posts[0].username}</p>
                        <p>{this.state.posts[0].userinfo}</p>
                    </div>
                    {/* T block in CSS grid is a2 his */}
                    <div className="posta2">
                        <p>{this.state.posts[0].post}</p>
                    </div>
                    {/* T block in CSS grid is b1 his */}
                    <div className="postb1">
                        <p>{this.state.posts[1].username}</p>
                        <p>{this.state.posts[1].userinfo}</p>
                    </div>
                    {/* T block in CSS grid is b2 his */}
                    <div className="postb2">
                        <p>{this.state.posts[1].post}</p>
                    </div>
                    {/* T block in CSS grid is c1 his */}
                    <div className="postc1">
                        <p>{this.state.posts[2].username}</p>
                        <p>{this.state.posts[2].userinfo}</p>
                    </div>
                    {/* T block in CSS grid is c2 his */}
                    <div className="postc2">
                        <p>{this.state.posts[2].post}</p>
                    </div>
                    {/* T block in CSS grid is d1 his */}
                    <div className="postd1">
                        <p>{this.state.posts[3].username}</p>
                        <p>{this.state.posts[3].userinfo}</p>
                    </div>
                    {/* T block in CSS grid is d2 his */}
                    <div className="postd2">
                        <p>{this.state.posts[3].post}</p>
                    </div>
                </div>
            </div>
        );
    }
}
