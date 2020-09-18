import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';
import Register from '../../components/Register.jsx';

describe('<Register />', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<Register user={null} />);
        expect(wrapper.find('input').length).to.equal(3);
        expect(wrapper.find('button').length).to.equal(1);
    });
});

