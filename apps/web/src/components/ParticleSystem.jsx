import React, { useEffect, useRef } from 'react';

const ParticleSystem = () => {
  const canvasRef = useRef(null);

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

    // Vibrant neon color palette
    const neonColors = [
      { hue: 180, name: 'cyan' },      // #00ffff
      { hue: 300, name: 'magenta' },   // #ff00ff
      { hue: 135, name: 'lime' },      // #00ff41
      { hue: 270, name: 'purple' },    // #9d00ff
      { hue: 25, name: 'orange' },     // #ff6b00
      { hue: 210, name: 'blue' }       // #0099ff
    ];

    // Enhanced Particle class with vibrant neon effects
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.life = Math.random() * 0.8 + 0.4;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = Math.random() * 1.5 + 0.5;
        this.life = 1;
        this.decay = Math.random() * 0.008 + 0.002;
        this.size = Math.random() * 2.5 + 0.5;
        this.colorIndex = Math.floor(Math.random() * neonColors.length);
        this.hue = neonColors[this.colorIndex].hue;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.pulse += this.pulseSpeed;

        if (this.life <= 0 || this.y > canvas.height + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        
        // Pulsing effect
        const pulseFactor = 0.7 + Math.sin(this.pulse) * 0.3;
        const currentOpacity = this.life * 0.9 * pulseFactor;
        const currentSize = this.size * pulseFactor;
        
        ctx.globalAlpha = currentOpacity;
        ctx.shadowBlur = 25;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
        
        // Create enhanced gradient for particle
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, currentSize * 2
        );
        gradient.addColorStop(0, `hsl(${this.hue}, 100%, 90%)`);
        gradient.addColorStop(0.4, `hsl(${this.hue}, 100%, 70%)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 30%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Shooting Star class for enhanced effects
    class ShootingStar {
      constructor() {
        this.reset();
        this.tail = [];
        this.maxTailLength = 20;
      }

      reset() {
        this.x = -100;
        this.y = Math.random() * canvas.height * 0.6;
        this.vx = 6 + Math.random() * 4;
        this.vy = 1 + Math.random() * 2;
        this.size = 3 + Math.random() * 2;
        this.life = 1;
        this.decay = 0.005 + Math.random() * 0.003;
        this.colorIndex = Math.floor(Math.random() * neonColors.length);
        this.hue = neonColors[this.colorIndex].hue;
        this.tail = [];
      }

      update() {
        // Add current position to tail
        this.tail.push({ x: this.x, y: this.y, life: this.life });
        if (this.tail.length > this.maxTailLength) {
          this.tail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
      }

      draw() {
        ctx.save();
        
        // Draw tail
        this.tail.forEach((point, index) => {
          const tailAlpha = (index / this.tail.length) * point.life * 0.7;
          const tailSize = this.size * (index / this.tail.length) * 0.8;
          
          if (tailAlpha > 0.05) {
            ctx.globalAlpha = tailAlpha;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
            
            const gradient = ctx.createRadialGradient(
              point.x, point.y, 0,
              point.x, point.y, tailSize * 2
            );
            gradient.addColorStop(0, `hsl(${this.hue}, 100%, 80%)`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 40%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, tailSize, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Draw main star
        if (this.life > 0.1) {
          ctx.globalAlpha = this.life;
          ctx.shadowBlur = 30;
          ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
          
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
          );
          gradient.addColorStop(0, `hsl(${this.hue}, 100%, 95%)`);
          gradient.addColorStop(0.5, `hsl(${this.hue}, 100%, 70%)`);
          gradient.addColorStop(1, `hsla(${this.hue}, 100%, 40%, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }

      isDead() {
        return this.life <= 0 || this.x > canvas.width + 100;
      }
    }

    // Create particles (responsive count)
    const particleCount = window.innerWidth > 768 ? 60 : 25;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Create shooting stars array
    const shootingStars = [];
    
    // Function to create shooting stars
    const createShootingStar = () => {
      if (shootingStars.length < 3 && Math.random() < 0.7) {
        shootingStars.push(new ShootingStar());
      }
    };
    
    // Create shooting stars periodically
    const starInterval = setInterval(createShootingStar, 4000);
    
    // Initial shooting star
    setTimeout(createShootingStar, 1000);

    // Enhanced animation loop
    const animate = () => {
      // Create subtle trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.update();
        star.draw();
        
        if (star.isDead()) {
          shootingStars.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      clearInterval(starInterval);
    };
  }, []);

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
        zIndex: 1,
        opacity: window.innerWidth > 768 ? 0.7 : 0.4,
      }}
    />
  );
};

export default ParticleSystem;
