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
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import addOutdated from '../actions/addOutdated';
import OutdatedCard from '../components/OutdatedCard';
import OverallHealthCard from '../components/OverallHealthCard';

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
            profile: '',
            commit_data: [],
            current_profile: [],
            watch_status: false,
            products: [],
            overall_score: 0,
            bugspot_score: 0,
            complexity_score: 0,
            duplicate_score: 0,
            outdated_score: 0
        }
    }

    isAuthenticated(){
        const token = localStorage.getItem('token');
        return token && token.length > 10;
    }

    updateBugspotFunction(){
        axios({
            url: 'api/analyze/bugspot',
            method: 'get',
            headers: {
                Authorization: localStorage.token
                }
            }
        ).then((res) => {
            if(res.data.message !== 'Not found commits matching search criteria'){
            console.log("**",res.data.overallhealth);
            console.log("Score",res.data.overallHealth)
        this.props.update_bugspot(res.data.score,'available')
        console.log("1",res.data.overallHealth)
        this.setState({
            overall_score: this.state.overall_score + res.data.overallHealth,
            bugspot_score: res.data.overallHealth
        })
        }
        else {
            this.props.update_bugspot('','unavailable');
        }
    })
    .catch((res) => {
        console.log("catch",res);
    })
    }

    updateComplexityFunction(){
        axios({
            url: 'api/analyze/complexity',
            method: 'get',
            headers: {
                Authorization: localStorage.token
            }
        }).then((res)=>{
            console.log('overall complex:',res.data.overallHealth)
            console.log("COMPLEXITY RES : ",res.data.resObj.length)
            if(res.data.resObj.length !== 0){
            this.props.update_complexity(res.data.resObj,'available')
            console.log("2",res.data.overallHealth)
            this.setState({
                overall_score: this.state.overall_score + res.data.overallHealth,
                complexity_score: res.data.overallHealth
            })
            }
            else {
                this.props.update_complexity('','unavailable');
            }
        })
        .catch(res=>{
            console.log("CATCH",res)
        })
        
    }

    cloneRepoFunction(){
        swal({
            title: 'Cloning Repository',
            text: 'Cloning...',
            onOpen: ()=> {
                swal.showLoading();
                console.log("HERE");
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
                    console.log("STATUS",res.data);
                    this.updateBugspotFunction(),
                    this.updateComplexityFunction(),
                    this.updateDuplicateFunction()
                    this.updateOutdatedFunction()
                    if(res.data === 'Finish'){
                        swal.close();
                    }
                  })
            }
        })
    }

    updateDuplicateFunction(){
        axios({
            url: 'api/analyze/duplicate',
            method: 'get',
            headers: {
                Authorization: localStorage.token
            }
        }
        )
        .then((res) => {
            if(res.data.message !== 'The jscpd found too many duplicates over threshold'){
            this.props.update_duplicate(res.data,'available')
            console.log("3",res.data.overallHealth)
            this.setState({
                overall_score: this.state.overall_score + res.data.overallHealth,
                duplicate_score: res.data.overallHealth
            })
            }
            else{
                this.props.update_duplicate('','unavailable');
            }
        })
        .catch((res) => {
            console.log("CATCH",res);
        })
    }

    updateOutdatedFunction(){
        axios({
            url: 'api/analyze/outdated',
            method: 'get',
            headers: {
                Authorization: localStorage.token
            }
        }).then((res)=> {
            console.log('outdated result',res.data);
            if(res.data.message !== 'A package.json was not found'){
            this.props.update_outdated(res.data.resultObj,'available')
            }
            else {
                this.props.update_outdated('','unavailable')
            }
        }).catch((res) => {
            console.log("OUTDATE CATCH",res)
        })
    }

    updateFreqCom(){
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
            console.log("4",res.data)
            this.props.update_frequency(res.data,'available')
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
                        console.log("HERE1");
                    }
                    else { 
                        window.scrollTo(0, 0);
                        this.setState( {disabled: !this.state.disabled});
                        const profile = res.data;
                        this.setState({ profile});
                        this.setState({text: 'Unwatch'})
                        this.updateFreqCom();
                        this.setState({
                            watch_status: true,
                        })
                        this.cloneRepoFunction();
                        console.log("HERE2");
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
                console.log("HERE");
                this.props.update_bugspot('','no data');
                this.props.update_complexity('','no data');
                this.props.update_duplicate('','no data');
                this.props.update_frequency('','no data');
                this.props.update_outdated('','no data');
                this.setState({
                    overall_score: 0,
                    bugspot_score: 0,
                    duplicate_score: 0,
                    complexity_score: 0,
                    outdated_score: 0
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
            // const image_path = '../../image-url/' + this.props.imgURL
            // console.log('IMAGE NAME',imageName);
        return (
        <div>
           
             <div className="landing">
                <img src={logo} className="App-logo" alt="logo" />
                <input id="search-bar1" className="search-input" type="text" name="search"  autoComplete="off" placeholder="Input username or organization name ..." required disabled={this.state.disabled} onChange={(e) => this.setState({username: e.target.value})}/>
                <input id="search-bar2" className="search-input" type="text" name="search"   autoComplete="off" placeholder="Input repository name ..." required disabled={this.state.disabled} onChange={(e) => this.setState({repo_url: e.target.value})}/>
                    <button className="button" onClick= {(e) => this.watchRepo(e)} >{this.state.text}</button>  
                </div>
             <div className="sidenav">
                <h2>Welcome</h2>
                {/* <img id="userImg" src={require('${image_path}')}></img> */}
                <h2 className="register-text">{this.props.profileUsername}</h2>
                <a href="#main" className="andon-button">Notification Trigger</a>
                <a href="#frequency" className="andon-button">Frequency of commit</a>
                <a href="#duplicate" className="andon-button">Code Duplication</a>
                <a href="#complexity" className="andon-button">Code Complexity</a>
                <a href="#bugspot" className="andon-button">Bugspot Analyze</a>
                <a href="#outdated" className="andon-button">Outdated Library</a>
                <button id="logoutBtn" className="andon-button" onClick= {(e) => this.onSubmit()}>Logout</button>
            </div>
                <div className="parallax">
                <div className="container">
            <div  className="card">
            <div>
            <div className="left-container">
       
        <div  className="right-container">
        
        <h1>Repository Information</h1>
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
           <OverallHealthCard/>
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
                <div id="outdated">
                <OutdatedCard/>
                </div>
            </div>
        );
    }
    }
}

function mapDispatchToProps(dispatch){
    return {
        update_duplicate: (duplicate_data,status) => dispatch(addDuplicate(duplicate_data,status)),
        update_bugspot: (bugspot_data,status) => dispatch(addBugspot(bugspot_data,status)),
        update_complexity: (complexity_data,status) => dispatch(addComplexity(complexity_data,status)),
        update_frequency: (frequency_data,status) => dispatch(addFrequencyCommit(frequency_data,status)),
        update_outdated: (outdated_data, status) => dispatch(addOutdated(outdated_data,status))
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