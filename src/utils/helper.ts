export const getRandomOptionsOfName = (name: string) => {
  if (name.length < 2) {
    return [name, name + '庄', name + '屯', name + '市',];
  }
  if (name.length === 2) {
    return [
      name[0] + name[1],
      name[1] + name[0],
      name[0],
      name[1],
    ];
  }
  return [
    name[0] + name[1] + name.slice(2),
    name[0] + name.slice(2) + name[1],
    name[1] + name.slice(2) + name[0],
    name.slice(2) + name[0] + name[1],
  ];
};

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