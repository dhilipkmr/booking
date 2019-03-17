import React, {Component} from 'react';
import axios from 'axios';
import {hashHistory} from 'react-router';
import '../App.css';
import {isFreeRoom} from '../utils';
import AddMeetings from './AddMeeting';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Buildings: null,
      showAddMeeting: false
    }
    this.loadAvailabilitySummary = this.loadAvailabilitySummary.bind(this);
    this.constructData = this.constructData.bind(this);
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
              meetingRooms {
                name
                meetings {
                  title
                  date
                  startTime
                  endTime
                }
              }
            }
          }`
      }
    }).then((resp) => {
     this.constructData(resp.data.data.Buildings);
    },(err) => {
      // console
    });
  }

  constructData(buildings) {
    if (buildings) {
      const buildingsCount = buildings.length;
      let meetingRoomsCount = 0;
      let freeRooms = 0;
      let totalMeetingsPresentDay = 0;
      let totalMeetNow = 0;
      buildings.forEach(building => {
        meetingRoomsCount = meetingRoomsCount + building.meetingRooms.length;
        building.meetingRooms.forEach((meetingRoom) => {
          const {isFree, totalMeetingsToday} = isFreeRoom(meetingRoom);
          freeRooms = freeRooms + isFree;
          totalMeetNow = (!isFree ? totalMeetNow + 1 : totalMeetNow);
          totalMeetingsPresentDay += totalMeetingsToday; 
        });
      });
      this.setState({
        buildings,
        buildingsCount,
        meetingRoomsCount,
        freeRooms,
        totalMeetingsPresentDay,
        totalMeetNow
      });
    }
  }

  loadAvailabilitySummary() {
    const {buildings, buildingsCount, meetingRoomsCount, freeRooms, totalMeetingsPresentDay, totalMeetNow} = this.state;
    return (
      <React.Fragment>
        <h1>Meeting Room Summary</h1>
        <div className="txtCenter">
          <div className="cardBlock">
            <strong>Buildings</strong>
            <div>{'Total: ' + buildingsCount}</div>
          </div>
          <div className="cardBlock">
            <strong>Rooms</strong>
            <div>{'Total: ' + meetingRoomsCount}</div>
            <div>{'Free now: ' + freeRooms}</div>
          </div>
          <div className="cardBlock">
            <strong>Meetings</strong>
            <div>{'Total: ' + totalMeetingsPresentDay + ' today'}</div>
            <div>{'Total ' + totalMeetNow + ' going on now'}</div>
          </div>
          <p className="txtCenter">
            <button onClick={() => this.setState({showAddMeeting: true})}>Add A meeting</button>
          </p>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const {buildings, showAddMeeting} = this.state;
    return(
      <div  className="txtCenter">
        {!showAddMeeting && buildings && this.loadAvailabilitySummary()}
        {showAddMeeting && <AddMeetings/>}
      </div>);
  }
}