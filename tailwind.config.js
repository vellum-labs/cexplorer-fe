/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@vellumlabs/cexplorer-sdk/tailwind.config")],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@vellumlabs/cexplorer-sdk/**/*.{js,ts,tsx,mjs,cjs}",
  ],
  plugins: [require("tailwindcss-animate")],
};
