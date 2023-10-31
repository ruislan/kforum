const proseCss = {
  css: {
    maxWidth: 'none',
    p: {
      marginTop: '2px',
      marginBottom: '2px',
    },
    ul: {
      marginTop: '2px',
      marginBottom: '2px',
    },
    'ul > li > *': {
      marginTop: '2px',
      marginBottom: '2px',
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
