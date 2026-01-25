"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over interactive elements
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.closest(".interactive-card")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", updatePosition);
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* Main cursor dot */}
            <div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-cyan-400 pointer-events-none z-[100] mix-blend-screen transition-transform duration-100 ease-out"
                style={{
                    transform: `translate(${position.x - 8}px, ${position.y - 8}px) scale(${isHovering ? 0.5 : 1})`,
                }}
            />

            {/* Trailing glow */}
            <div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-500/50 pointer-events-none z-[99] transition-all duration-300 ease-out"
                style={{
                    transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isHovering ? 2.5 : 1})`,
                    background: isHovering ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                    borderColor: isHovering ? 'rgba(34, 211, 238, 0.8)' : 'rgba(34, 211, 238, 0.3)',
                }}
            />
        </>
    );
}
