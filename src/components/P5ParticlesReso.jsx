import Sketch from "react-p5";
import { useGlobalContext } from "../context/GlobalContext";
import { useIA } from "../context/ia/IAContext";

export default function P5ParticlesReso() {
  const { bubbles, links } = useGlobalContext();
  const { iaLoading } = useIA();

  const energy = links.length * 2 + bubbles.length;
  const numParticles = Math.min(80 + energy, 250);

  let particles = [];

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-1, 1),
        vy: p5.random(-1, 1),
        size: p5.random(1, 4),
        color: p5.color(iaLoading ? '#ff0077' : '#0d47a1'),
      });
    }
  };

  const draw = (p5) => {
    p5.clear();

    // Fond semi-transparent pour effet de persistance
    p5.background(0, 0, 0, 20);

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // rebond
      if (p.x < 0 || p.x > p5.width) p.vx *= -1;
      if (p.y < 0 || p.y > p5.height) p.vy *= -1;

      // dessin
      p5.noStroke();
      p5.fill(p.color);
      p5.circle(p.x, p.y, p.size);

      // liens proches
      for (let other of particles) {
        const d = p5.dist(p.x, p.y, other.x, other.y);
        if (d < 70) {
          p5.stroke(p.color);
          p5.strokeWeight(0.5);
          p5.line(p.x, p.y, other.x, other.y);
        }
      }
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
}