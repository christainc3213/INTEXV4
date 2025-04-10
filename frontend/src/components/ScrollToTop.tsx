// src/components/ScrollToTop.tsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // wait until the next frame so the browser can’t override us
        requestAnimationFrame(() => window.scrollTo(0, 0));
    }, [pathname]);

    return null;
}
