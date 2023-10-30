const proseCss = {
  css: {
    maxWidth: 'none',
    p: {
      marginTop: '4px',
      marginBottom: '4px',
    },
    ul: {
      marginTop: '4px',
      marginBottom: '4px',
    },
    'ul > li > *': {
      marginTop: '4px',
      marginBottom: '4px',
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
