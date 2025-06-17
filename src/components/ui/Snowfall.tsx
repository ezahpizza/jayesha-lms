import { useEffect, useRef } from 'react';

// Color for snowflakes
const SNOW_COLOR = '#ffede2';
const SNOWFLAKE_COUNT = 80;

export function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let snowflakes = Array.from({ length: SNOWFLAKE_COUNT }, () => createSnowflake(width, height));

    function createSnowflake(w: number, h: number) {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1.5,
        d: Math.random() * 1 + 0.5,
        drift: (Math.random() - 0.5) * 0.5,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.85;
      for (let flake of snowflakes) {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fillStyle = SNOW_COLOR;
        ctx.shadowColor = SNOW_COLOR;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.closePath();
      }
      ctx.restore();
      update();
      requestAnimationFrame(draw);
    }

    function update() {
      for (let flake of snowflakes) {
        flake.y += flake.d;
        flake.x += flake.drift;
        if (flake.y > height) {
          flake.x = Math.random() * width;
          flake.y = -flake.r;
        }
        if (flake.x > width || flake.x < 0) {
          flake.x = Math.random() * width;
        }
      }
    }

    draw();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      snowflakes = Array.from({ length: SNOWFLAKE_COUNT }, () => createSnowflake(width, height));
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
