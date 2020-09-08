import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from './Navbar.jsx';
import Avatar from 'react-avatar-edit';
import Switch from "react-switch";


export default class SettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          preview: null,
          checked: false
        }
        this.onCrop = this.onCrop.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onClose() {
      this.setState({preview: null})
    }

	onCrop(preview) {
    	this.setState({preview})
    }

    handleChange(checked) {
    	this.setState({ checked });
    }

    render() {
        return (
			<div>
				<Navbar dp={this.props.user ? this.props.user.dp : 'http://localhost:8000/account_circle.png'} />
                <div className="row" style={{marginTop: '70px'}}>
                	<div className="col-4 col-gap-8">
                	<h2> Upload your profile image </h2>
			        <Avatar
                      width={300}
                      height={200}
                      onCrop={this.onCrop}
                      onClose={this.onClose}
                    />
                    <img class = "galimage" src={this.state.preview} alt="Preview" />
                    </div>
                	<div className="col-6 col-gap-9">
                		<h2> Make your profile public? </h2>
                		<div class="row">
                			<Switch onChange={this.handleChange} checked={this.state.checked} />
                		</div>
                		<h2> change your password </h2>
                		<div class="row">
                			<input type="password" style={{width: '15vw'}} placeholder="old password, min 8 character" />
                		</div>
                		<div class="row">
                			<input type="password" style={{width: '15vw'}} placeholder="new password, min 8 character" />
                		</div>
                    </div>
                </div>
			</div>
        );
    }
}
