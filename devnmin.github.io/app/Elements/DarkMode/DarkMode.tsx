"use client";

import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface IDarkMode {}

function DarkMode({}: IDarkMode) {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const onClick = (mode: string) => () => {
    setTheme(mode);
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="bg-darkModeBg cursor-pointer rounded-[50%] p-1">
    {currentTheme === "dark" ? (
    <BsFillMoonFill onClick={onClick("light")} />
) : (
  <BsFillSunFill onClick={onClick("dark")} />
)}
  </div>
);
}

export default DarkMode;