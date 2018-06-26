import React from 'react';

const AddUser = (props) => {
    return (
        <form onSubmit={(event) => props.addUser(event)}>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control input-lg"
                    name="username"
                    placeholder="Enter a username"
                    value={props.username}
                    onChange={props.handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="email"
                    className="form-control input-lg"
                    name="email"
                    placeholder="Enter an email"
                    value={props.email}
                    onChange={props.handleChange}
                    required
                />
            </div>
            <input
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                value="Add User" />
        </form>
    )
};

export default AddUser;
