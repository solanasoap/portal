/** @type {import('tailwindcss').Config} */
const conicGradient = (theme, direction, colorList) => {
  const params = [direction, ...colorList.map((color) => theme(`colors.${color}`))]

  return `conic-gradient(${params.join(', ')})`
}

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
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
        'RBGradient-Red-Left': '#D00E0E',
        'RBGradient-Blue-Right': '#3D05DD',
        'phantomBottomLeft': '#5421EF',
        'phantomTopRight': '#5348B6',
        'greenTopRight': '#aefb2a',
        'greenBottomLeft': '#57ebde',
        amber: colors.amber,
        lightBlue: colors.sky,
        rose: colors.rose,
        gray: colors.gray,
      },
      backgroundImage: (theme) => ({
        'conic-gradient': conicGradient(theme, 'from 300deg', [
          'red.400',
          'amber.100',
          'lightBlue.500',
          'blue.300',
          'purple.600',
          'pink.500',
          'rose.600',
          'red.400',
        ]),
      }),
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
