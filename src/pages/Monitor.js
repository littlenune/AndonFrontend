import React, {Component} from 'react';
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip} from 'recharts';
import NotificationCard from '../components/NotificationCard';
import { connect } from 'react-redux'
import swal from 'sweetalert2';
import '../stylesheets/search.css';
import '../stylesheets/sidebar.css';
import '../stylesheets/dataCard.css';
import logo from '../res/andon.png';


class Monitor extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            disabled: false,
            text: 'Watch',
            repo_url: '',
            imgURL: '../../image-url/'+this.props.profile_img,
            username: '',
            profileUsername: '',
            gitName: '',
            profile: '',
            commit_data: '',
            currrepo: '',
            current_profile: [],
            current_commit: [],
            watch_status: false,
        }
        // this.getRepo();
        // console.log(this.props.profile_img);
        // console.log(this.state.imgURL);
        // console.log(this.props.gitName);
        // this.getCurrentRepo();

    }
    componentDidMount(){
        
    }

    // getRepo(){
    //     console.log('gitname : ',this.props.gitName);
    //     axios({
    //         url: '/api/git/currrepo',
    //         method: 'post',
    //         data: {
    //             username: this.props.gitName,
    //         },
    //         headers: {
    //             Authorization: localStorage.token
    //         }
    //     }) .then(res => {
    //         axios({
    //             url: '/api/git/repoinfo',
    //             method: 'post',
    //             data: {
    //                 username: this.props.gitName,
    //                 repository: res.data
    //             },
    //             headers: {
    //                 Authorization: localStorage.token
    //             }
    //         }).then(res => {
    //             const profile = res.data;
    //             this.setState({ profile});
    //         }
    //         );
    //     });  
    // }


    getCurrentRepo(){
       
        axios({
            url: '/api/git/repoinfo',
            method: 'post',
            data: {
                username: this.props.gitName,
                repository: this.state.currrepo
            },
            headers: {
                Authorization: localStorage.token
            }
        }).then(res => {
            const profile = res.data;
            this.setState({ profile});
        }
        );
        // axios({
        //     url: '/api/git/commits',
        //     method: 'post',
        //     data: {
        //         username: this.props.profileUsername,
        //         repository: this.props.gitName
        //     },
        //     headers: {
        //         Authorization: localStorage.token
        //     }
        // })
        // .then(res => {
        //     const commit_data = res.data;
        //     this.setState({ commit_data });
        // })
    }
    isAuthenticated(){
        const token = localStorage.getItem('token');
        return token && token.length > 10;
    }
    watchRepo(e){
        if( this.state.username === '' || this.state.repo_url === '' ){
            swal({
                title: "Information Required!",
                text: "Please fill in both informations",
                type: 'error'
            })
        }
        else {
              if(this.state.text === 'Watch'){
            axios({
                url: '/api/git/repoinfo',
                method: 'post',
                data: {
                    username: this.state.username,
                    repository: this.state.repo_url
                },
                headers: {
                    Authorization: localStorage.token
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data === 'Information not found'){
                    swal({
                        title: "Username or Repository name not found",
                        text: "Please enter valid username or organization name and repository name",
                        type: "error",
                    });
                }
                else { 
                    window.scrollTo(0, 0);
                    this.setState( {disabled: !this.state.disabled});
                    const profile = res.data;
                    this.setState({ profile});
                    this.setState({text: 'Unwatch'})
                    swal({
                        title: "Git repository is now watched",
                        type: "success"
                    })
                    axios({
                        url: '/api/git/commits',
                        method: 'post',
                        data: {
                            username: this.state.username,
                            repository: this.state.repo_url
                        },
                        headers: {
                            Authorization: localStorage.token
                        }
                    })
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                        const commit_data = res.data;
                        this.setState({ commit_data });
                    })
                    this.setState({
                        watch_status: true,
                    })
                }
            }).catch(err => {
                console.log(err.data);
            })
           
        }

         if(this.state.text === 'Unwatch'){
            this.setState( {disabled: !this.state.disabled});
            document.getElementById("search-bar1").value = "";
            document.getElementById("search-bar2").value = "";
            this.setState({
                username: '',
                repo_url: '',
                commit_data: [],
                profile: [],
                text: 'Watch'
            })
             swal({
                 title: "Git repository has been unwatched",
                 type: "success"
             })
             this.setState({
                watch_status: false,
            })
        }
    }
}

    onSubmit(e) {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to use the monitor",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value ) {
               localStorage.removeItem('token');
               this.setState();   
                swal({
                    title: 'Logged out',
                    text: 'You have logged out the system',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1500
                }
                ).then(
                    this.props.history.push("/")
                );   
            }
          })
     }

     render_repoInfo(){
        if( this.state.profile === '' ){
                 return (
                     <div>
                    <p>Username : {this.props.current_profile.username}</p> 
                    <p>Repository name : {this.props.current_profile.reponame}</p>
                    <p>Created at : {this.props.current_profile.created_at}</p>
                    <p>Updated at : {this.props.current_profile.updated_at}</p>
                    <p>Pushed at : {this.props.current_profile.pushed_at}</p>
                    <p>Issue : {this.props.current_profile.num_issue}</p>
                    </div>
                 );
        }
        else {
            return (
                <div>
               <p>Username : {this.state.profile.username}</p> 
               <p>Repository name : {this.state.profile.reponame}</p>
               <p>Created at : {this.state.profile.created_at}</p>
               <p>Updated at : {this.state.profile.updated_at}</p>
               <p>Pushed at : {this.state.profile.pushed_at}</p>
               <p>Issue : {this.state.profile.num_issue}</p>
               </div>
            );
        }
     }

     render_graph(){

     }
    
    render(){
        const isAlreadyAuthenticated = this.isAuthenticated();
        if( !isAlreadyAuthenticated){
        return (
            <Redirect to={{ pathname: '/'}}  /> 
        )
        }
        else {
        
        return (
        <div>
           
             <div className="landing">
                <img src={logo} className="App-logo" alt="logo" />
                <input id="search-bar1" className="search-input" type="text" name="search"  autoComplete="off" placeholder="Input username or organization name ..." required disabled={this.state.disabled} onChange={(e) => this.setState({username: e.target.value})}/>
                <input id="search-bar2" className="search-input" type="text" name="search"   autoComplete="off" placeholder="Input repository name ..." required disabled={this.state.disabled} onChange={(e) => this.setState({repo_url: e.target.value})}/>
                    <button className="button" onClick= {(e) => this.watchRepo(e)} >{this.state.text}</button>  
                </div>
             <div className="sidenav">
                {/* <img id="userImg" src={require(''+this.state.imgURL)}></img> */}
                <h2>{this.props.profileUsername}</h2>
                <button id="logoutBtn" onClick= {(e) => this.onSubmit()}>Logout</button>
            </div>
                <div className="parallax">
                <div className="container">
            <div className="card">
            <div>
            <div className="left-container">
       
        <div className="right-container">
        
        <h2>Repository Information</h2>
        <img className="userImg" src={this.state.profile.image_url} alt="User"/>
        </div>
        {this.render_repoInfo()}
        </div>
        </div>
            </div>
            <div className="card">
           
            <NotificationCard/>
            </div>
          </div>
                </div>
                <div className="parallax-2">  
                <h2>Frequency of commits</h2>
                <LineChart width={1500} height={500} data={this.state.commit_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="commit" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>             
                </div>
            </div>
        );
    }
    }
}

function mapStateToProps(state){
    return {
        profileUsername: state.cookie.username,
        gitName: state.cookie.gitName,
        profile_img: state.cookie.imgURL,
        current_profile: state.current_repo.profile,
        current_commit: state.current_repo.commit_data
    }
}

export default connect(mapStateToProps)(Monitor);