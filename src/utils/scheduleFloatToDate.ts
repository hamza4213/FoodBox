const scheduleFloatToDate = (time: number): number => {
  const hour = Math.floor(time);
  const minute = time % 1 ? 30 : 0;

  const now = new Date();
  now.setHours(hour, minute);
  
  return now.getTime();
};

export {
  scheduleFloatToDate,
};
