// This timer is specifically for the u_time type variables for the shaders
class GlobalTimer {
  startDate;
  startTime;
  constructor() {
    this.startDate = new Date();
    this.startTime = this.startDate.getTime();
  }

  getSecondsElapsed(startTime = this.startTime) {
    var date_now = new Date();
    var time_now = date_now.getTime();
    var time_diff = time_now - startTime;
    var seconds_elapsed = time_diff / 1000;
    return (seconds_elapsed);
  }
  getStartTime() {
    return this.startTime
  }
  setStartTime(val) {
    this.startTime = val
  }
  getElapsedTime() {

  }

  resetTime() {
    this.startDate = new Date()
    this.startTime = this.startDate.getTime()
    return 0
  }
}

module.exports = GlobalTimer