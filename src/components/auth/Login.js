import React, { Component } from 'react';
import axios from 'axios';
import '../../stylesheets/login.css';
import swal from 'sweetalert2'
import {Redirect} from 'react-router-dom'
import addCookie from '../../actions/addCookie';
import { connect } from 'react-redux'; 
import addCurrentRepo from '../../actions/addCurrentRepo';
class Login extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            redirect: false,
            profile: [],
            commit_data: []
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

        axios.post('/api/user/login',{
            username: this.state.username,
            password: this.state.password,
        })
        .then(
            (res) => {
                this.props.cookie(res.data.payload.username,res.data.payload.gitName,res.data.payload.imgURL);
                    localStorage.setItem('token', res.data.token);
                    this.getCurrentRepo(res.data.payload.gitName);
            })
               .then(()=>{
                swal({
                    title: "You are logged in",
                    text: "Login successful",
                    type: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
            }).catch((res) => {
                console.log(res.data)
                swal({
                    title: "Error",
                    text: "Wrong username or password",
                    type: "error",
                    confirmButtonText: "Try again"
                });
            });
           ;

    }

    getCurrentRepo(gitName){
        console.log("GIT :", gitName);
        axios({
            url: '/api/git/currrepo',
            method: 'post',
            data: {
                username: gitName,
            },
            headers: {
                Authorization: localStorage.token
            }
        }).then(res => {
            axios({
                url: '/api/git/repoinfo',
                method: 'post',
                data: {
                    username: gitName,
                    repository: res.data
                },
                headers: {
                    Authorization: localStorage.token
                }
            }).then(res => {
                console.log('profile',res.data.reponame);
                this.getCurrentCommit(gitName,res.data.reponame,res.data);
            }
            ).then(()=>{
                
            })
           
        });  
    }

    getCurrentCommit(gitName,repoName,profile){
        console.log('Gitname',gitName);
        console.log('reponame',repoName);
        axios({
                    url: '/api/git/commits',
                    method: 'post',
                    data: {
                        username: gitName,
                        repository: repoName
                    },
                    headers: {
                        Authorization: localStorage.token
                    }
                })
                .then(res => {
                    console.log('commit',res.data);
                    this.setState({
                        commit_data: res.data
                    })
                    if( res.data!== [])
                        this.props.current_repo(profile,res.data)
                })
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
            <h1 id="header-text">ANDON MONITOR</h1>
            <div id="login-div">
            
                <form onSubmit={this.onSubmit}>
                {/* <label>Username</label> */}
                    <input  type="text" name="username" required   autoComplete="off" placeholder="Username" onChange={this.onChange}/>
                {/* <label>Password</label> */}
                    <input  type="password" placeholder="Password" required autoComplete="off"  name="password" value={this.state.password} onChange={this.onChange}></input>
                    <input id="submitBtn" type="submit" value="Login"/>
                </form>
                <a href="/register">Not a member? </a>
                </div>
            </div>
        )
    }
    }
}

function mapDispatchToProps(dispatch){
    return {
       cookie: (username,gitName, imgURL) => dispatch(addCookie(username,gitName,imgURL)),
       current_repo: (profile,commit_data) => dispatch(addCurrentRepo(profile,commit_data))
    }
}


export default connect(null,mapDispatchToProps)(Login);
