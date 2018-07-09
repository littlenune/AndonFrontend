import React, {Component} from 'react';
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import NotificationCard from '../components/NotificationCard';
import { connect } from 'react-redux'
import swal from 'sweetalert2';
import '../stylesheets/search.css';
import '../stylesheets/sidebar.css';
import '../stylesheets/dataCard.css';
import logo from '../res/andon.png';
import BugspotCard from '../components/BugspotCard'
import DuplicateCard from '../components/DuplicateCard'
import addDuplicate from '../actions/addDuplicate'
import addBugspot from '../actions/addBugspot'
import addComplexity from '../actions/addComplexity'
import ComplexityCard from '../components/ComplexityCard';
import FrequencyCommitCard from '../components/FrequencyCommitCard';
import addFrequencyCommit from '../actions/addFrequencyCommit';

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
            profileUsername: props.profileUsername,
            gitName: this.props.gitName,
            profile: '',
            commit_data: [],
            currrepo: this.props.currrepo,
            current_profile: [],
            watch_status: false,
            products: [],
            percent: 0,
            load_status: false,
            duplication_status: false,
            complexity_status: false
        }
        console.log(this.state.profileUsername);
    }

    isAuthenticated(){
        const token = localStorage.getItem('token');
        return token && token.length > 10;
    }

    getCurrentCommit(){
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
            if( true ){
                this.props.update_frequency(res.data)
            }           
            this.setState( {commit_data: res.data} );
        })
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
                url: '/api/git/clonerepo',
                method: 'post',
                data: {
                    username: this.state.username,
                    repository: this.state.repo_url
                },
                headers: {
                    Authorization: localStorage.token
                }
            }).then( res => {
                console.log("CLONE",res.data);
                if(res.data === 'Finish'){
                    // this.setState({
                    //     load_status: true
                    // })
                        axios({
                            url: 'api/analyze/bugspot',
                            method: 'get',
                            headers: {
                                Authorization: localStorage.token
                            }
                        }
                    )
                    .then((res) => {
                        console.log("BUGSPOT RES : ",res.data)
                        if(res.data !== 'Not found commits matching search criteria')
                        this.props.update_bugspot(res.data)
                        else {
                            this.props.update_bugspot('');
                        }
                    })
                    .catch((res) => {
                        console.log("CATCH",res);
                    })
                    axios({
                        url: 'api/analyze/duplicate',
                        method: 'get',
                        headers: {
                            Authorization: localStorage.token
                        }
                    }
                )
                .then((res) => {
                    console.log("DUPLICATE RES : ",res.data)
                    if(res.data.message !== 'The jscpd found too many duplicates over threshold'){
                    this.props.update_duplicate(res.data)
                    }
                    else{
                        this.props.update_duplicate('');
                    }
                })
                .catch((res) => {
                    console.log("CATCH",res);
                })
                axios({
                    url: 'api/analyze/complexity',
                    method: 'get',
                    headers: {
                        Authorization: localStorage.token
                    }
                }).then((res)=>{
                    console.log("COMPLEXITY RES : ",res.data.resObj.length)
                    if(res.data.resObj.length !== 0){
                    this.props.update_complexity(res.data.resObj)
                    }
                    else {
                        this.props.update_complexity('');
                    }
                })
                .catch(res=>{
                    console.log("CATCH",res)
                })
                }
                

            })
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
                    // let timerInterval
                        swal({
                        title: 'Cloning repository',
                        html: 'I will close in <strong></strong> seconds.',
                        timer: 20000,
                        onOpen: () => {
                            swal.showLoading()
                        },
                        onClose: () => {
                            if(this.state.load_status){
                                clearInterval()
                            }
                        }
                        }).then((result) => {
                        if (
                            // Read more about handling dismissals
                            result.dismiss === swal.DismissReason.timer
                        ) {
                            console.log('I was closed by the timer')
                        }
                        })
                    this.getCurrentCommit();
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
            this.props.update_bugspot('');
            this.props.update_complexity('');
            this.props.update_duplicate('');
            this.props.update_frequency('');
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
    
    render(){
        // window.onbeforeunload = function() {
        //     localStorage.removeItem('token')
        //     return '';
        //   };
        const isWatched = this.state.watch_status;
        
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
                {/* <img id="userImg" src={require(''+this.props.imgURL)}></img> */}
                <h2 className="register-text">{this.props.profileUsername}</h2>
                <a href="#main" className="andon-button">Notification Trigger</a>
                <a href="#frequency" className="andon-button">Frequency of commit</a>
                <a href="#duplicate" className="andon-button">Code Duplication</a>
                <a href="#complexity" className="andon-button">Code Complexity</a>
                <a href="#bugspot" className="andon-button">Bugspot Analyze</a>
                <button id="logoutBtn" className="andon-button" onClick= {(e) => this.onSubmit()}>Logout</button>
            </div>
                <div className="parallax">
                <div className="container">
            <div  className="card">
            <div>
            <div className="left-container">
       
        <div  className="right-container">
        
        <h2>Repository Information</h2>
        </div>
        { !isWatched ? (
             <div>
            <img className="userImg" src={this.props.current_profile.image_url} alt="User"/>
             <p>Username : {this.props.current_profile.username}</p> 
             <p>Repository name : {this.props.current_profile.reponame}</p>
             <p>Created at : {this.props.current_profile.created_at}</p>
             <p>Updated at : {this.props.current_profile.updated_at}</p>
             <p>Pushed at : {this.props.current_profile.pushed_at}</p>
             <p>Issue : {this.props.current_profile.num_issue}</p>
             </div>
        ) : (
            <div>
            <img className="userImg" src={this.state.profile.image_url} alt="User"/>
            <p>Username : {this.state.profile.username}</p> 
            <p>Repository name : {this.state.profile.reponame}</p>
            <p>Created at : {this.state.profile.created_at}</p>
            <p>Updated at : {this.state.profile.updated_at}</p>
            <p>Pushed at : {this.state.profile.pushed_at}</p>
            <p>Issue : {this.state.profile.num_issue}</p>
            </div>
        )}
        </div>
        </div>
            </div>
            <div className="card">
           
            <NotificationCard/>
            </div>
          </div>
                </div>
                <div id="frequency">
                <FrequencyCommitCard/>
                </div>
                <div id="duplicate">
                <DuplicateCard/>
                </div>
                <div id="complexity">
                <ComplexityCard/>
                </div>
                <div id="bugspot">
                <BugspotCard/>
                </div>
            </div>
        );
    }
    }
}

function mapDispatchToProps(dispatch){
    return {
        update_duplicate: (duplicate_data) => dispatch(addDuplicate(duplicate_data)),
        update_bugspot: (bugspot_data) => dispatch(addBugspot(bugspot_data)),
        update_complexity: (complexity_data) => dispatch(addComplexity(complexity_data)),
        update_frequency: (frequency_data) => dispatch(addFrequencyCommit(frequency_data))
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

export default connect(mapStateToProps,mapDispatchToProps)(Monitor);