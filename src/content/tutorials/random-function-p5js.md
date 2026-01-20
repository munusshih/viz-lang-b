---
title: "Adding Randomness to Your Designs"
description: "Discover how to use the random() function to create variation and surprise in your creative coding projects."
difficulty: "beginner"
duration: "25 minutes"
tags: ["p5.js", "random", "variation", "generative"]
order: 2
publishDate: 2025-09-02
---

# Adding Randomness to Your Designs

Randomness is what makes generative art exciting and unpredictable. The `random()` function in p5.js lets you add controlled chaos to create designs that are similar but never exactly the same.

## Understanding random()

The `random()` function gives you a random number. You can use it in different ways:

```javascript
random(); // Random number between 0 and 1
random(10); // Random number between 0 and 10
random(5, 15); // Random number between 5 and 15
random([-1, 0, 1]); // Random item from an array
```

## Basic Randomness

Let's start with random positions:

```javascript
function setup() {
  createCanvas(600, 400);
  background(240);
}

function draw() {
  // Random circle every frame
  let x = random(width);
  let y = random(height);
  let size = random(10, 50);

  fill(random(255), random(255), random(255));
  ellipse(x, y, size, size);
}
```

## Controlled Randomness

Often you want randomness within limits:

```javascript
let baseColor = [100, 150, 255]; // Base blue color

function setup() {
  createCanvas(600, 400);
  colorMode(RGB);
}

function draw() {
  background(240);

  for (let i = 0; i < 20; i++) {
    // Variations of the base color
    let r = baseColor[0] + random(-30, 30);
    let g = baseColor[1] + random(-20, 20);
    let b = baseColor[2] + random(-40, 40);

    fill(r, g, b, 150);

    let x = random(50, width - 50);
    let y = random(50, height - 50);
    let size = random(20, 80);

    ellipse(x, y, size, size);
  }
}
```

## Random with Seed

Use `randomSeed()` to get the same "random" pattern every time:

```javascript
function setup() {
  createCanvas(600, 400);
  randomSeed(42); // Always the same pattern
}

function draw() {
  background(240);

  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);

    fill(0, 50);
    ellipse(x, y, 10, 10);
  }

  noLoop(); // Draw once
}
```

## Random Choices

Use random to make decisions:

```javascript
let shapes = ["circle", "square", "triangle"];
let colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(250);

  for (let i = 0; i < 15; i++) {
    let x = random(50, width - 50);
    let y = random(50, height - 50);
    let size = random(30, 80);

    // Random color from our palette
    fill(random(colors));

    // Random shape
    let shape = random(shapes);

    if (shape === "circle") {
      ellipse(x, y, size, size);
    } else if (shape === "square") {
      rectMode(CENTER);
      rect(x, y, size, size);
    } else if (shape === "triangle") {
      triangle(
        x,
        y - size / 2,
        x - size / 2,
        y + size / 2,
        x + size / 2,
        y + size / 2,
      );
    }
  }

  noLoop();
}

function mousePressed() {
  loop();
  redraw();
  noLoop();
}
```

## Random Walks

Create organic, wandering paths:

```javascript
let walker = {
  x: 0,
  y: 0,
};

function setup() {
  createCanvas(600, 400);
  walker.x = width / 2;
  walker.y = height / 2;
  background(240);
}

function draw() {
  // Random step in any direction
  walker.x += random(-2, 2);
  walker.y += random(-2, 2);

  // Keep walker on screen
  walker.x = constrain(walker.x, 0, width);
  walker.y = constrain(walker.y, 0, height);

  fill(0, 100);
  noStroke();
  ellipse(walker.x, walker.y, 5, 5);
}
```

## Probability and Bias

Not all random choices have to be equal:

```javascript
function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);

    // 80% chance of small circles, 20% chance of large
    let size = random() < 0.8 ? random(5, 15) : random(40, 80);

    // Mostly blue, occasionally red
    if (random() < 0.9) {
      fill(100, 150, 255, 150);
    } else {
      fill(255, 100, 100, 200);
    }

    ellipse(x, y, size, size);
  }

  noLoop();
}

function mousePressed() {
  redraw();
}
```

## Tips for Using Random

1. **Start with constraints**: Use ranges instead of completely random values
2. **Use probability**: Not everything needs equal chances
3. **Save interesting seeds**: When you get a good pattern, note the seed
4. **Combine with other functions**: Mix random with sin(), map(), and lerp()
5. **Test your ranges**: Make sure random values work in your design

## Exercise

Create a generative poster that uses:

- Random positions within a grid
- Random colors from a limited palette
- Random sizes with controlled variation
- At least one element that uses probability (rare vs common elements)

Click to generate new variations!
