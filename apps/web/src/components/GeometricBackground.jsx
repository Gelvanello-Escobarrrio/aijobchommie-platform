import React, { useEffect, useRef, useState } from 'react';

const GeometricBackground = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Geometric shape class
    class GeometricShape {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 100 + 50;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.1 + 0.05;
        this.type = Math.floor(Math.random() * 3); // 0: triangle, 1: square, 2: hexagon
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.baseSize = this.size;
        this.color = `hsl(${180 + Math.random() * 60}, 70%, 60%)`; // Cyan to purple
      }

      update() {
        this.rotation += this.rotationSpeed;
        
        // Pulse effect
        this.pulsePhase += 0.02;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * 10;
        
        // Mouse interaction
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          this.opacity = Math.min(0.3, this.opacity + force * 0.02);
          this.rotationSpeed += force * 0.001;
        } else {
          this.opacity = Math.max(0.05, this.opacity - 0.005);
          this.rotationSpeed *= 0.99;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        
        switch (this.type) {
          case 0: // Triangle
            this.drawTriangle();
            break;
          case 1: // Square
            this.drawSquare();
            break;
          case 2: // Hexagon
            this.drawHexagon();
            break;
          default:
            // Default to triangle if type is unexpected
            this.drawTriangle();
            break;
        }
        
        ctx.stroke();
        ctx.restore();
      }

      drawTriangle() {
        const size = this.size / 2;
        ctx.moveTo(0, -size);
        ctx.lineTo(-size * 0.866, size * 0.5);
        ctx.lineTo(size * 0.866, size * 0.5);
        ctx.closePath();
      }

      drawSquare() {
        const size = this.size / 2;
        ctx.rect(-size, -size, size * 2, size * 2);
      }

      drawHexagon() {
        const size = this.size / 2;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = size * Math.cos(angle);
          const y = size * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
    }

    // Create shapes
    const shapes = [];
    for (let i = 0; i < 15; i++) {
      shapes.push(new GeometricShape());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.4,
      }}
    />
  );
};

export default GeometricBackground;
