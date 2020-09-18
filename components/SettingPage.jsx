import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar.jsx';
import Avatar from 'react-avatar-edit';
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
        this.onPrivacyChange = this.onPrivacyChange.bind(this);

        this.newPassword = React.createRef();
        this.newPasswordVerify = React.createRef();
        this.message = React.createRef();
        this.setState.preview = React.createRef();
        this.privacy = React.createRef();
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

    async onPrivacyChange() {
        const response = await fetch('/api/user/privacy', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                to: this.privacy.current.value.split(' (')[0].toLowerCase()
            })
        });

        const data = await response.json();
        if (data.success) {this.props.alert.success('Successfully changed!');}
        else {this.props.alert.error('Failed to change setting.');}
    }

    async onUpdateClick() {
        if (this.newPassword.current.value !== this.newPasswordVerify.current.value) {
            this.props.alert.error('Passwords do not match.');
            return;
        }

        const result = owasp.test(this.newPassword.current.value);
        if (!result.strong) {
            this.props.alert.error(result.errors.join('\n'));
            return;
        }

        const response = await fetch('/api/authenticate', {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: this.newPassword.current.value })
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
            <main>
                <Navbar user={this.props.user} />
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
                            <select onChange={this.onPrivacyChange} ref={this.privacy}>
                                <option>Private (Default)</option>
                                <option>Protected (Recommended)</option>
                                <option>Public (Not recommended)</option>
                            </select>
                        </div>
                        <h2> Change your password </h2>
                        <div className="row" ref={this.message}></div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <input type="password" ref={this.newPassword}
                                style={{ width: '16vw' }} placeholder="old password" />
                        </div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <input type="password" ref={this.newPasswordVerify} style={{ width: '16vw' }}
                                placeholder="new password" />
                        </div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <button className="fill" onClick={this.onUpdateClick}
                                style={{ width: '50%' }}> Update Password</button>
                        </div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <button className="fill" onClick={this.onDeleteClick}
                                style={{ width: '50%' }}> Delete account </button>
                        </div>
                        <div className="row" style={{ marginTop: '10px' }}>
                            <button className="fill" onClick={this.onDownloadClick}
                                style={{ width: '50%' }}> Request a copy of my data </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

SettingPage.propTypes = {
    user: PropTypes.object.isRequired,
    alert: PropTypes.object
};

export default withAlert()(SettingPage);

