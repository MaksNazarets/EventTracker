export const parseTime = (timeStr: string) => {
  const _time = timeStr.trim().split(":");
  return {
    hour: parseInt(_time[0], 10),
    minute: parseInt(_time[1], 10),
  };
};
