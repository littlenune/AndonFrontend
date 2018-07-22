import React, { Component } from 'react';
import axios from 'axios';
import '../../stylesheets/login.css';
import swal from 'sweetalert2'
import {Redirect} from 'react-router-dom'
import addCookie from '../../actions/addCookie';
import { connect } from 'react-redux'; 
import addCurrentRepo from '../../actions/addCurrentRepo';
import addStatus from '../../actions/addStatus';
class Login extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            redirect_status: true,
            profile: [],
            commit_data: [],
            git_status: true
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    isAuthenticated(){
        const token = sessionStorage.getItem('token');
        return token && token.length > 10;
    }

    onSubmit(e) {
        e.preventDefault();

        axios.post('/api/user/login',{
            username: this.state.username,
            password: this.state.password,
        })
        .then(
            (res) => {
                this.props.update_status(false);
                    sessionStorage.setItem('token', res.data.token);
                    this.getCurrentRepo(res.data.payload.username,res.data.payload.gitName);
            })
               .then(()=>{
                swal({
                    title: "You are logged in",
                    text: "Login successful",
                    type: "success",
                    showConfirmButton: false,
                    timer: 3000
                })
            }).catch((res) => {
                swal({
                    title: "Error",
                    text: "Wrong username or password",
                    type: "error",
                    confirmButtonText: "Try again"
                });
            });
    }

    getCurrentRepo(username,gitName){
        axios({
            url: '/api/git/currrepo',
            method: 'post',
            data: {
                username: gitName,
            },
            headers: {
                Authorization: sessionStorage.token
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
                    Authorization: sessionStorage.token
                }
            }).then(res => {
                console.log("current info",res);
                this.getCurrentCommit(gitName,res.data.reponame,res.data);
                this.props.cookie(username,gitName,res.data.image_url);
            }
            )
           
        });  
    }

    getCurrentCommit(gitName,repoName,profile){
        axios({
                    url: '/api/git/commits',
                    method: 'post',
                    data: {
                        username: gitName,
                        repository: repoName
                    },
                    headers: {
                        Authorization: sessionStorage.token
                    }
                })
                .then(res => {
                    if(res.data === 'Information Not found'){
                        this.setState({ redirect_status: false})
                    }
                    else {
                    this.setState({
                        commit_data: res.data
                    })
                    if( res.data!== [])
                        this.props.current_repo(profile,res.data)
                }
                })
    }

    render() {

        const isAlreadyAuthenticated = this.isAuthenticated();
        if( isAlreadyAuthenticated && this.state.redirect_status ){
        return (
            <Redirect to={{ pathname: '/monitor'}}  /> 
            )
        }
        else {
            return (
                <div className="parallax">
                <div className="typewriter">
                    <h1 id="header-text">ANDON MONITOR</h1>
                </div>
                <div id="login-div">            
                    <form onSubmit={this.onSubmit}>
                        <input  type="text" name="username" required   autoComplete="off" placeholder="Username" onChange={this.onChange}/>
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
       current_repo: (profile,commit_data) => dispatch(addCurrentRepo(profile,commit_data)),
       update_status: (status) => dispatch(addStatus(status))
    }
}




export default connect(null,mapDispatchToProps)(Login);
