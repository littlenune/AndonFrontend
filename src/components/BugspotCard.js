import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../stylesheets/table.css'
import { connect } from 'react-redux';


class BugspotCard extends Component {


    render() {
        console.log('Bugspot Card', this.props.bugspot_data.score);
        if( this.props.bugspot_data.length !== 0){
          return (
            <div className="parallax-2">
              <h2 id="header">Bugspot Score Analyze</h2>
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
                        Header: 'Percentage',
                        accessor: 'percentage',
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
                                width: `${row.value}%`,
                                height: '100%',
                                backgroundColor: (row.value) > 66 ? '#ff2e00'
                                  : row.value > 33 ? '#ffbf00'
                                  : '#85cc00',
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
             <h2 id="header">Bugspot Score Analyze</h2>
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