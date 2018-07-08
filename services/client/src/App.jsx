import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";

import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import About from "./components/About";
import Form from "./components/forms/Form";
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
    // this.loginUser = this.loginUser.bind(this);
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
  loginUser(token) {
    window.localStorage.setItem('authToken', token);
    this.setState({ isAuthenticated: true })
    this.getUsers();
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
                  formType={'register'}
                  isAuthenticated={this.state.isAuthenticated}
                  loginUser={this.loginUser.bind(this)}
                  />
                )} />
                <Route exact path='/login' render={() => (
                  <Form
                    formType={'login'}
                    isAuthenticated={this.state.isAuthenticated}
                    loginUser={this.loginUser.bind(this)}
                  />
                )} />
                <Route exact path='/' render={() => (
                  <div>
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
