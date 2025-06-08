import React from "react";
import Sketch from "react-p5";

export default function IAResonanceGraph({ score = 0 }) {
  let t = 0;

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(320, 180).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.clear();
    p5.translate(p5.width / 2, p5.height / 2);

    const layers = 5;
    const maxRadius = 80 + score * 15;
    const color =
      score < 2 ? [240, 80, 80] :
      score < 4 ? [255, 180, 60] :
      [80, 200, 160];

    for (let i = 1; i <= layers; i++) {
      const radius = maxRadius * (i / layers) + 4 * Math.sin(t + i);
      p5.stroke(...color, 100 - i * 15);
      p5.noFill();
      p5.strokeWeight(2 - i * 0.3);
      p5.ellipse(0, 0, radius, radius);
    }

    const pulse = 15 + 4 * Math.sin(t * 2);
    p5.fill(...color, 120);
    p5.noStroke();
    p5.ellipse(0, 0, pulse);

    t += 0.015;
  };

  return (
    <div className="rounded border shadow p-2 bg-white mb-4">
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}