import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";

import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import About from "./components/About";
import Form from "./components/forms/Form";
import Logout from "./components/Logout";
import UserStatus from "./components/UserStatus";
import Message from "./components/Message";

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
      isAuthenticated: false,
      messageName: null,
      messageType: null
    };
    // this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
  }
  componentDidMount() {
    this.getUsers();
    if (window.localStorage.authToken) {
      this.setState({
        isAuthenticated: true
      });
    }
  }
  UNSAFE_componentWillMount() {
    if (window.localStorage.getItem('authToken')) {
      this.setState({ isAuthenticated: true });
    };
  }
  loginUser(token) {
    window.localStorage.setItem('authToken', token);
    this.setState({ isAuthenticated: true })
    this.getUsers();
    this.createMessage('Welcome!', 'success');
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
  createMessage(name = 'Sanity Check', type = 'success') {
    this.setState({
      messageName: name,
      messageType: type
    });
    setTimeout(() => {
      this.removeMessage();
    }, 3000);
  }
  removeMessage() {
    this.setState({
      messageName: null,
      messageType: null
    });
  }
  render() {
    return (
      <div>
        <NavBar
          title={this.state.title}
          isAuthenticated={this.state.isAuthenticated}
        />
        <section className="section">
          <div className="container">
            {this.state.messageName && this.state.messageType &&
              <Message
                messageName={this.state.messageName}
                messageType={this.state.messageType}
                removeMessage={this.removeMessage}
              />
            }
            <div className="columns">
              <div className="column">
                <br />
                <Switch>
                  <Route exact path='/register' render={() => (
                    <Form
                      formType={'Register'}
                      isAuthenticated={this.state.isAuthenticated}
                      loginUser={this.loginUser.bind(this)}
                      createMessage={this.createMessage}
                    />
                  )} />
                  <Route exact path='/login' render={() => (
                    <Form
                      formType={'Login'}
                      isAuthenticated={this.state.isAuthenticated}
                      loginUser={this.loginUser.bind(this)}
                      createMessage={this.createMessage}
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
        </section>
      </div>
    );
  }
}

export default App;
