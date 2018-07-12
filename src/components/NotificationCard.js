import React, {Component} from 'react';
import '../stylesheets/notification.css';
import swal from 'sweetalert2'
// import Axios from 'axios';
import {connect} from 'react-redux'

class NotificationCard extends Component {
    constructor(props){
        super(props);
       
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
        console.log('NOTIFICATION',this.props.status)
    return (
    <div className="notification-container">
    <h1>Notification Trigger</h1>
        <p className="container">Overall Health :
        <input type="radio" name="radio"/>
        <span className="checkmark"></span>
        </p>
        <label className="container">Frequency of Commits : {this.props.freqCommit_status}
        <input type="radio" name="radio"/>
        <span className="checkmark"></span>
        </label>
        <label className="container">Code Duplication : {this.props.duplicate_status}
        <input type="radio" name="radio"/>
        <span className="checkmark"></span>
        </label>
        <label className="container">Complexity of Code : {this.props.complex_status}
        <input type="radio" name="radio"/>
        <span className="checkmark"></span>
        </label>
        <label className="container">Bugspot Score : {this.props.bugspot_status}
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
        bugspot_status: state.update_bugspot.status

    }
}


export default connect(mapStateToProps)(NotificationCard);