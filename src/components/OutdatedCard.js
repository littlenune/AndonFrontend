import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class OutdatedCard extends Component {
    render(){
        return(
            <div className="parallax-2">
            <h1>Library Outdated</h1>
            <ReactTable
            data={this.props.outdated_data}
            columns={[
                  {
                    Header: "Module Name",
                    accessor: "moduleName"
                  },
                  {
                    Header: "Home Page",
                  accessor:"homepage"
                  },
                  {
                      Header: "Latest Version",
                      accessor:"latest"
                  },
                  {
                      Header:"Installed Version",
                      accessor: "installed"
                  },
                  
               
             
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
    }
}

function mapStateToProps(state){
    return {
        outdated_data: state.update_outdated.outdated_data
    }
}

export default connect(mapStateToProps)(OutdatedCard);