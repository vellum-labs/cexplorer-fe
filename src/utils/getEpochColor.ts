export const getEpochColor = (value, h = 50) => {
  const hue = value > 0.8 ? 120 : value * 120;
  return `hsl(${hue}, ${h}%, ${h}%)`;
};
