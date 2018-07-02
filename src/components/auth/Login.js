import React, { Component } from 'react';
import axios from 'axios';
import '../../stylesheets/login.css';
import swal from 'sweetalert2'
import {Redirect} from 'react-router-dom'
import addCookie from '../../actions/addCookie';
import { connect } from 'react-redux'; 
class Login extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            redirect: false,
            profile: []
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    isAuthenticated(){
        const token = localStorage.getItem('token');
        return token && token.length > 10;
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password,
        }
        console.log(user);

        axios.post('http://localhost:5000/api/user/login',{
            username: this.state.username,
            password: this.state.password,
        })
        .then(
            (res) => {
                this.props.cookie(res.data.payload.username,res.data.payload.imgURL);
                localStorage.setItem('token', res.data.token);
                console.log('token: ',localStorage.token);
            swal({
                title: "Success",
                text: "Login successful",
                type: "success",
                confirmButtonText: "OK"
            })
            .then((res) => {
                this.props.history.push("/monitor");
            })
        })
        .catch((res) => {
            console.log(res.data)
            swal({
                title: "Error",
                text: "Wrong username or password",
                type: "error",
                confirmButtonText: "Try again"
            });
        });
    }

    render() {

        const isAlreadyAuthenticated = this.isAuthenticated();
        if( isAlreadyAuthenticated){
        return (
            <Redirect to={{ pathname: '/monitor'}}  /> 
        )
        }
        else {
        return (
            <div className="parallax">
            <div id="login-div">
                <form onSubmit={this.onSubmit}>
                {/* <label>Username</label> */}
                    <input  type="text" name="username" required   autoComplete="off" placeholder="Username" onChange={this.onChange}/>
                {/* <label>Password</label> */}
                    <input  type="password" placeholder="Password" required autoComplete="off"  name="password" value={this.state.password} onChange={this.onChange}></input>
                    <input id="submitBtn" type="submit"/>
                </form>
                </div>
            </div>
        )
    }
    }
}

function mapDispatchToProps(dispatch){
    return {
       cookie: (username, imgURL) => dispatch(addCookie(username,imgURL)),
    }
}


export default connect(null,mapDispatchToProps)(Login);
// export default (Login);