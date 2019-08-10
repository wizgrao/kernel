import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

function point(x, y) {
    return {x: x, y: y};
}

function drawList(ctx, list, tl, br, width, height) {
    const subbed = sub(br, tl);
    for (let i = 1; i < list.length; i++) {
      const v1 =  sub(list[i-1], tl);
      const v2 = sub(list[i], tl);
      const x1 = v1.x / subbed.x * width;
      const y1 = v1.y / subbed.y * height;
      const x2 = v2.x / subbed.x * width;
      const y2 = v2.y / subbed.y * height;
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    }
}

function getDir(angle, delta) {
    return point(delta*Math.cos(angle), delta*Math.sin(angle));
}

function next(points, step, n, dist) {
    const current = points[points.length -1];
    const prev = points[points.length -2];
    let max = -1;
    let maxPt = point(0,0);
    for (let i = 0; i < n; i++) {
        const pt = getStep(current, step, getDir(2*Math.PI*i/n, step), dist);
        const d = dist(pt, prev);
        if (d > max) {
            max = d;
            maxPt = pt;
        }
    }
    return maxPt;
}

function eucNorm(pt) {
    return Math.sqrt(pt.x*pt.x + pt.y*pt.y);
}

function edist(x, y) {
    return eucNorm(sub(x, y));
}

function scale(pt, s) {
    return point(pt.x*s, pt.y*s);
}

function add(a, b) {
    return point(a.x + b.x, a.y + b.y);
}

function sub(a, b) {
    return point(a.x - b.x, a.y - b.y);
}

function getStep(p, delta, dir, dist) {
    const dirNorm = scale(dir, delta/dist(p, add(p, dir)));
    const metricDist = dist(p, add(dirNorm, p));
    return add(p, scale(dirNorm, delta/metricDist));
}

function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const pts = [point(-.5, -.5), point(-.7, -.6)];
      for (let i = 0; i < 1000; i++) {
          pts.push(next(pts, .01, 16, edist));
      }
      console.log(pts);
      drawList(ctx, pts, point(-1, -1), point(1, 1), 500, 500);
  });
  return (
    <div className="App">
        <canvas width={500} height={500} ref={canvasRef} />
    </div>
  );
}

export default App;
