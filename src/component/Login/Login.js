import React, { Component } from 'react';
import classes from './Login.css';
import { Route } from "react-router-dom";
import DataList from '../DataList/DataList';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            fields: {},
            errors: {},
            show: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.submituserLoginForm = this.submituserLoginForm.bind(this);
    };
    handleChange(e) {
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({
            fields
        });
    }

    //let history = useHistory();
    submituserLoginForm = (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            if (this.state.fields["username"] !== 'dipen' || this.state.fields["password"] !== 'Dipen@123') {
                alert("Invalid username or passwprd");
            }
            else {
                localStorage.setItem('authenticated', true);
                this.props.history.push('/DataGrid/DataList');
            }
            // let fields = {};
            // fields["username"] = "";
            // fields["password"] = "";
            // this.setState({ fields: fields });
            // alert("Form submitted");
            //<Redirect to="../DataGrid/DataList" />
        }
    }

    validateForm() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["username"]) {
            formIsValid = false;
            errors["username"] = "*Please enter your username.";
        }

        if (typeof fields["username"] !== "undefined") {
            if (!fields["username"].match(/^[a-zA-Z ]*$/)) {
                formIsValid = false;
                errors["username"] = "*Please enter alphabet characters only.";
            }
        }

        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "*Please enter your password.";
        }

        if (typeof fields["password"] !== "undefined") {
            if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
                formIsValid = false;
                errors["password"] = "*Please enter secure and strong password.";
            }
        }

        this.setState({
            errors: errors
        });
        return formIsValid;
    }

    passwordChangeHandler = () => {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        console.log('OK');
        if (!fields["password"]) {
            console.log('OK');
            formIsValid = false;
            errors["password"] = "*Please enter your password.";
            this.setState({
                errors: errors
            });
            return formIsValid;
        }
        else if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
            console.log('OK');
            formIsValid = false;
            errors["password"] = "*Please enter secure and strong password.";
            this.setState({
                errors: errors
            });
            return formIsValid;
        }
        else {
            console.log('OK');
            localStorage.setItem('authenticated', true);
            this.props.history.push("../DataGrid/DataList");
        }
    }

    showForgotPassword = () => {
        this.setState({
            show: true
        });
    }

    render() {
        return (
            <div id={classes.Register}>
                {
                    this.state.show
                        ? <>
                            <label>New Password</label>
                            <input type="password" name="password" value={this.state.fields.password} onChange={this.handleChange} />
                            <div className={classes.errorMsg}>{this.state.errors.password}</div>
                            <button onClick={this.passwordChangeHandler} className={classes.btnForgorPass}>Change password</button>
                        </>
                        : <>
                            <div id={classes.login}>
                                <h3>Login page</h3>
                                <form method="post" name="userLoginForm" onSubmit={this.submituserLoginForm} >
                                    <label>Name</label>
                                    <input type="text" name="username" value={this.state.fields.username} onChange={this.handleChange} />
                                    <div className={classes.errorMsg}>{this.state.errors.username}</div>
                                    <label>Password</label>
                                    <input type="password" name="password" value={this.state.fields.password} onChange={this.handleChange} />
                                    <div className={classes.errorMsg}>{this.state.errors.password}</div>
                                    <input type="submit" className={classes.button} value="Login" />
                                    <p><button onClick={this.showForgotPassword} className={classes.btnForgorPass}>Forgot Password?</button></p>
                                </form>
                            </div>
                        </>
                }
                <Route path="/DataGrid/DataList" exact component={DataList} />
            </div>
        );
    }
}

export default LoginForm;