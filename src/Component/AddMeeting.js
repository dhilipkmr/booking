import React from 'react'
import axios from 'axios';
import {hashHistory} from 'react-router';

export default class AddMeetings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: null
    }
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
    axios({
      url: 'http://smart-meeting.herokuapp.com/graphql',
      method: 'POST',
      data: {
        query: `
          {
            Buildings {
              name
            }
          }`
      }
    }).then((resp) => {
     this.setState({ buildings: resp.data.data.Buildings});
    });
  }

  handleNext() {
    const date = this.refs.date.value.toString();
    const start = this.refs.start.value.toString();
    const end = this.refs.end.value.toString();
    const building = this.refs.selector.value.toString();
    const title = this.refs.title.value.toString();
    axios({
      url: 'http://smart-meeting.herokuapp.com/graphql',
      method: 'POST',
      headers: { token: "a123gjh32sdf6576"},
      data: {
        query: `
          mutation {
            Meeting(id: ${parseInt(Math.random() * 100)} title: "${title}" date:"${date}" startTime: "${start}" endTime: "${end}" meetingRoomId: ${parseInt(Math.random() * 100)}) {
              id
              title
            }
          }`
      }
    }).then((resp) => {
      console.log(resp.data.data)
    });
  }

  render() {
    const {buildings} = this.state;
    return (
    <div className="txtCenter">
      <h1>Add Meetings</h1>
      <div className="cardBlockSmall">
       <span>Title: </span> <input ref="title"/>
     </div>
     <div className="cardBlockSmall">
       <span>Date: </span> <input ref="date"/>
     </div>
     <div className="cardBlockSmall">
      <span>Start Time: </span> <input ref="start"/>
     </div>
     <div className="cardBlockSmall">
     <span>End Time: </span> <input ref="end"/>
     </div>
     <div className="cardBlockSmall">
       <label for="building">select building</label>
        <select id="building" ref="selector">
          <option>select building</option>
          {buildings && buildings.map((building) => <option>{building.name}</option>)}
        </select>
     </div>
     <div className="txtCenter">
      <button onClick={this.handleNext}>Next</button>
    </div>
    </div>
      );
  }
}
