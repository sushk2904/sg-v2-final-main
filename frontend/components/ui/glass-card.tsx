"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? {
                y: -5,
                backgroundColor: "rgba(30, 41, 59, 0.7)",
                borderColor: "rgba(56, 189, 248, 0.3)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5), 0 0 20px -5px rgba(56, 189, 248, 0.15)"
            } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
                "relative rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden group",
                "transition-colors duration-300",
                className
            )}
            {...props}
        >
            {/* Glossy sheen effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {children}
        </motion.div>
    );
}
