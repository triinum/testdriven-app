import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import UserStatus from '../UserStatus';


beforeAll(() => {
  global.localStorage = {
    getItem: () => 'someToken'
  };
});

let mock = new MockAdapter(axios);
let options = {
  headers: {
    Authorization: "Bearer someToken"
  }
}
mock.onGet(`${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`, options).reply(200, {
  data: {
    id: 1,
    username: 'aegaas',
    email: 'me@aaronegaas.com'
  }
});

xdescribe('Not Authenticated', () => {
  const testData = {
    isAuthenticated: false
  }
  it('UserStatus renders a message to login', () => {
    const wrapper = shallow(<UserStatus isAuthenticated={testData.isAuthenticated} />);
    const element = wrapper.find('p');
    expect(element.length).toBe(1);
    expect(element.get(0).props.children[0]).toContain('You must be logged in to view this.');
  });

  it('UserStatus renders a snapshot properly', () => {
    const tree = renderer.create(
      <Router><UserStatus isAuthenticated={false} /></Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

xdescribe('Authenticated', () => {
  const testData = {
    isAuthenticated: true
  }
  it('UserStatus renders a message to login', () => {
    const wrapper = shallow(<UserStatus isAuthenticated={testData.isAuthenticated} />);
    const element = wrapper.find('li span.value');
    expect(element.length).toBe(3);
    console.log(element.get(0).props.text)
    expect(element.get(0).props.children[0]).toContain('1');
    expect(element.get(1).props.children[0]).toContain('aegaas');
    expect(element.get(2).props.children[0]).toContain('me@aaronegaas.com');
  });

  it('UserStatus renders a snapshot properly', () => {
    const tree = renderer.create(
      <Router><UserStatus isAuthenticated={false} /></Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
