import React from 'react';

const Form = (props) => {
  return (
    <div>
      <h1>{props.formType}</h1>
      <hr /><br />
      <form onSubmit={(event) => props.handleUserSubmit(event)}>
        {props.formType === 'Register' &&
          <div className="form-group">
            <input
              name="username"
              className="form-control input.lg"
              type="text"
              placeholder="Username"
              required
              value={props.formData.username}
              onChange={props.handleFormChange}
            />
          </div>
        }
        <div className="form-group">
          <input
            name="email"
            className="form-control input.lg"
            type="email"
            placeholder="Email"
            required
            value={props.formData.email}
            onChange={props.handleFormChange}
          />
        </div>
        <div className="form-group">
          <input
            name="password"
            className="form-control input.lg"
            type="password"
            placeholder="Password"
            required
            value={props.formData.password}
            onChange={props.handleFormChange}
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary btn-lg btn-block"
          value={props.formType}
        />
      </form>
    </div>
  );
};

export default Form;
