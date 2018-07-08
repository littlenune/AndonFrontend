import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../stylesheets/table.css'
import { connect } from 'react-redux';


class BugspotCard extends Component {


    render() {
        console.log("PROP BUGSPOT",this.props.bugspot_data.length);
        if( this.props.bugspot_data.length !== 0){
          return (
            <div className="parallax-2">
              <h2 id="header">BUGSPOT SCORE</h2>
              <ReactTable
                data={this.props.bugspot_data.score}
                columns={[
                      {
                        Header: "Score",
                        accessor: "score"
                      },
                      {
                        Header: "File",
                        accessor:"file"
                      },
                      {
                        Header: 'Profile Progress',
                        accessor: 'progress',
                        Cell: row => (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: '#dadada',
                              borderRadius: '2px'
                            }}
                          >
                            <div
                              style={{
                                width: `${this.props.bugspot_data.score*100}%`,
                                height: '100%',
                                backgroundColor: (this.props.bugspot_data.score*100) > 66 ? '#85cc00'
                                  : this.props.bugspot_data.score > 33 ? '#ffbf00'
                                  : '#ff2e00',
                                borderRadius: '2px',
                                transition: 'all .2s ease-out'
                                }}
                              />
                            </div>
                          )
                        }       
                ]}
                defaultPageSize={10}
                style={{
                  height: "600px"
                }}
                className="-striped -highlight"
              />
              <br />
            </div>
          );
        }else {
          return(
            <div className="parallax-2">
             <h2 id="header">BUGSPOT SCORE</h2>
             <h2>No data shown. Bugspot score calculate the commit with 'fix' message in them.</h2>
            </div>
          );
        }
        }
       
    }

    function mapStateToProps(state){
        return {
            bugspot_data: state.update_bugspot.bugspot_data,
        }
    }
    

export default connect(mapStateToProps)(BugspotCard);