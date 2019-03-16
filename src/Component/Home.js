import React from 'react';
import axios from 'axios';
import {hashHistory} from 'react-router';
import '../App.css';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Buildings: null
    }
    this.loadAvailabilitySummary = this.loadAvailabilitySummary.bind(this);
    this.constructData = this.constructData.bind(this);
    this.isFree = this.isFree.bind(this);
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
    });
  }

  isFree(meetingRoom) {
    let isFree = 1;
    let totalMeetingsToday = 0;
    meetingRoom.meetings.forEach((meetingData) => {
      // if (isFree) {
        const day = meetingData.date.split('/')[0];
        const month = meetingData.date.split('/')[1];
        const year = meetingData.date.split('/')[2];
        let ind0 = meetingData.startTime.split(':')[0];
        let ind1 = meetingData.startTime.split(':')[1];
        const startHrs = parseInt(ind0);
        const startMin = parseInt(ind1);
        ind0 = meetingData.endTime.split(':')[0];
        ind1 = meetingData.endTime.split(':')[1];
        const endHrs = parseInt(ind0);
        const endMin = parseInt(ind1);
        const currentDate = new Date();
        const currentHours = currentDate.getHours();
        const currentMin = currentDate.getMinutes();
        if (day === currentDate.getDay() && month === currentDate.getMonth && year === currentDate.getFullYear()) {
          if (currentHours < startHrs || currentHours > endHrs || (currentHours === startHrs && currentMin > startMin) || (currentHours === endHrs && currentMin > endMin)) {

          } else {
            isFree = 0;
          }
          totalMeetingsToday = totalMeetingsToday + 1;
        } else {
          isFree = 1;
        } 
      // }
    });
    return {isFree, totalMeetingsToday};
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
          const {isFree, totalMeetingsToday} = this.isFree(meetingRoom);
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
          <button onClick={() => hashHistory.push('add_meetings')}>Add A meeting</button>
        </p>
      </div>
    );
  }

  render() {
    const {buildings} = this.state;
    return(
      <div  className="txtCenter">
        <h1>Meeting Room Summary</h1>
        {buildings && this.loadAvailabilitySummary()}
      </div>);
  }
}