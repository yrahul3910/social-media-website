import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';
import Login from '../../components/Login.jsx';
import Navbar from '../../components/Navbar.jsx';
import { Redirect } from 'react-router-dom';

describe('<Login />', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<Login user={null} />);
        expect(wrapper.find(Navbar).dive()).to.have.lengthOf(1);
        expect(wrapper.find('input')).to.have.lengthOf(2);
        expect(wrapper.find('button').length).to.equal(1);
    });

    it('redirects when logged in', () => {
        const wrapper = shallow(<Login user={{ name: 'User' }} />);
        expect(wrapper.find(Redirect).dive()).to.have.lengthOf(1);
    });
});

