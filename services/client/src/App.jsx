import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";

import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import About from "./components/About";
import Form from "./components/Form";
import Logout from "./components/Logout";
import UserStatus from "./components/UserStatus";

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      username: "",
      email: "",
      title: 'TestDriven.io',
      formData: {
        username: '',
        email: '',
        password: ''
      },
      isAuthenticated: false
    };
    this.addUser = this.addUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }
  componentDidMount() {
    this.getUsers();
    if (window.localStorage.authToken) {
      this.setState({
        isAuthenticated: true
      });
    }
  }
  logoutUser() {
    window.localStorage.clear();
    this.setState({ isAuthenticated: false });
  }
  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => {
        this.setState({ users: res.data.data.users });
      })
      .catch(err => {
        console.log(err.message);
      });
  }
  addUser(event) {
    event.preventDefault();

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
        console.log(err.messgae);
    });
  }
  handleChange(event) {
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    return true;
  }
  handleFormChange(event) {
    const obj = this.state.formData;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }
  handleUserFormSubmit(event) {
    event.preventDefault();
    const formType = window.location.href.split('/').reverse()[0];
    let data = {
      email: this.state.formData.email,
      password: this.state.formData.password
    }
    console.log(formType);
    if (formType === 'register') {
      data.username = this.state.formData.username;
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`;
    axios.post(url, data)
    .then((res) => {
      console.log(res.data);
      this.setState({
        formData: {username: '', email: '', password: ''},
        username: '',
        email: '',
        isAuthenticated: true
      });
      window.localStorage.setItem('authToken', res.data.auth_token);
      this.getUsers();
    })
    .catch((err) => {
      console.log(err);
    });
  }
  render() {
    return (
      <div>
        <NavBar
          title={this.state.title}
          isAuthenticated={this.state.isAuthenticated}
        />
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <br />
              <Switch>
                <Route exact path='/register' render={() => (
                  <Form
                  formType={'Register'}
                  formData={this.state.formData}
                  handleFormChange={this.handleFormChange}
                  handleUserFormSubmit={this.handleUserFormSubmit}
                  isAuthenticated={this.state.isAuthenticated}
                  />
                )} />
                <Route exact path='/login' render={() => (
                  <Form
                  formType={'Login'}
                  formData={this.state.formData}
                  handleFormChange={this.handleFormChange}
                  handleUserFormSubmit={this.handleUserFormSubmit}
                  isAuthenticated={this.state.isAuthenticated}
                  />
                )} />
                <Route exact path='/' render={() => (
                  <div>
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
                )} />
                <Route exact path='/about' render={About} />
                <Route exact path='/status' render={() => (
                  <UserStatus isAuthenticated={this.state.isAuthenticated} />
                 )} />
                <Route exact path='/logout' render={() => (
                  <Logout
                    logoutUser={this.logoutUser}
                    isAuthenticated={this.state.isAuthenticated}
                  />
                )} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
