import React, { Component } from 'react';
import { connect }from 'react-redux';
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip} from 'recharts';
import '../stylesheets/frequency.css'
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
                console.log("BUG",this.props.current_commit)
            if(this.props.current_commit !== 'Information not found'){
                if(this.props.commit_data.length === 0   ){ 
                    console.log("CURRENT COMMIT")  
                    const data = this.props.current_commit;
                    console.log("CURRENT ",this.props)
                return (
                    <div className="parallax-2"> 
                    <h2 id="header">Frequency of Commit</h2>
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
                        console.log("COMMIT DATA")
                        const data = this.props.commit_data;
                        console.log(this.props.commit_data);
                        if( this.props.commit_data === 'Information not found'){
                            console.log("GIT LIMIT =0=")
                            return <div></div>
                        }
                        else {
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
            }
            }
            else {
                return(
                    <div>Information Not Found :(</div>
                )
            }
            // else {
                // return (
                //     <div className="parallax-2">
                //         <h2 id="header">Frequency Commit</h2>
                //         <h2>No data show. Duplication of code not found.</h2>
                //     </div>
                // );
            // }
                // return (
                //     <div className="parallax-2">
                //         <h2 id="header">Frequncy of commit</h2>
                //         <h2>No data shown. Either no commits in your repository or please watch the repository.</h2>
                //     </div>
                // );
            
        }
}

function mapStateToProps(state){
    return{
    current_commit: state.current_repo.commit_data,
    commit_data: state.update_frequency.frequency_data
    }
}

// export default connect(mapStateToProps)(FrequencyCommitCard);

export default connect(mapStateToProps)(FrequencyCommitCard);