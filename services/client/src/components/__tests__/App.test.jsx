import React from 'react';
import { shallow } from 'enzyme';

import App from '../App';

test('App loads without crashing', () => {
  const wrapper = shallow(<App />)
});
