import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";

import UserList from "../UserList";

const users = [
  {
    id: 1,
    username: "zoey",
    email: "z@aaronegaas.com",
    active: true,
    admin: false
  },
  {
    id: 2,
    username: "dexter",
    email: "d@aaronegaas.com",
    active: true,
    admin: false
  }
];

test("UserList renders properly", () => {
  const wrapper = shallow(<UserList users={users} />);
  expect(wrapper.find("h1").get(0).props.children).toBe("All Users");
  // table
  const table = wrapper.find("Table");
  expect(table.length).toBe(1);
  expect(table.get(0).props.striped).toBe(true);
  expect(table.get(0).props.bordered).toBe(true);
  expect(table.get(0).props.condensed).toBe(true);
  expect(table.get(0).props.hover).toBe(true);

  // table head
  expect(wrapper.find("thead").length).toBe(1);
  const th = wrapper.find("th");
  expect(th.length).toBe(5);
  expect(th.get(0).props.children).toBe("User ID");
  expect(th.get(1).props.children).toBe("Email");
  expect(th.get(2).props.children).toBe("Username");
  expect(th.get(3).props.children).toBe("Active");
  expect(th.get(4).props.children).toBe("Admin");

  // table body
  expect(wrapper.find('tbody').length).toBe(1);
  expect(wrapper.find('tbody > tr').length).toBe(2);
  const td = wrapper.find('tbody > tr > td');
  expect(td.length).toBe(10);
  expect(td.get(0).props.children).toBe(1);
  expect(td.get(1).props.children).toBe('z@aaronegaas.com');
  expect(td.get(2).props.children).toBe('zoey');
  expect(td.get(3).props.children).toBe('true');
  expect(td.get(4).props.children).toBe('false');
});

test("UserList renders a snapshot properly", () => {
  const tree = renderer.create(<UserList users={users} />).toJSON();
  expect(tree).toMatchSnapshot();
});
