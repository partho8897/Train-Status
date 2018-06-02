import React, { Component } from "react";

export default class App extends Component {
    state = {
      sourceStation:"ghy",
      destinationStation:"ndls",
      date:"03-06-2018",
      submit:"",
      trainData:[]
    };

    onSourceStationChange = (e) => {
      this.setState({
        sourceStation:e.currentTarget.value
      })
    }

    onDestinationStationChange = (e) => {
      this.setState({
        destinationStation:e.currentTarget.value
      })
    }

    onDateChange = (e) => {
      this.setState({
        date:e.currentTarget.value
      })
    }

    submit = (e) => {
      console.log(this.state);
      fetch(`http://api.railwayapi.com/v2/between/source/${this.state.sourceStation}/dest/${this.state.destinationStation}/date/${this.state.date}/apikey/cq5cp33gv8/`)
      .then(
        (a)=>a.json()
      ).then( result  => {
        console.log(result);
        this.setState({
          trainData: result.trains
        });
      });
    }

    tdOnNameclick = (train) => {
      console.log(train)
      /*fetch(`https://api.railwayapi.com/v2/check-seat/train/<train number>/source/<stn code>/dest/<dest code>/date/<dd-mm-yyyy>/pref/<class code>/quota/<quota code>/apikey/cq5cp33gv8  /`)
      .then(
        (a)=>a.json()
      ).then( result  => {
        console.log(result);
        this.setState({
          trainData: result.trains
        });
      });*/
    }

    render() {
     return (
        <form>
            <input type="text" onChange={this.onSourceStationChange} value={this.state.sourceStation} placeholder="Source Station"></input>
            <br/>
            <input type="text" onChange={this.onDestinationStationChange} value={this.state.destinationStation}  placeholder="Destination Station"></input>
            <br/>
            <input type="text" onChange={this.onDateChange} value={this.state.date}  placeholder="Date(dd-mm-yyyy)"></input>
            <br/>
            <input type="text" placeholder="via"></input>
            <button onClick={this.submit} type="button">Submit</button>
            <table>
                <thead>
                  <tr>
                  <th>Train Name</th>
                  <th>Train No.</th>
                  <th>ETD</th>
                  <th>ETA</th>
                  <th>Travel Time</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.trainData.map(train => {
                      return <tr>
                        <td onClick={() => this.tdOnNameclick(train)}>{train.name}</td>
                        <td>{train.number}</td>
                        <td>{train.src_departure_time}</td>
                        <td>{train.dest_arrival_time}</td>
                        <td>{train.travel_time}</td>
                        </tr>
                    })
                  }  
                </tbody> 
            </table>
    	</form>
    );
  }
}