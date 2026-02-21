import React, { useState, useMemo, useEffect } from "react";
import ThemeContext from "../contexts/themeContext";
import { themeTokens, applyThemeTokens } from "../utils/themeTokens";

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    // Apply the theme class globally and inject dynamic CSS variables
    useEffect(() => {
        document.documentElement.className = `theme-${theme}`;
        document.body.className = `theme-${theme}`;

        // Inject the CSS variables via a global style block
        applyThemeTokens(themeTokens[theme]);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;