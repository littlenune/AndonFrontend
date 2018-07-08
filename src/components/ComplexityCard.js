import React, {Component} from 'react'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../stylesheets/table.css'
import { connect } from 'react-redux';

class ComplexityCard extends Component {
    
    render() {
        console.log("PROP COMPLEX",this.props.complexity_data);
        if( this.props.complexity_data.length !== 0){
          return (
            <div className="parallax-2">
                <h2 id="header">Complexity of Code</h2>
              <ReactTable
                data={this.props.complexity_data}
                columns={[
                      {
                        Header: "File",
                        accessor: "file"
                      },
                      {
                        Header: "COMP",
                      accessor:"comp"
                      },
                      {
                          Header: "Number of commit",
                          accessor:"numCommit"
                      },
                      {
                          Header:"Source Line of Code",
                          accessor: "sloc"
                      }
                      
                   
                 
                ]}
                defaultPageSize={10}
                style={{
                  height: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                }}
                className="-striped -highlight"
              />
              <br />
            </div>
          );
        }else {
          return(
            <div className="parallax-2">
              <h2 id="header">Complexity of Code</h2>
              <h2>No complexity of your code.</h2>
            </div>
          );
        }
        }
}

function mapStateToProps(state){
    return {
        complexity_data: state.update_complexity.complexity_data
    }
}

export default connect(mapStateToProps)(ComplexityCard)
