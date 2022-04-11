import React, { useRef, useEffect, useState } from "react";

export const GameBoard = (props) => {
  // this use effect waits for canvas to mount and then selects it and uses canvas api methods to draw on it.
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const c = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 576;

    const gravity = 0.2;
    // this class is the constructor for our character elements.
    class Fighter {
      // this gives our fighters a position, velocity, and height based on what we pass in
      constructor({ position, velocity, height, width }) {
        this.position = position;
        this.velocity = velocity;
        this.height = height;
        this.width = width;
      }

      // draws green boxes for fighter testing
      draw() {
        c.fillStyle = "green";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
      }

      // updates fighter position
      update() {
        this.draw();
        // changes fighter position based on their velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // stops fighters from running off the stage to the right
        if (this.position.x + this.velocity.x >= canvas.width - this.width) {
          this.velocity.x = 0;
          this.position.x = canvas.width - this.width;
        }
        // stops fighters from running off the stage to the left
        if (this.position.x + this.velocity.x <= 0) {
          this.velocity.x = 0;
          this.position.x = 0;
        }
        // stops our fighters from falling through the games floor by setting their velocity to 0 when sum of the bottom of their height and their velocity >= canvas height
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
          this.velocity.y = 0;
        }
        // adds gravity to our fighters by adding to their y velocity every animation frame.
        else this.velocity.y += gravity;
      }
    }

    const player = new Fighter({
      position: {
        x: canvas.width / 2 - 100,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      height: 150,
      width: 50,
    });

    const enemy = new Fighter({
      position: {
        x: canvas.width / 2 + 100,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      height: 150,
      width: 50,
    });

    // sets state of game controls with default = to false
    const controls = {
      w: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
    };

    // this function calls itself every animation frame, rn it fills the canvas with black and wherever the player is supposed to be
    const animate = () => {
      window.requestAnimationFrame(animate);
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
      player.update();
      enemy.update();

      // using this instead of event listeners within the animation loop to prevent controls overriding each other and getting most accurate movement possible
      player.velocity.x = 0;
      if (
        controls.w.pressed &&
        player.position.y + player.height >= canvas.height
      ) {
        player.velocity.y = -10;
      }
      if (controls.a.pressed) {
        player.velocity.x = -2;
      }
      if (controls.d.pressed) {
        player.velocity.x = 2;
      }
      if (controls.a.pressed && controls.d.pressed) {
        player.velocity.x = 0;
      }
    };

    animate();

    // window is just the entire browser dom (window.document.querySelector === document.querySelector)
    // controls player movement on press of a key
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
          controls.w.pressed = true;

          break;

        case "a":
          controls.a.pressed = true;

          break;

        case "d":
          controls.d.pressed = true;

          break;
      }
    });

    // stops player movement on keyup through pressed property of key of controls obj
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "w":
          controls.w.pressed = false;

          break;

        case "a":
          controls.a.pressed = false;

          break;

        case "d":
          controls.d.pressed = false;

          break;
      }
    });
  }, []);

  return <canvas />;
};

// export default GameBoard;
