/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
      padding: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "48px",
        desktop: "20px",
        mobile: "15px",
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
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fade: "fadeIn .3s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
