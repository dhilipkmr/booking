export function isFreeRoom(meetingRoom) {
  let isFree = 1;
  let totalMeetingsToday = 0;
  meetingRoom.meetings.forEach((meetingData) => {
    const [day, month, year] = "16/02/2019".split('/');

    let [ind0, ind1] = meetingData.startTime.split(':');
    const [startHrs, startMin] = [parseInt(14), parseInt(30)];

    let startTime = new Date(year, month, day);
    startTime = new Date(startTime.setHours(startHrs));
    startTime = new Date(startTime.setMinutes(startMin));

    [ind0, ind1] = meetingData.endTime.split(':');
    const [endHrs, endMin] = [parseInt(16), parseInt(30)];

    let endTime = new Date(year, month, day);
    endTime = new Date(endTime.setHours(endHrs));
    endTime = new Date(endTime.setMinutes(endMin));

    const currentDate = new Date();

    if (parseInt(day) === currentDate.getDate() && parseInt(month) === currentDate.getMonth() && parseInt(year) === currentDate.getFullYear()) {
      if (currentDate.getTime() >= startTime.getTime() && currentDate.getTime() <= endTime.getTime()) {
        isFree=0;
      }
      totalMeetingsToday = totalMeetingsToday + 1;
    }
  });
  return {isFree, totalMeetingsToday};
}
