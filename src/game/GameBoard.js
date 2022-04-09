import React, { useRef, useEffect } from "react";

const GameBoard = (props) => {
  // this use effect waits for canvas to mount and then selects it and uses canvas api methods to draw on it.
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const c = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 576;
    c.fillRect(0, 0, canvas.width, canvas.height);

    const gravity = 0.2;
    // this class is the constructor for our character elements.
    class Sprite {
      // this gives our sprites a position, velocity, and height based on what we pass in
      constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
      }

      // draws green boxes for sprite testing
      draw() {
        c.fillStyle = "green";
        c.fillRect(this.position.x, this.position.y, 50, this.height);
      }

      update() {
        this.draw();
        // changes sprite position based on their velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // stops our sprites from falling through the games floor by setting their velocity to 0 when sum of the bottom of their height and their velocity >= canvas height
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
          this.velocity.y = 0;
        }
        // adds gravity to our sprites by adding to their y velocity every animation frame.
        else this.velocity.y += gravity;
      }
    }

    const player = new Sprite({
      position: {
        x: canvas.width / 2 - 100,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
    });

    const enemy = new Sprite({
      position: {
        x: canvas.width / 2 + 100,
        y: 100,
      },
      velocity: {
        x: 0,
        y: 0,
      },
    });

    // this function calls itself every animation frame, rn it fills the canvas with black and wherever the player is suppsoed to be
    const animate = () => {
      window.requestAnimationFrame(animate);
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
      player.update();
      enemy.update();
    };
    animate();

    // window is just the entire browser dom (window.document.querySelector === document.querySelector)
    // controls player movement on press of a key
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
          player.velocity.y = -10;

          break;
        case "a":
          player.velocity.x = -1;

          break;
        case "s":
          player.velocity.x = 0;

          break;
        case "d":
          player.velocity.x = 1;

          break;
      }
    });

    // attempts to stop player movement on keyup
    // TODO: fix weird stuttery movement and fix player being able to jump infinitely, also something to consider is that the player still CAN clip through the map if I force it with a velocity here.
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "w":
          player.velocity.y = 0;

          break;
        case "a":
          player.velocity.x = 0;

          break;
        case "s":
          player.velocity.x = 0;

          break;
        case "d":
          player.velocity.x = 0;

          break;
      }
    });
  }, []);

  return <canvas />;
};

export default GameBoard;
