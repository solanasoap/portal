/** @type {import('tailwindcss').Config} */
const conicGradient = (theme, direction, colorList) => {
  const params = [
    direction,
    ...colorList.map((color) => theme(`colors.${color}`)),
  ];

  return `conic-gradient(${params.join(", ")})`;
};

const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        neueHaasUnicaRegular: ["NeueHaasUnica-Regular", "sans-serif"],
        neueHaasUnicaBlack: ["NeueHaasUnica-Black", "sans-serif"],
        phenomenaBlack: ["Phenomena-Black", "sans-serif"],
        phenomenaRegular: ["Phenomena-Regular", "sans-serif"],
      },
      colors: {
        "RBGradient-Red-Left": "#db2777",
        "RBGradient-Blue-Right": "#e20b8c",
        phantomBottomLeft: "#5421EF",
        phantomTopRight: "#5348B6",
        greenTopRight: "#aefb2a",
        greenBottomLeft: "#57ebde",
        slightlyLighterBg: "#262626",
        shinyBlue: "#14A7EA",
        veryPink: "#E52E6B",
        peach: "#F9968A",
        justPurple: "#9356EF",
        amber: colors.amber,
        lightBlue: colors.sky,
        rose: colors.rose,
        gray: colors.gray,
      },
      backgroundImage: (theme) => ({
        "conic-gradient": conicGradient(theme, "from 300deg", [
          "red.400",
          "amber.100",
          "lightBlue.500",
          "blue.300",
          "purple.600",
          "pink.500",
          "rose.600",
          "red.400",
        ]),
      }),
    },
  },
  // plugins: [require("@tailwindcss/aspect-ratio")],
};
