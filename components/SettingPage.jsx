import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar.jsx';
import Avatar from 'react-avatar-edit';
import Switch from 'react-switch';
import { withAlert } from 'react-alert';
import { Redirect } from 'react-router-dom';
const owasp = require('owasp-password-strength-test');

class SettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true,
            preview: null,
            checked: false
        };

        this.onCrop = this.onCrop.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.onUpdateClick = this.onUpdateClick.bind(this);
        this.onUploadClick = this.onUploadClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onDownloadClick = this.onDownloadClick.bind(this);

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
        const result = owasp.test(this.password.current.value);
        if (!result.strong) {
            this.props.alert.error(result.errors.join('\n'));
            return;
        }

        const response = await fetch('http://localhost:8000/api/authenticate', {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: this.password.current.value })
        });

        const body = await response.json();

        if (!body.success) {
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

        const body = await response.json();
        if (!body.success) {alert.error('Failed to upload picture.');}
        else {this.props.alert.success('Success!');}
    }

    async onDeleteClick() {
        const response = await fetch('http://localhost:8000/api/user/delete', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: localStorage.getItem('token') })
        });

        const body = await response.json();
        if (!body.success) {alert.error('Failed to delete the account.');}
        else {
            localStorage.removeItem('token');
            this.props.alert.success('Your account has been deleted');
        }
    }

    async onDownloadClick() {
        const response = await fetch('http://localhost:8000/api/user/data', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: localStorage.getItem('token') })
        });

        const body = await response.json();
        if (!body.success) {alert.error('Failed to submit a data request.');}
        else {
            this.props.alert.success('A request for a copy of your data has been ' +
                'successfully submitted. You will receive an email when the data is ready.');
        }
    }

    render() {
        if (!this.state.loggedIn) {return <Redirect to='/login' />;}

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
                        <div className="row" style={{ marginTop: '10px' }}>
                            <Switch onChange={this.handleChange} checked={this.state.checked} />
                        </div>
                        <h2> Change your password </h2>
                        <div className="row" ref={this.message}></div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <input type="password" style={{ width: '16vw' }} placeholder="old password" />
                        </div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <input type="password" ref={this.password} style={{ width: '16vw' }}
                                placeholder="new password" />
                        </div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <button className="fill" onClick={this.onUpdateClick}
                                style={{ width: '50%' }}> Update Password</button>
                        </div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <button className="fill" onClick={this.onDeleteClick}
                                style={{ width: '50%' }}> delete account </button>
                        </div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <button className="fill" onClick={this.onDownloadClick}
                                style={{ width: '50%' }}> Request a copy of my data </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SettingPage.propTypes = {
    user: PropTypes.object.isRequired,
    alert: PropTypes.object
};

export default withAlert()(SettingPage);

