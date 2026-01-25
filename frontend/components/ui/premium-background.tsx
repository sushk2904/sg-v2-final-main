
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function PremiumBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Canvas 2D context not found");
            return;
        }

        // Set canvas size immediately
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let width = canvas.width;
        let height = canvas.height;

        const particles: Particle[] = [];
        const particleCount = Math.min(Math.floor(width * height / 10000), 150); // Increased density
        const connectionDistance = 150;
        const mouseDistance = 250;

        // console.log("Spawning particles:", particleCount);

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8; // Slightly faster
                this.vy = (Math.random() - 0.5) * 0.8;
                this.size = Math.random() * 2 + 1; // Larger particles
                // Brighter colors (Cyan-400, Blue-400)
                this.color = Math.random() > 0.5 ? "rgba(34, 211, 238," : "rgba(96, 165, 250,";
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (repulsion)
                const dx = mouseRef.current.x - this.x;
                const dy = mouseRef.current.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    const repulsionStrength = 2.0; // Stronger repulsion for visibility

                    const directionX = forceDirectionX * force * repulsionStrength;
                    const directionY = forceDirectionY * force * repulsionStrength;

                    this.vx -= directionX * 0.05;
                    this.vy -= directionY * 0.05;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + " 0.8)"; // 80% opacity
                ctx.fill();
            }
        }

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and Draw Particles
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            // Draw Connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        const opacity = 1 - distance / connectionDistance;
                        ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.25})`; // Slate-400, more visible
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                const dx = mouseRef.current.x - particles[i].x;
                const dy = mouseRef.current.y - particles[i].y;
                const distMouse = Math.sqrt(dx * dx + dy * dy);
                if (distMouse < mouseDistance) {
                    ctx.beginPath();
                    const opacity = 1 - distMouse / mouseDistance;
                    ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.4})`; // Cyan, brighter
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                    ctx.stroke();
                }
            }

            requestAnimationFrame(animate);
        };

        init();

        // Initial mouse position far off screen so it doesn't disturb immediately
        mouseRef.current = { x: -500, y: -500 };

        requestAnimationFrame(animate);

        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0A0E17]">
            {/* Base Gradient - Reduced opacity to let canvas pop */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E17] via-[#0f172a] to-[#050810] opacity-90" />

            {/* Canvas Layer - High Z-index relative to gradient */}
            <canvas ref={canvasRef} className="absolute inset-0 block z-0" />

            {/* Atmospheric Glow Overlay */}
            <motion.div
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"
            />
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"
            />
        </div>
    );
}
