import React, {Component} from 'react';
import '../stylesheets/notification.css';
import swal from 'sweetalert2'
// import Axios from 'axios';
import {connect} from 'react-redux'

class NotificationCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            select_trigger: ''
        };
    }
    handleSubmit(e){
        
        console.log(e)
        swal({
            type: 'success',
            title: 'Notification has been changed',
            showConfirmButton: false,
            timer: 1500
          })
    }
    render(){
    return (
    <div className="notification-con">
    <h1>Notification Trigger</h1>
        <label className="container">Frequency of Commits : {this.props.freqCommit_status}
        <input type="radio" name="radio" id="frequency" checked={(e) => this.setState({select_trigger: e.target.value})}/>
        <span className="checkmark"></span>
        </label>
        <label className="container">Code Duplication : {this.props.duplicate_status}
        <input type="radio" name="radio" id="duplicate" checked={(e) => this.setState({select_trigger: e.target.value})}/>
        <span className="checkmark"></span>
        </label>
        <label className="container">Complexity of Code : {this.props.complex_status}
        <input type="radio" name="radio" id="complex" checked={(e) => this.setState({select_trigger: e.target.value})}/>
        <span className="checkmark"></span>
        </label>
        <label className="container">Bugspot Score : {this.props.bugspot_status}
        <input type="radio" name="radio" id="bugspot" checked={(e) => this.setState({select_trigger: e.target.value})}/>
        <span className="checkmark"></span>
        </label>
        <label className="container">Outdated Library : {this.props.outdated_status}
        <input type="radio" name="radio"/>
        <span className="checkmark"></span>
        </label>
        <button id="submitBtn"  className="andon-button" onClick={(e)=>this.handleSubmit(e)}>Notify to Andon Model</button>
        </div>
    );
    }
}

function mapStateToProps(state){
    return {
        freqCommit_status : state.update_frequency.status,
        duplicate_status: state.update_duplicate.status,
        complex_status: state.update_complexity.status,
        bugspot_status: state.update_bugspot.status,
        outdated_status: state.update_outdated.status

    }
}


export default connect(mapStateToProps)(NotificationCard);