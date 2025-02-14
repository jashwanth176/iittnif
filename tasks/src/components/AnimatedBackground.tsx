'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  originalX: number;
  originalY: number;
  angle: number;
  oscillationRadius: number;
  oscillationSpeed: number;
  targetX: number;
  targetY: number;
  moveDelay: number;
  margin: number;
  update: (canvasWidth: number, canvasHeight: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      originalX: number;
      originalY: number;
      angle: number;
      oscillationRadius: number;
      oscillationSpeed: number;
      targetX: number;
      targetY: number;
      moveDelay: number;
      margin: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.margin = 100;
        this.x = (Math.random() * (canvasWidth + 2 * this.margin)) - this.margin;
        this.y = (Math.random() * (canvasHeight + 2 * this.margin)) - this.margin;
        this.originalX = this.x;
        this.originalY = this.y;
        this.size = Math.random() * 4 + 1;
        this.speedX = 0;
        this.speedY = 0;
        this.color = Math.random() > 0.5 
          ? '#c2b28acc'  // Gold/beige with high opacity
          : '#951b2acc'; // Deep red with high opacity
        this.angle = Math.random() * Math.PI * 2;
        this.oscillationRadius = Math.random() * 80 + 40;
        this.oscillationSpeed = (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
        this.targetX = (Math.random() * (canvasWidth + 2 * this.margin)) - this.margin;
        this.targetY = (Math.random() * (canvasHeight + 2 * this.margin)) - this.margin;
        this.moveDelay = Math.random() * 400;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.moveDelay--;
        if (this.moveDelay <= 0) {
          this.targetX = (Math.random() * (canvasWidth + 2 * this.margin)) - this.margin;
          this.targetY = (Math.random() * (canvasHeight + 2 * this.margin)) - this.margin;
          this.moveDelay = Math.random() * 400 + 200;
        }

        const dx = this.targetX - this.originalX;
        const dy = this.targetY - this.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
          this.speedX += (dx / distance) * 0.01;
          this.speedY += (dy / distance) * 0.01;
        }

        this.angle += this.oscillationSpeed;
        this.x = this.originalX + Math.cos(this.angle) * this.oscillationRadius;
        this.y = this.originalY + Math.sin(this.angle) * this.oscillationRadius;

        const dxMouse = mouseRef.current.x - this.x;
        const dyMouse = mouseRef.current.y - this.y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distanceMouse < 200) {
          const force = (200 - distanceMouse) / 200;
          this.speedX -= (dxMouse / distanceMouse) * force * 0.4;
          this.speedY -= (dyMouse / distanceMouse) * force * 0.4;
        }

        this.originalX += this.speedX;
        this.originalY += this.speedY;
        this.speedX *= 0.90;
        this.speedY *= 0.90;

        if (this.originalX < 0 || this.originalX > canvasWidth) {
          this.speedX *= -0.5;
          this.originalX = Math.max(0, Math.min(this.originalX, canvasWidth));
        }
        if (this.originalY < 0 || this.originalY > canvasHeight) {
          this.speedY *= -0.5;
          this.originalY = Math.max(0, Math.min(this.originalY, canvasHeight));
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = 1;  // Full opacity for particles
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        particlesRef.current.forEach(particle => {
          const dx = this.x - particle.x;
          const dy = this.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.globalAlpha = (100 - distance) / 100 * 0.8;  // More visible connections
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;  // Slightly thicker lines
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
          }
        });
      }
    }

    particlesRef.current = Array.from(
      { length: 100 },
      () => new Particle(canvas.width, canvas.height)
    );

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none opacity-100"  // Full opacity
    />
  );
} 