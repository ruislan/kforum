const proseCss = {
  css: {
    p: {
      marginTop: '6px',
      marginBottom: '6px',
    },
    ul: {
      marginTop: '6px',
      marginBottom: '6px',
    },
    'ul > li > *': {
      marginTop: '6px',
      marginBottom: '6px',
    },
  }
};
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: proseCss,
        sm: proseCss,
        lg: proseCss,
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
