import React, { useEffect, useRef } from "react";
import "./Loading.scss";
const INNER_CIRCLE_LOADING_RADIUS = 200;
const OUTER_CIRCLE_LOADING_RADIUS = 300;
const BASE_SPEED = 5;
const BASE_SIZE = 7;
const PARTICLE_COUNT = 100;
const PARTICLE_ARRAY = [];
const NEXT_TEXT_POSITION_DELTA = {
  dx: 10,
  dy: 5,
};
const Loading = () => {
  const canvRef = useRef();
  const animationRef = useRef();
  const frameRef = useRef(0);
  class Particle {
    constructor() {
      console.log(canvRef.current.width, "WIDTH");
      this.angle = Math.random() * 2 * Math.PI;
      this.radiusDifferenceRandomLength =
        (OUTER_CIRCLE_LOADING_RADIUS - INNER_CIRCLE_LOADING_RADIUS) *
        Math.random();
      this.y =
        canvRef.current.height / 2 +
        (INNER_CIRCLE_LOADING_RADIUS + this.radiusDifferenceRandomLength) *
          Math.sin(this.angle);
      this.x =
        canvRef.current.width / 2 +
        (INNER_CIRCLE_LOADING_RADIUS + this.radiusDifferenceRandomLength) *
          Math.cos(this.angle);
      this.size = BASE_SIZE + Math.random() * 4;
      this.color = `rgb(0,0,${Math.random() * 40 + 160})`;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    update() {
      this.angle += 0.02;
      this.y =
        canvRef.current.height / 2 +
        (INNER_CIRCLE_LOADING_RADIUS + this.radiusDifferenceRandomLength) *
          Math.sin(this.angle);
      this.x =
        canvRef.current.width / 2 +
        (INNER_CIRCLE_LOADING_RADIUS + this.radiusDifferenceRandomLength) *
          Math.cos(this.angle);
    }
  }

  function animate() {
    const ctx = canvRef.current.getContext("2d");
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(0, 0, canvRef.current.width, canvRef.current.height);
    for (let particle of PARTICLE_ARRAY) {
      particle.draw(ctx);
      particle.update();
    }
    ctx.font = `40px serif`;

    ctx.fillText(
      "Loading ...",
      canvRef.current.width / 2,
      canvRef.current.height / 2
    );
    animationRef.current = requestAnimationFrame(animate);
  }
  useEffect(() => {
    console.log(canvRef.current, "CANVAS");

    canvRef.current.height = window.innerHeight;
    canvRef.current.width = window.innerWidth;
    window.addEventListener("resize", handleSizeChange);
    const ctx = canvRef.current.getContext("2d");
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      PARTICLE_ARRAY.push(new Particle());
    }
    console.log(canvRef.current, "CANVAS");
    animationRef.current = requestAnimationFrame(animate);

    return window.removeEventListener("resize", handleSizeChange);
  }, [canvRef]);
  const handleSizeChange = () => {
    canvRef.current.height = window.innerHeight;
    canvRef.current.width = window.innerWidth;
  };
  return <canvas ref={canvRef} />;
};

export default Loading;
