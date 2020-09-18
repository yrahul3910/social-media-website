import React from 'react';
import PropTypes from 'prop-types';

class Post extends React.Component {
    constructor(props) {
        super(props);

        this.collapse = this.collapse.bind(this);
        this.post = React.createRef();
    }

    collapse() {
        this.post.current.classList.toggle('collapsed');
    }

    render() {
        return (
            <div ref={this.post} className='post'>
                <div onClick={this.collapse} className='post-header'>
                    <img src={this.props.dp} />
                    <div className='poster-details'>
                        <span className='poster-name'>{this.props.name}</span>
                        <span className='poster-username'>
                            <a href={this.props.username === this.props.currentUsername ?
                                '/profile' :
                                `/user/${this.props.username}`}>
                                @{this.props.username}
                            </a>
                        </span>
                    </div>
                </div>
                <div className='post-body'>
                    {this.props.content}
                </div>
            </div>
        );
    }
}

Post.propTypes = {
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    dp: PropTypes.string,
    currentUsername: PropTypes.string.isRequired
};

export default Post;
