const colors = [
  "#00bbad",
  "#ffb14e",
  "#fa8775",
  "#79defd",
  "#bdbdbd",
  "#0094d4",
  "#cd34b5",
  "#6a4c93",
  "#b80058",
];

const versions = new Set();

export function getColorForVersion(version) {
  versions.add(version);

  const sorted = [...versions].sort((a, b) => (b as number) - (a as number));
  const index = sorted.indexOf(version);

  return colors[index % colors.length];
}
