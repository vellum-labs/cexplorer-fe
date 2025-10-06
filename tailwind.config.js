/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("../cexplorer-sdk/tailwind.config")],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontSize: {
        xs: "12px",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      spacing: {
        desktop: "1440px",
        minHeight: "calc(100vh - 386px)",
      },
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        cardBg: "var(--cardBg)",
        primary: "var(--primary)",
        darkBlue: "var(--darkBlue)",
        secondaryText: "var(--secondaryText)",
        secondaryBg: "var(--secondaryBg)",
        darker: "var(--darker)",
        border: "var(--border)",
        borderDarker: "var(--borderDarker)",
        borderFaded: "var(--borderFaded)",
        grayTextPrimary: "var(--grayTextPrimary)",
        grayTextSecondary: "var(--grayTextSecondary)",
        all: "var(--all)",
        completed: "var(--completed)",
        inProgress: "var(--inProgress)",
        notStarted: "var(--notStarted)",
        bannerGradient: "var(--bannerGradient)",
        purpleText: "var(--purpleText)",
        redText: "var(--redText)",
        greenText: "var(--greenText)",
        yellowText: "var(--yellowText)",
        hoverHighlight: "var(--hoverHighlight)",
        highlightBorder: "var(--highlightBorder)",
        tableHover: "var(--tableHover)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
