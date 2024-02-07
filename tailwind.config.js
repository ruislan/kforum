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
        img: {
            maxHeight: '698px',
            margin: '2px auto',
        }
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
            maxWidth: {
                'main': '680px'
            },
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
