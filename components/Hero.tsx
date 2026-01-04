import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  
  // Refs to communicate with the animation loop without re-renders
  const isHoveringName = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Mouse interaction variables
    let mouseX = -1000;
    let mouseY = -1000;
    
    // Particle system configuration
    const fontSize = 14;
    
    // --- PRE-RENDERING OPTIMIZATION ---
    // Sprite generation for performance
    const SPRITE_COUNT = 40; // High resolution gradient
    const SPRITE_SIZE = 32;  
    const glowSprites: HTMLCanvasElement[] = [];

    // Colors: Blue (#4285F4) -> Purple (#9B72CB)
    const colorStart = { r: 66, g: 133, b: 244 };   
    const colorEnd = { r: 155, g: 114, b: 203 };    

    const initSprites = () => {
        glowSprites.length = 0; 
        for (let i = 0; i < SPRITE_COUNT; i++) {
            const sprite = document.createElement('canvas');
            sprite.width = SPRITE_SIZE;
            sprite.height = SPRITE_SIZE;
            const sCtx = sprite.getContext('2d');
            if (!sCtx) continue;

            const factor = i / (SPRITE_COUNT - 1);
            const r = colorStart.r + (colorEnd.r - colorStart.r) * factor;
            const g = colorStart.g + (colorEnd.g - colorStart.g) * factor;
            const b = colorStart.b + (colorEnd.b - colorStart.b) * factor;
            const colorString = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

            const center = SPRITE_SIZE / 2;
            const radius = 2.0; // Slightly smaller core for cleaner dust look

            // Strong Glow
            sCtx.shadowBlur = 12; 
            sCtx.shadowColor = colorString;
            sCtx.fillStyle = colorString;
            
            sCtx.beginPath();
            sCtx.arc(center, center, radius, 0, Math.PI * 2);
            sCtx.fill();

            // Hot Core
            sCtx.shadowBlur = 0;
            sCtx.fillStyle = '#FFFFFF';
            sCtx.beginPath();
            sCtx.arc(center, center, radius * 0.5, 0, Math.PI * 2);
            sCtx.fill();

            glowSprites.push(sprite);
        }
    };

    initSprites();

    interface Particle {
        x: number;
        y: number;
        speed: number;
        char: string;
        // Animation properties
        targetX: number | null;
        targetY: number | null;
        vx: number; 
        vy: number; 
        scale: number; 
        // Seeds for deterministic shape formation & scatter
        seedA: number; 
        seedB: number; 
        seedC: number; 
        seedD: number; 
        seedE: number; // Scatter X
        seedF: number; // Scatter Y
    }
    
    let particles: Particle[] = [];

    const initParticles = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        const columns = Math.ceil(width / fontSize);
        // High density for "Dust" effect
        const particleCount = columns * 14; 
        const chars = "01";

        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.floor(Math.random() * columns) * fontSize,
                y: Math.random() * height,
                speed: Math.random() * 0.2 + 0.1, 
                char: chars[Math.floor(Math.random() * chars.length)],
                targetX: null,
                targetY: null,
                vx: 0,
                vy: 0,
                scale: Math.random() * 0.5 + 0.5,
                seedA: Math.random(),
                seedB: Math.random(),
                seedC: Math.random(),
                seedD: Math.random(),
                seedE: Math.random(),
                seedF: Math.random()
            });
        }
    };

    initParticles();

    // --- ORGANIC HOLLOW TUBE MATH ---
    const getCloudPoint = (
        x1: number, y1: number, 
        x2: number, y2: number, 
        progress: number, 
        thickness: number,
        seedDist: number, 
        seedSide: number,
        seedScatterX: number,
        seedScatterY: number
    ) => {
        // Linear Interpolation
        const px = x1 + (x2 - x1) * progress;
        const py = y1 + (y2 - y1) * progress;
        
        // Perpendicular Vector (Normal)
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        
        let nx = 0, ny = 0;
        if (len > 0) {
            nx = -dy / len;
            ny = dx / len;
        }

        // --- HOLLOW DENSITY LOGIC ---
        // Force particles to edges to avoid "Center Line" artifact.
        // 80% of particles in the outer 40% of thickness.
        // 20% in the inner 60%.
        
        let rFactor = 0;
        // Threshold check for "Crust" vs "Core"
        if (seedDist > 0.2) { 
            // CRUST (Outer Layer)
            // Map 0.2..1.0 -> 0.6..1.0
            const n = (seedDist - 0.2) / 0.8;
            rFactor = 0.6 + (n * 0.4); 
        } else {
            // CORE (Inner Layer - Sparse)
            // Map 0.0..0.2 -> 0.0..0.6
            const n = seedDist / 0.2;
            rFactor = n * 0.6;
        }

        const side = seedSide > 0.5 ? 1 : -1;
        const offset = side * rFactor * (thickness * 0.5);

        // --- SCATTER / SPRAY ---
        // Use extra seeds to break the line completely.
        // +/- 12px scatter for cosmic dust feel
        const scatterX = (seedScatterX - 0.5) * 12; 
        const scatterY = (seedScatterY - 0.5) * 12;

        return { 
            x: px + (nx * offset) + scatterX, 
            y: py + (ny * offset) + scatterY 
        };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px 'Inter', monospace`;
      
      const interactionRadius = 150;

      // --- Calculate positions relative to Canvas ---
      let textRect: DOMRect | null = null;
      let containerRect: DOMRect | null = null;
      let relativeTextTop = 0;
      let relativeTextLeft = 0;
      let relativeTextRight = 0;
      let relativeTextHeight = 0;

      if (isHoveringName.current && nameRef.current && containerRef.current) {
          textRect = nameRef.current.getBoundingClientRect();
          containerRect = containerRef.current.getBoundingClientRect();
          
          relativeTextTop = textRect.top - containerRect.top;
          relativeTextLeft = textRect.left - containerRect.left;
          relativeTextRight = textRect.right - containerRect.left;
          relativeTextHeight = textRect.height;
      }

      // Shape Configuration
      const symbolHeight = relativeTextHeight * 2.3; 
      const symbolWidth = symbolHeight * 0.55; 
      const thickness = 65; // Slightly thinner base for elegance
      const sideGap = 70; 

      const centerY = relativeTextTop + relativeTextHeight / 2;

      // Define Symbol Boundaries for Gradient Calculation
      let leftSymbolMinX = 0;
      let rightSymbolMaxX = 0;

      if (textRect) {
         leftSymbolMinX = (relativeTextLeft - sideGap) - symbolWidth;
         rightSymbolMaxX = (relativeTextRight + sideGap) + symbolWidth + 40; 
      }
      
      const gradientWidth = rightSymbolMaxX - leftSymbolMinX;

      particles.forEach((p, index) => {
        let hasTarget = false;
        
        // --- SHAPE FORMATION LOGIC ---
        if (textRect && containerRect) {
            
            if (p.seedA < 0.35) {
                // --- LEFT SYMBOL: < ---
                hasTarget = true;
                
                const openX = relativeTextLeft - sideGap;
                const apexX = openX - symbolWidth; 
                const topY = centerY - symbolHeight / 2;
                const bottomY = centerY + symbolHeight / 2;

                if (p.seedB < 0.5) {
                    const progress = p.seedB * 2; 
                    const pt = getCloudPoint(openX, topY, apexX, centerY, progress, thickness, p.seedC, p.seedD, p.seedE, p.seedF);
                    p.targetX = pt.x;
                    p.targetY = pt.y;
                } else {
                    const progress = (p.seedB - 0.5) * 2;
                    const pt = getCloudPoint(apexX, centerY, openX, bottomY, progress, thickness, p.seedC, p.seedD, p.seedE, p.seedF);
                    p.targetX = pt.x;
                    p.targetY = pt.y;
                }

            } else if (p.seedA < 0.70) {
                // --- RIGHT SYMBOL: /> ---
                hasTarget = true;
                const startX = relativeTextRight + sideGap;
                
                if (p.seedB < 0.3) {
                    // Slash (/)
                    const slashW = symbolWidth * 0.4;
                    const sX1 = startX; 
                    const sY1 = centerY + symbolHeight * 0.5;
                    const sX2 = startX + slashW;
                    const sY2 = centerY - symbolHeight * 0.5; 

                    const progress = p.seedB / 0.3;
                    const pt = getCloudPoint(sX1, sY1, sX2, sY2, progress, thickness, p.seedC, p.seedD, p.seedE, p.seedF);
                    p.targetX = pt.x;
                    p.targetY = pt.y;
                } else {
                    // Greater Than (>)
                    const gapSlash = 30;
                    const gtStartX = startX + (symbolWidth * 0.4) + gapSlash;
                    const apexX = gtStartX + symbolWidth * 0.6;
                    const openX = gtStartX;
                    const topY = centerY - symbolHeight / 2;
                    const bottomY = centerY + symbolHeight / 2;

                    const localSeed = (p.seedB - 0.3) / 0.7;

                    if (localSeed < 0.5) {
                        const progress = localSeed * 2;
                        const pt = getCloudPoint(openX, topY, apexX, centerY, progress, thickness, p.seedC, p.seedD, p.seedE, p.seedF);
                        p.targetX = pt.x;
                        p.targetY = pt.y;
                    } else {
                        const progress = (localSeed - 0.5) * 2;
                        const pt = getCloudPoint(apexX, centerY, openX, bottomY, progress, thickness, p.seedC, p.seedD, p.seedE, p.seedF);
                        p.targetX = pt.x;
                        p.targetY = pt.y;
                    }
                }
            }
        }

        if (hasTarget && p.targetX !== null && p.targetY !== null) {
            // --- MODE: ACTIVE (FORMING SHAPE) ---
            
            p.x += (p.targetX - p.x) * 0.1;
            p.y += (p.targetY - p.y) * 0.1;
            p.vx = 0;
            p.vy = 0;

            // --- JITTER (Live Vibration) ---
            // Adds organic electric feel
            const jitterStrength = 1.5;
            const drawX = p.x + (Math.random() - 0.5) * jitterStrength;
            const drawY = p.y + (Math.random() - 0.5) * jitterStrength;

            // --- GLOBAL GRADIENT COLOR ---
            // Map position to 0..1 across the whole formation width
            let colorFactor = 0.5;
            if (gradientWidth > 0) {
                // Use actual X for smoother color transition across space
                colorFactor = (drawX - leftSymbolMinX) / gradientWidth;
            }
            colorFactor = Math.max(0, Math.min(1, colorFactor));

            // Select Sprite
            const spriteIndex = Math.floor(colorFactor * (SPRITE_COUNT - 1));
            const sprite = glowSprites[spriteIndex] || glowSprites[0];

            if (sprite) {
                const drawSize = SPRITE_SIZE * p.scale;
                ctx.globalCompositeOperation = 'lighter';
                ctx.drawImage(sprite, drawX - drawSize / 2, drawY - drawSize / 2, drawSize, drawSize);
                ctx.globalCompositeOperation = 'source-over';
            }

        } else {
            // --- MODE: FALLING (MATRIX TEXT) ---
            
            if (p.targetX !== null) {
                p.vx = (Math.random() - 0.5) * 8;
                p.vy = (Math.random() - 0.5) * 8;
                p.targetX = null;
                p.targetY = null;
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.y += p.speed;

            // Mouse Repulsion
            const distToMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
            if (distToMouse < interactionRadius) {
                const angle = Math.atan2(p.y - mouseY, p.x - mouseX);
                const force = (interactionRadius - distToMouse) / interactionRadius;
                const pushDistance = force * 6; 
                p.x += Math.cos(angle) * pushDistance;
                p.y += Math.sin(angle) * pushDistance;
            }

            if (p.y > height) {
                p.y = -20;
                p.x = Math.floor(Math.random() * Math.ceil(width / fontSize)) * fontSize;
                p.speed = Math.random() * 0.3 + 0.1;
            }

            // Render as TEXT
            const cx = width / 2;
            const cy = height / 2;
            const distFromCenter = Math.hypot(p.x - cx, p.y - cy);
            const focusRadius = Math.min(width, height) * 0.45;
            
            let alpha = 1;
            if (distFromCenter < focusRadius) {
                alpha = Math.pow(distFromCenter / focusRadius, 3);
            }

            if (alpha > 0.05) {
                ctx.fillStyle = `rgba(160, 174, 192, ${alpha * 0.6})`;
                ctx.fillText(p.char, p.x, p.y);
            }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      initParticles();
      initSprites();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        } else {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
    };

    const handleMouseLeave = () => {
        mouseX = -1000;
        mouseY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Content Layer */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
        
        <h2 className="text-lg md:text-xl text-gray-500 font-medium tracking-widest uppercase mb-4 animate-[fadeIn_1s_ease-out]">
            Software Engineering Student & Junior Developer
        </h2>

        {/* 
            Interaction Target 
        */}
        <h1 
            ref={nameRef}
            onMouseEnter={() => isHoveringName.current = true}
            onMouseLeave={() => isHoveringName.current = false}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-tight text-black py-4 cursor-default select-none relative z-20"
        >
          Gabriel<br className="md:hidden" /> Henrique <br />
          Colis
        </h1>

        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-700 font-light leading-relaxed pt-4">
          I apply software engineering to transform real-world problems into <span className="font-semibold text-black">functional</span>, <span className="font-semibold text-black">clear</span>, and <span className="font-semibold text-black">well-structured</span> solutions.
        </p>
      </div>
    </section>
  );
};

export default Hero;