export const getGradientColor = (percent: number) => {
  let r = 0,
    g = 0,
    b = 0;
  if (percent <= 50) {
    const ratio = percent / 50;
    r = 71 + ratio * (254 - 71);
    g = 205 + ratio * (200 - 205);
    b = 137 + ratio * (75 - 137);
  } else {
    const ratio = (percent - 50) / 50;
    r = 254 + ratio * (240 - 254);
    g = 200 - ratio * (200 - 68);
    b = 75 - ratio * (75 - 56);
  }
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};
