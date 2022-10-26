/** @type {import('tailwindcss').Config} */
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
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
