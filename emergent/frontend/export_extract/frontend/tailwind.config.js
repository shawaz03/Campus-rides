/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        hand: ['"Patrick Hand"', "cursive"],
        scribble: ['"Caveat"', "cursive"],
        body: ['"Gaegu"', "cursive"],
        marker: ['"Permanent Marker"', "cursive"],
      },
      colors: {
        cream: "#FDF6E3",
        ink: "#1B1B1F",
        sun: "#FFD23F",
        tomato: "#FF5A36",
        sky: "#5BC0EB",
        leaf: "#7BC950",
        plum: "#9B5DE5",
        peach: "#FFB4A2",
      },
      keyframes: {
        wobble: {
          "0%,100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        drift: {
          "0%,100%": { transform: "translateY(0) rotate(0)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        dashdraw: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        wobble: "wobble 2.5s ease-in-out infinite",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
