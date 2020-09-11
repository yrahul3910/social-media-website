import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar.jsx';
import Avatar from 'react-avatar-edit';
import Switch from 'react-switch';


class SettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preview: null,
            checked: false
        };

        this.onCrop = this.onCrop.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.password = React.createRef();
        this.message = React.createRef();
        this.setState.preview = React.createRef();
    }

    onClose() {
        this.setState({ preview: null });
    }

    onCrop(preview) {
        this.setState({ preview });
    }

    handleChange(checked) {
        this.setState({ checked });
    }

    async onUpdateClick() {
        const response = await fetch('http://localhost:8000/api/authenticate', {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: this.password.current.value })
        });

        if (!response.success) {
            this.message.current.innerHTML =
                '<p style=\'color: \'red\'>Failed to change password</p>';
        }
        else {this.message.current.innerHTML = '<p> style=\'color: \'green\'>Success!</p>';}
    }

    async onUploadClick() {
        const response = await fetch('http://localhost:8000/api/profileImage', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileImage: this.state.preview })
        });

        const data = response.json();

        if (!data.success) {this.message.current.innerHTML = `<span style='color: red'>${data.message}</span>`;}
        else {
            this.message.current.innerHTML = `<span style='color: green'>${data.message}</span>`;

            localStorage.setItem('token', data.token);
            this.props.toggleLogin(data.user);
            this.setState({ loggedIn: true });
        }
    }

    render() {
        return (
            <div>
                <Navbar dp={this.props.user ?
                    this.props.user.dp :
                    'http://localhost:8000/account_circle.png'} />
                <div className="row" style={{ marginTop: '70px' }}>
                    <div className="col-4 col-gap-8" >
                        <h2> Upload your profile image </h2>
                        <Avatar
                            width={300}
                            height={300}
                            onCrop={this.onCrop}
                            onClose={this.onClose}
                        />
                        <img className="galimage" src={this.state.preview} alt="Preview" />
                        <button className="fill" onClick={this.onUploadClick} style={{ width: '25%' }}> Upload </button>
                    </div>
                    <div className="col-4 col-gap-9" >
                        <h2> Make your profile public? </h2>
                        <div className="row">
                            <Switch onChange={this.handleChange} checked={this.state.checked} />
                        </div>
                        <h2> Change your password </h2>
                        <div className="row" ref={this.message}></div>
                        <div className="row" style={{ marginTop: '5px' }}>
                            <input type="password" style={{ width: '16vw' }} placeholder="old password" />
                        </div>
                        <div className="row" style={{ marginTop: '5px' }}>
                            <input type="password" style={{ width: '16vw' }} placeholder="new password" />
                        </div>
                        <div className="row" style={{ marginTop: '5px' }}>
                            <button className="fill" onClick={this.onUpdateClick}
                                style={{ width: '25%' }}> Update </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SettingPage.propTypes = {
    toggleLogin: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

export default SettingPage;

