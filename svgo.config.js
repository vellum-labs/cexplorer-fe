export default {
  multipass: true,
  plugins: [
    "preset-default",
    { name: "removeViewBox", active: false },
    {
      name: "cleanupIds",
      active: false,
    },
  ],
};
