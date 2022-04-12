import React, { useRef, useEffect, useState } from "react";
import "./GameScreen.css";

export const GameScreen = () => {
  // this use effect waits for canvas to mount and then selects it and uses canvas api methods to draw on it.
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const c = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 576;

    const gravity = 0.2;
    // this class is the constructor for our character elements.
    class Character {
      // this gives our characters a position, velocity, and height based on what we pass in
      constructor({ position, velocity, height, width, color, offset }) {
        this.position = position;
        this.velocity = velocity;
        this.height = height;
        this.width = width;
        this.color = color;
        // controls hitbox position,width, and height.
        this.hitbox = {
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          offset: offset,
          width: 100,
          height: 50,
        };
        this.attacking = false;
      }

      draw() {
        // draws boxes for character testing
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // hitbox drawn here
        if (this.attacking) {
          c.fillStyle = "red";
        } else {
          c.fillStyle = "white";
        }
        c.fillRect(
          this.hitbox.position.x,
          this.hitbox.position.y,
          this.hitbox.width,
          this.hitbox.height
        );
      }
      // method for triggering an attack which is called when a user/enemy presses their attack button
      attack() {
        this.attacking = true;
        setTimeout(() => {
          this.attacking = false;
        }, 100);
      }

      // updates character position
      update() {
        this.draw();
        // update hitbox to follow character position manually with an offset
        this.hitbox.position.x = this.position.x - this.hitbox.offset.x;
        this.hitbox.position.y = this.position.y;

        // changes character position based on their velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // stops characters from running off the stage to the right
        if (this.position.x + this.velocity.x >= canvas.width - this.width) {
          this.velocity.x = 0;
          this.position.x = canvas.width - this.width;
        }
        // stops characters from running off the stage to the left
        if (this.position.x + this.velocity.x <= 0) {
          this.velocity.x = 0;
          this.position.x = 0;
        }
        // stops our characters from falling through the games floor by setting their velocity to 0 when sum of the bottom of their height and their velocity >= canvas height
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
          this.velocity.y = 0;
        }
        // adds gravity to our characters by adding to their y velocity every animation frame.
        else this.velocity.y += gravity;
      }
    }

    const player = new Character({
      position: {
        x: canvas.width / 2 - 100,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
      height: 150,
      width: 50,
      color: "green",
    });

    const enemy = new Character({
      position: {
        x: canvas.width / 2 + 100,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 50,
        y: 0,
      },
      height: 150,
      width: 50,
      color: "blue",
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
      ArrowUp: {
        pressed: false,
      },
      ArrowRight: {
        pressed: false,
      },
      ArrowLeft: {
        pressed: false,
      },
    };

    // window is just the entire browser dom (window.document.querySelector === document.querySelector)
    // controls character movement on press of a key
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

        case " ":
          player.attack();

          break;

        case "ArrowUp":
          controls.ArrowUp.pressed = true;

          break;
        case "ArrowRight":
          controls.ArrowRight.pressed = true;

          break;
        case "ArrowLeft":
          controls.ArrowLeft.pressed = true;

          break;
        case "/":
          enemy.attack();
      }
    });

    // stops character movement on keyup through pressed property of key of controls obj
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
        case "ArrowUp":
          controls.ArrowUp.pressed = false;

          break;
        case "ArrowRight":
          controls.ArrowRight.pressed = false;

          break;
        case "ArrowLeft":
          controls.ArrowLeft.pressed = false;

          break;
      }
    });

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
      // same as ebove but for enemy movement
      enemy.velocity.x = 0;
      if (
        controls.ArrowUp.pressed &&
        enemy.position.y + enemy.height >= canvas.height
      ) {
        enemy.velocity.y = -10;
      }
      if (controls.ArrowLeft.pressed) {
        enemy.velocity.x = -2;
      }
      if (controls.ArrowRight.pressed) {
        enemy.velocity.x = 2;
      }
      if (controls.ArrowLeft.pressed && controls.ArrowRight.pressed) {
        enemy.velocity.x = 0;
      }
      // hitbox collision for player attacks
      if (player.attacking) {
        if (
          player.hitbox.position.x + player.hitbox.width >= enemy.position.x &&
          player.hitbox.position.x <= enemy.position.x + enemy.width &&
          player.hitbox.position.y + player.hitbox.height >= enemy.position.y &&
          player.hitbox.position.y <= enemy.position.y + enemy.height
        ) {
          // TODO: figure out how to stop timer and player hp from moving when this happens
          // subtract hp when hit enemy
          document.querySelector("#enemyHP").style.width = "20%";
        }
      }
      // conditional for swapping hitbox position when the player crosses the enemy
      if (player.hitbox.position.x <= enemy.position.x + enemy.width) {
        player.hitbox.offset.x = -50;
      } else {
        player.hitbox.offset.x = 100;
      }

      // hitbox collision for enemy attacks
      if (enemy.attacking) {
        if (
          enemy.hitbox.position.x + enemy.hitbox.width >= player.position.x &&
          enemy.hitbox.position.x <= player.position.x + player.width &&
          enemy.hitbox.position.y + enemy.hitbox.height >= player.position.y &&
          enemy.hitbox.position.y <= player.position.y + player.height
        ) {
          console.log("enemy hit!");
        }
      }
      // conditional for swapping hitbox position when the enemy crosses the player
      if (enemy.hitbox.position.x <= player.position.x + player.width) {
        enemy.hitbox.offset.x = -50;
      } else {
        enemy.hitbox.offset.x = 100;
      }
    };

    animate();
  }, []);

  return (
    <>
      <div id="wrapper">
        <div id="HealthTimerUI">
          <div id="playerHP"></div>
          <div id="timer"></div>
          <div id="enemyHP"></div>
        </div>
        <canvas />
      </div>
    </>
  );
};

// export default GameScreen;
