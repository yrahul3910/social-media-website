import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';

describe('<Sidebar />', () => {
    it('renders correctly when empty', () => {
        const wrapper = shallow(<Sidebar />);
        expect(wrapper.find('ul').length).to.equal(1);
        expect(wrapper.find('li').length).to.equal(1);
    });

    it('renders correctly with one child', () => {
        const wrapper = shallow(<Sidebar><div></div></Sidebar>);
        expect(wrapper.find('li').length).to.equal(2);
    });
});

