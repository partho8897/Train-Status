import React, { Component } from "react";
import "./style.css";

export default class App extends Component {
  state = {
    sourceStation: "jp",
    destinationStation: "kota",
    date: "11-06-2018",
    trainData: [],
    trainAvailabilty: {},
    selectedTrain: {
      classes: []
    }
  };

  onSourceStationChange = e => {
    this.setState({
      sourceStation: e.currentTarget.value
    });
  };

  onDestinationStationChange = e => {
    this.setState({
      destinationStation: e.currentTarget.value
    });
  };

  onDateChange = e => {
    this.setState({
      date: e.currentTarget.value
    });
  };

  submit = e => {
    console.log(this.state);
    fetch(
      `//api.railwayapi.com/v2/between/source/${
        this.state.sourceStation
      }/dest/${this.state.destinationStation}/date/${
        this.state.date
      }/apikey/tsvbv1syei/`
    )
      .then(a => a.json())
      .then(result => {
        console.log(result);
        this.setState({
          trainData: result.trains || []
        });
      });
  };

  selectTrain = train => {
    this.setState({
      selectedTrain: train
    });

    train.classes.forEach(tClass => {
      fetch(
        `https://api.railwayapi.com/v2/check-seat/train/${
          train.number
        }/source/${train.from_station.code}/dest/${
          train.to_station.code
        }/date/${this.state.date}/pref/${
          tClass.code
        }/quota/GN/apikey/tsvbv1syei/`
      )
        .then(a => a.json())
        .then(result => {
          const temp = this.state.trainAvailabilty;
          temp[tClass.code] = result.availability;
          this.setState({
            trainAvailabilty: temp
          });
        })
        .catch(e => {
          console.log(e);
        });
    });
  };

  render() {
    var availabilityDates = [];

    Object.keys(this.state.trainAvailabilty).forEach(key => {
      if (this.state.trainAvailabilty[key].length > 0) {
        availabilityDates = this.state.trainAvailabilty[key];
      }
    });

    return (
      <div className="inp"><br/>
        <form>
          <div className="form-row">
            <div className="col">
              <input
                type="text"
                onChange={this.onSourceStationChange}
                value={this.state.sourceStation}
                placeholder="Source Station"
              />
            </div>
            <div className="col">
              <input
                type="text"
                onChange={this.onDestinationStationChange}
                value={this.state.destinationStation}
                placeholder="Destination Station"
              />
            </div>
            <div className="col">
              <input
                type="text"
                onChange={this.onDateChange}
                value={this.state.date}
                placeholder="Date(dd-mm-yyyy)"
              />
            </div>
            <br/>
            <br/>
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={this.submit}
                type="button"
              >
                Submit
              </button>
            </div>
          </div>
        </form>

        <table className="table table-striped">
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
            {this.state.trainData.map(train => {
              return (
                <tr
                  key={train.number}
                  className={
                    train.number === this.state.selectedTrain.number
                      ? "active"
                      : ""
                  }
                >
                  <td
                    className="train-name"
                    onClick={() => this.selectTrain(train)}
                  >
                    {train.name}
                  </td>
                  <td>{train.number}</td>
                  <td>{train.src_departure_time}</td>
                  <td>{train.dest_arrival_time}</td>
                  <td>{train.travel_time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <table className="table">
          <thead>
            <tr>
              <th>Class</th>
              {availabilityDates.map(x => <th>{x.date}</th>)}
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.state.trainAvailabilty).map(key => {
              const data = this.state.trainAvailabilty[key];
              return (
                <tr key={key}>
                  {data.length > 0 && <td>{key}</td>}
                  {data.map(x => <td>{x.status}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
