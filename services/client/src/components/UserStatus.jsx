import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      id: "",
      username: "",
      active: "",
      admin: ""
    };
  }
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.getUserStatus();
    }
  }
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    };
    return axios(options)
      .then(res => {
        this.setState({
          email: res.data.data.email,
          id: res.data.data.id,
          username: res.data.data.username,
          active: String(res.data.data.active),
          admin: String(res.data.data.admin)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    if (!this.props.isAuthenticated) {
      return (
        <p>
          You must be logged in to view this. Click <Link to="/">here</Link> to
          log back in.
        </p>
      );
    }
    return (
      <div>
        <h1 className="title is-1">User Status</h1>
        <hr/>
        <br/>
        <ul>
          <li>
            <strong>User ID:</strong>
            <span className="value">{this.state.id}</span>
          </li>
          <li>
            <strong>Username:</strong>
            <span className="value">{this.state.username}</span>
          </li>
          <li>
            <strong>Email:</strong>
            <span className="value">{this.state.email}</span>
          </li>
          <li>
            <strong>Active:</strong>
            <span className="value">{this.state.active}</span>
          </li>
          <li>
            <strong>Admin:</strong>
            <span className="value">{this.state.admin}</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserStatus;
