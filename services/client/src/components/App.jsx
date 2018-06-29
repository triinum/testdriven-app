import React, { Component } from "react";
import axios from "axios";

import UserList from "./UserList";
import AddUser from "./AddUser";

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      username: "",
      email: ""
    };
    this.addUser = this.addUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.getUsers();
  }
  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => {
        this.setState({ users: res.data.data.users });
      })
      .catch(err => {
        console.error(err);
      });
  }
  addUser(event) {
    event.preventDefault();
    console.log("sanity check!");
    console.log(this.state);

    const data = {
        username: this.state.username,
        email: this.state.email
    };
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
        .then((res) => {
            this.getUsers();
            this.setState({ username: '', email: '' });
        })
        .catch((err) => {
            console.error(err);
        });
  }
  handleChange(event) {
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <br />
            <h1>All Users</h1>
            <hr />
            <br />
            <AddUser
              username={this.state.username}
              email={this.state.email}
              handleChange={this.handleChange}
              addUser={this.addUser}
            />
            <br />
            <UserList users={this.state.users} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
