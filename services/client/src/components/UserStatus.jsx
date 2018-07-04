import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class UserStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      id: "",
      username: ""
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
          username: res.data.data.username
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    if (!this.props.isAuthenticated) {
      return (
        <p>You must be logged in to view this. Click <Link to="/">here</Link> to log back in.</p>
      )
    }
    return (
      <div>
        <ul>
          <li>
            <strong>ID:</strong>
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
        </ul>
      </div>
    );
  }
}

export default UserStatus;
