/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    function ({ addVariant }) {
      addVariant("children", "& > *");
      require("tailwind-scrollbar-hide");
    },
  ],
};
