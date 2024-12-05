import { useEffect, useState, useRef } from 'react';

const useDarkMode = () => {
    // State to keep track of whether dark mode is enabled or not.
    // Initializes from localStorage to persist user's preference across sessions.
    const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode') || 'false'));

    // A ref to the top-level container element of the component using this hook.
    // This allows us to directly manipulate the shadow DOM to apply dark mode classes.
    const containerRef = useRef(null);

    useEffect(() => {
        // Handler function for dark mode changes. This function gets called
        // whenever the custom 'darkModeChange' event is dispatched on the window object.
        const handleDarkModeChange = (event) => {
            setIsDarkMode(event.detail.darkMode);

            // Directly manipulate the DOM to apply/remove the 'dark' class. This enables the use of
            // Tailwind's `dark:` variants within components using this hook.
            if (containerRef.current) {
                if (event.detail.darkMode) {
                    containerRef.current.classList.add('dark');
                } else {
                    containerRef.current.classList.remove('dark');
                }
            }
        };

        // Add an event listener for 'darkModeChange' event.
        window.addEventListener('darkModeChange', handleDarkModeChange);

        // Immediately dispatch a 'darkModeChange' event upon mounting the component.
        // This ensures that the component initializes with the correct dark mode state,
        // even if it mounts after the initial page load where the dark mode was determined.
        window.dispatchEvent(new CustomEvent('darkModeChange', { detail: { darkMode: isDarkMode } }));

        return () => {
            window.removeEventListener('darkModeChange', handleDarkModeChange);
        };
    }, [isDarkMode]);

    return { isDarkMode, containerRef };
};

export default useDarkMode;