import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Form from '../Form'

const testData = [
  {
    formType: 'Register',
    formData: {
      username: '',
      email: '',
      password: ''
    }
  },
  {
    formType: 'Login',
    formData: {
      email: '',
      password: ''
    }
  }
];

testData.forEach((el) => {
  test(`${el.formType} Form renders properly`, () => {
    const component = <Form formType={el.formType} formData={el.formData} />;
    const wrapper = shallow(component);
    const h1 = wrapper.find('h1');
    expect(h1.length).toBe(1);
    expect(h1.get(0).props.children).toBe(el.formType);

    const formGroup = wrapper.find('.form-group')
    expect(formGroup.length).toBe(Object.keys(el.formData).length);

    // fields
    let index = 0;
    for(let [field,value] of Object.entries(el.formData)) {
      expect(formGroup.get(index).props.children.props.name).toBe(field);
      expect(formGroup.get(index).props.children.props.value).toBe(value);
      index++;
    }

    // submit
    const submit = wrapper.find('input.btn');
    expect(submit.length).toBe(1);
    expect(submit.get(0).props.value).toBe(el.formType);
  });

  test(`{el.formTyppe} Form renders a snapshot properly`, () => {
    const component = <Form formType={el.formType} formData={el.formData} />;
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
