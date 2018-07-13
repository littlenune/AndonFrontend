import React, {Component} from 'react';
import {connect} from 'react-redux';


class OverallHealthCard extends Component {

    render(){
        return(
            <div className="card">
            <h1>Overall Health Score</h1>
                {/* <Progress
                type="circle"
                percent={this.state.overall_score}
                /> */}
                {/* <p>Code Duplication score : {this.state.duplicate_score}</p>
                <p>Code Complexity score : {this.state.complexity_score}</p>
                <p>Bugspot Analyze score : {this.state.bugspot_score}</p>

                <p>Total Score : {this.state.overall_score}</p> */}
            </div>
        )
    
    }
}

function mapStateToProps(state){
    return {
        duplicate_score: state.update_duplicate.overallHealth,
        complexity_score: state.update_complexity.overallHealth,
        bugspot_score: state.update_bugspot.overallHealth,
        outdated_score: state.update_outdated.overallHealth
    }
}

export default (connect)(mapStateToProps)(OverallHealthCard);