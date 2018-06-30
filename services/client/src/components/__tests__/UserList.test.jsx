import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import UserList from '../UserList';

const users = [
    {
        id: 1,
        username: 'zoey',
        email: 'z@aaronegaas.com',
        active: true
    },
    {
        id: 2,
        username: 'dexter',
        email: 'd@aaronegaas.com',
        active: true
    }
];

test('UserList renders properly', () => {
    const wrapper = shallow(<UserList users={users}/>);
    const element = wrapper.find('h4');
    expect(element.length).toBe(2);
    expect(element.get(0).props.className).toBe('well')
    expect(element.get(0).props.children).toBe('zoey')
});

test('UserList renders a snapshot properly', () => {
    const tree = renderer.create(<UserList users={users}/>).toJSON();
    expect(tree).toMatchSnapshot();
});
