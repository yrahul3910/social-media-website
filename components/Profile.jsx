import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar.jsx';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.user = {
            name: 'FirstName LastName',
            post: 'Some posts',
            checked: true
        };
    }

    render() {
        return (
            <div>
                <Navbar dp={this.props.user ?
                    this.props.user.dp :
                    'http://localhost:8000/account_circle.png'}/>
                <div className="row" style={{ marginTop: '70px' }}>
                    <div className="col-4 col-gap-8">
                        <img src="/invisible-person.png" style={{
                            width: '200px',
                            height: '200px'
                        }}/>
                    </div>
                    <div className="col-4 col-gap-9">
                        <h2> Name </h2>
                        <div className="row" style={{ marginTop: '5px' }}>
                            <p> {this.user.name} </p>
                        </div>
                        <h2> Public profile </h2>
                        <div className="row" style={{ marginTop: '5px' }}>
                            <p>{this.user.checked ?
                                'Yes' :
                                'No'}</p>
                        </div>
                    </div>
                </div>
                <div className="row" style={{
                    marginTop: '40px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div className="col">
                        <h2>
                            {this.user.post}
                        </h2>
                        <p>
                            {this.user.post}
                        </p>
                        <img src="/doge.png"/>
                    </div>
                </div>
            </div>
        );
    }
}

Profile.propTypes = { user: PropTypes.object };

