'use client';
import { useEffect, useState } from 'react';
export function useIsScrollTop({ enabled = true }) {
    const [isTop, setIsTop] = useState();
    useEffect(() => {
        if (!enabled)
            return;
        const listener = () => {
            setIsTop(window.scrollY < 10);
        };
        listener();
        window.addEventListener('scroll', listener);
        return () => {
            window.removeEventListener('scroll', listener);
        };
    }, [enabled]);
    return isTop;
}
