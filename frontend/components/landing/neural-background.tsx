"use client";

import { useEffect, useRef } from "react";

export function NeuralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let nodes: Node[] = [];
        let animationFrameId: number;

        // Mouse interactions
        const mouse = { x: -1000, y: -1000, radius: 200 };

        interface Node {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            connections: number[];
        }

        const initNodes = () => {
            nodes = [];
            const density = Math.floor((width * height) / 15000); // Responsive density

            for (let i = 0; i < density; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 1.5 + 0.5,
                    connections: []
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw nodes
            nodes.forEach((node, i) => {
                // Move
                node.x += node.vx;
                node.y += node.vy;

                // Bounce off walls
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                // Mouse repulsion
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 2;
                    const pushY = Math.sin(angle) * force * 2;

                    node.x -= pushX;
                    node.y -= pushY;
                }

                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(100, 200, 255, 0.5)"; // Cyan-ish
                ctx.fill();

                // Connect
                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeB = nodes[j];
                    const dist = Math.hypot(node.x - nodeB.x, node.y - nodeB.y);
                    const maxDist = 150;

                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        const opacity = 1 - dist / maxDist;
                        ctx.strokeStyle = `rgba(100, 200, 255, ${opacity * 0.15})`;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initNodes();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        initNodes();
        draw();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-slate-950"
            style={{
                background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)' // Deep navy/charcoal
            }}
        />
    );
}
