export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  let displayedHours = hours.toString();
  let displayedMinutes = minutes.toString();
  let displayedSeconds = seconds.toString();
  if (hours < 10) {
    displayedHours = '0' + displayedHours;
  }
  if (minutes < 10) {
    displayedMinutes = '0' + displayedMinutes;
  }
  if (seconds < 10) {
    displayedSeconds = '0' + displayedSeconds;
  }
  if (hours === 0) {
    return `${displayedMinutes}:${displayedSeconds}`;
  }
  return `${displayedHours}:${displayedMinutes}:${displayedSeconds}`;
}

export const sleeper = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getOffsetLookAtLat = (lat: number,offset: number) => {
  if (offset > 90) {
    offset = 90;
  }
  if (lat > -89.9 + offset) {
    return lat - offset;
  } else {
    return -89.9;
  }
}