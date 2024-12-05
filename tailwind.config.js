/** @type {import('tailwindcss').Config} */

import {EMB_FONT} from './src/components/constants';

module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',

        // Path to the Tremor module
        './node_modules/@tremor/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        transparent: 'transparent',
        current: 'currentColor',
        extend: {
            fontFamily: {
                sans: ['Montserrat'],
            },
            colors: {
                // Parcelytics Colors
                primary: {
                    DEFAULT: '#424D51',
                    '50': '#9CAAAE',
                    '100': '#91A0A5',
                    '200': '#7A8C93',
                    '300': '#67787E',
                    '400': '#546267',
                    '500': '#424D51',
                    '600': '#293032',
                    '700': '#101213',
                    '800': '#000000',
                    '900': '#000000'
                },
                secondary: {
                    '50': '#F8FBFD',
                    '100': '#E8F1F9',
                    '200': '#C8DEF1',
                    '300': '#A7CAE9',
                    '400': '#87B7E0',
                    '500': '#66A3D8',
                    '600': '#3988CD',
                    '700': '#2A6BA4',
                    '800': '#1E4E77',
                    '900': '#13314B'
                },
                gray: {
                    '750': '#242e3c',
                    '850': '#141b2a',
                    '950': '#0a0e16'
                },

                // light mode
                tremor: {
                    brand: {
                        faint: '#eff6ff', // blue-50
                        muted: '#bfdbfe', // blue-200
                        subtle: '#60a5fa', // blue-400
                        DEFAULT: '#3b82f6', // blue-500
                        emphasis: '#1d4ed8', // blue-700
                        inverted: '#ffffff' // white
                    },
                    background: {
                        muted: '#f9fafb', // gray-50
                        subtle: '#f3f4f6', // gray-100
                        DEFAULT: '#ffffff', // white
                        emphasis: '#374151' // gray-700
                    },
                    border: {
                        DEFAULT: '#e5e7eb' // gray-200
                    },
                    ring: {
                        DEFAULT: '#e5e7eb' // gray-200
                    },
                    content: {
                        subtle: '#9ca3af', // gray-400
                        DEFAULT: '#6b7280', // gray-500
                        emphasis: '#374151', // gray-700
                        strong: '#111827', // gray-900
                        inverted: '#ffffff' // white
                    }
                },
                'custom-tremor': {
                    content: {
                        DEFAULT: 'green'
                    }
                },
                // dark mode
                'dark-tremor': {
                    brand: {
                        faint: '#0B1229', // custom
                        muted: '#172554', // blue-950
                        subtle: '#1e40af', // blue-800
                        DEFAULT: '#3b82f6', // blue-500
                        emphasis: '#60a5fa', // blue-400
                        inverted: '#030712' // gray-950
                    },
                    background: {
                        muted: '#131A2B', // custom
                        subtle: '#1f2937', // gray-800
                        DEFAULT: '#111827', // gray-900
                        emphasis: '#d1d5db' // gray-300
                    },
                    border: {
                        DEFAULT: '#1f2937' // gray-800
                    },
                    ring: {
                        DEFAULT: '#1f2937' // gray-800
                    },
                    content: {
                        subtle: '#4b5563', // gray-600
                        DEFAULT: '#6b7280', // gray-600
                        emphasis: '#e5e7eb', // gray-200
                        strong: '#f9fafb', // gray-50
                        inverted: '#000000' // black
                    }
                }
            },
            boxShadow: {
                // light
                'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                // dark
                'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'dark-tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'dark-tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            },
            borderRadius: {
                'tremor-small': '0.375rem',
                'tremor-default': '0.5rem',
                'tremor-full': '9999px',
                'xl': '1rem',
            },
            fontSize: {
                'tremor-label': ['0.75rem'],
                'tremor-default': ['0.875rem', {lineHeight: '1.25rem'}],
                'tremor-title': ['1.125rem', {lineHeight: '1.75rem'}],
                'tremor-metric': ['1.875rem', {lineHeight: '2.25rem'}]
            }
        }
    },
    safelist: [
        // Gray
        'border-gray-600', 'text-gray-600', 'bg-gray-600', 'focus:ring-gray-500', 'border-gray-300', 'dark:text-gray-600', 'dark:text-gray-500', 'dark:focus:ring-gray-500',

        // Secondary
        'border-secondary-600', 'text-secondary-600', 'bg-secondary-600', 'focus:ring-secondary-500', 'dark:text-secondary-600', 'dark:text-secondary-500', 'dark:focus:ring-secondary-500',

        // Indigo
        'border-indigo-600', 'text-indigo-600', 'bg-indigo-600', 'focus:ring-indigo-500', 'dark:text-indigo-600', 'dark:text-indigo-500', 'dark:focus:ring-indigo-500',

        // Green
        'border-green-600', 'text-green-600', 'bg-green-600', 'focus:ring-green-500', 'dark:text-green-600', 'dark:text-green-500', 'dark:focus:ring-green-500',

        // Yellow
        'border-yellow-600', 'text-yellow-600', 'bg-yellow-600', 'focus:ring-yellow-500', 'dark:text-yellow-600', 'dark:text-yellow-500', 'dark:focus:ring-yellow-500',

        // Orange
        'border-orange-600', 'text-orange-600', 'bg-orange-600', 'focus:ring-orange-500', 'dark:text-orange-600', 'dark:text-orange-500', 'dark:focus:ring-orange-500',

        // Red
        'border-red-600', 'text-red-600', 'bg-red-600', 'focus:ring-red-500', 'dark:text-red-600', 'dark:text-red-500', 'dark:focus:ring-red-500',

        // Pink
        'border-pink-600', 'text-pink-600', 'bg-pink-600', 'focus:ring-pink-500', 'dark:text-pink-600', 'dark:text-pink-500', 'dark:focus:ring-pink-500',
        {
            pattern:
                /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected']
        },
        {
            pattern:
                /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected']
        },
        {
            pattern:
                /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected']
        },
        {
            pattern:
                /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
        },
        {
            pattern:
                /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
        },
        {
            pattern:
                /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
        }
    ],
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@headlessui/tailwindcss'),
        require('tailwindcss-themer')({
            themes: [
                {
                    name: 'first-theme',
                    extend: {
                        colors: {
                            tremor: {
                                content: {
                                    DEFAULT: 'red'
                                }
                            }
                        }
                    }
                },
                {
                    name: 'second-theme',
                    extend: {
                        colors: {
                            tremor: {
                                content: {
                                    DEFAULT: 'green'
                                }
                            }
                        }
                    }
                },
                {
                    name: 'third-theme',
                    extend: {
                        colors: {
                            tremor: {
                                content: {
                                    DEFAULT: 'yellow'
                                }
                            }
                        }
                    }
                }
            ]
        })
    ]
};
