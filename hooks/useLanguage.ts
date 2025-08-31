// // hooks/useLanguage.ts
// "use client";

// import { useState, useEffect } from "react";
// import type { Language } from "@/lib/i18n";

// const VALID_LANGUAGES: Language[] = ["en", "id"];

// export function useLanguage() {
//   const [language, setLanguage] = useState<Language>("en");
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const saved = localStorage.getItem("brewcraft-language") as Language | null;
//     const langToSet = saved && VALID_LANGUAGES.includes(saved) ? saved : "en";

//     setLanguage(langToSet);
//     if (!saved) {
//       localStorage.setItem("brewcraft-language", langToSet);
//     }

//     setIsReady(true);
//   }, []);

//   const changeLanguage = (newLanguage: Language) => {
//     if (!VALID_LANGUAGES.includes(newLanguage)) return;
//     setLanguage(newLanguage);
//     localStorage.setItem("brewcraft-language", newLanguage);
//   };

//   return { language, changeLanguage, isReady };
// }
