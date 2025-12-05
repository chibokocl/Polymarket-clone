module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        cobalt: {
          DEFAULT: "#0068B7",
          light: "#1A7FD0",
          soft: "rgba(0, 104, 183, 0.05)",
        },
        lapis: {
          DEFAULT: "#26619C",
        },
        cyanbrand: {
          DEFAULT: "#00A0E9",
          soft: "rgba(0, 160, 233, 0.07)",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(120deg, #0068B7 0%, #00A0E9 50%, #4FE3FF 100%)",
      },
      boxShadow: {
        "brand-soft": "0 18px 35px rgba(0, 104, 183, 0.18)",
        "brand-card": "0 10px 25px rgba(0, 104, 183, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      boxShadow: ["hover", "focus"],
      transform: ["hover", "focus"],
      translate: ["hover", "focus"],
      ringWidth: ["focus"],
      ringColor: ["focus"],
    },
  },
  plugins: [],
};
