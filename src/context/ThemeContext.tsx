import { createContext, useEffect, useState } from "react";

// ✅ Provide a strict default context structure
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ Ensure only "light" or "dark" is used
  const getPreferredTheme = (): "light" | "dark" => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light"; // Default to "light" if invalid
  };

  const [theme, setTheme] = useState<"light" | "dark">(getPreferredTheme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme); // ✅ Store as string only
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
