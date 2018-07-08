import React, { Component } from 'react';
import { connect }from 'react-redux';
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip} from 'recharts';

class FrequencyCommitCard extends Component {
   
//     {isWatched ? (
//         <LineChart width={1500} height={700} data={this.state.commit_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
//         <Line type="monotone" dataKey="commit" stroke="#8884d8" />
//         <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//     </LineChart> 
//   ) : (
//       <LineChart width={1500} height={700} data={this.props.current_commit} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
//       <Line type="monotone" dataKey="commit" stroke="#8884d8" />
//       <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//       <XAxis dataKey="name" />
//       <YAxis />
//       <Tooltip />
//   </LineChart> 
    render(){
        console.log("PROP FREQUENCT COMMIT", this.props.current_commit)
        if( this.props.current_commit !== 'Information not found' || this.props.current_commit.length !== 0){
            console.log("HERE");
            const data = this.props.current_commit
        return (
            <div className="parallax-2"> 
            <h2 id="header">Frequency of commit</h2>
            <LineChart width={1500} height={700} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="commit" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
        </LineChart> 
        </div>
        );
    }
    else {
        return (
            <div className="parallax-2">
                <h2 id="header">Frequncy of commit</h2>
                <h2>No data shown. Either no commits in your repository or please watch the repository.</h2>
            </div>
        );
    }
}
    
}

function mapStateToProps(state){
    return{
    current_commit: state.current_repo.commit_data
    }
}

export default connect(mapStateToProps)(FrequencyCommitCard);