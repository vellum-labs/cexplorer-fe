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

const versionColorMap = new Map();

export function getColorForVersion(version) {
  if (!versionColorMap.has(version)) {
    const versionCount = versionColorMap.size;
    versionColorMap.set(version, colors[versionCount % colors.length]);
  }

  return versionColorMap.get(version);
}
