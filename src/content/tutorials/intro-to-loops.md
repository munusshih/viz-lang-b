---
title: "Introduction to Loops in Creative Coding"
description: "Master for loops to create patterns, grids, and repetitive visual elements efficiently in your p5.js projects."
difficulty: "beginner"
duration: "30 minutes"
tags: ["p5.js", "loops", "for", "patterns", "iteration"]
order: 3
publishDate: 2025-09-03
---

# Introduction to Loops in Creative Coding

Loops are the secret to creating complex patterns with simple code. Instead of writing the same code 100 times, you can use a loop to repeat it efficiently.

## What are Loops?

A loop repeats code a certain number of times. In creative coding, we use them to:

- Draw multiple shapes
- Create grids and patterns
- Generate repeating elements
- Process arrays of data

## Basic For Loop

Here's the simplest for loop structure:

```javascript
for (let i = 0; i < 5; i++) {
  println(i); // Prints 0, 1, 2, 3, 4
}
```

Breaking it down:

- `let i = 0` - Start with i equals 0
- `i < 5` - Keep going while i is less than 5
- `i++` - Add 1 to i each time

## Drawing Multiple Shapes

Let's draw 10 circles in a row:

```javascript
function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  for (let i = 0; i < 10; i++) {
    let x = i * 60 + 30; // Space circles 60 pixels apart
    ellipse(x, 200, 40, 40);
  }
}
```

## Creating Grids

Use nested loops (a loop inside a loop) for grids:

```javascript
function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  let cols = 8;
  let rows = 5;
  let cellWidth = width / cols;
  let cellHeight = height / rows;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * cellWidth + cellWidth / 2;
      let y = row * cellHeight + cellHeight / 2;

      fill(col * 30, row * 50, 150);
      ellipse(x, y, 30, 30);
    }
  }
}
```

## Patterns with Math

Use the loop counter with math functions:

```javascript
function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  for (let i = 0; i < 20; i++) {
    let x = i * 30;
    let y = height / 2 + sin(i * 0.5) * 100;

    fill(i * 12, 100, 255 - i * 8);
    ellipse(x, y, 20, 20);
  }
}
```

## Varying Size and Color

Make each shape slightly different:

```javascript
function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  for (let i = 0; i < 15; i++) {
    let x = i * 40 + 50;
    let y = height / 2;

    // Size grows with each iteration
    let size = 10 + i * 3;

    // Color changes with position
    let hue = map(i, 0, 14, 0, 360);
    colorMode(HSB);
    fill(hue, 70, 90);

    ellipse(x, y, size, size);
  }
}
```

## Using Arrays with Loops

Store data and loop through it:

```javascript
let colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
let sizes = [20, 35, 25, 40, 30];

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  for (let i = 0; i < colors.length; i++) {
    let x = i * 100 + 80;
    let y = height / 2;

    fill(colors[i]);
    ellipse(x, y, sizes[i], sizes[i]);
  }
}
```

## Animated Loops

Combine loops with time for animation:

```javascript
function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  let time = millis() * 0.001; // Convert to seconds

  for (let i = 0; i < 12; i++) {
    let angle = (i * TWO_PI) / 12 + time;
    let x = width / 2 + cos(angle) * 150;
    let y = height / 2 + sin(angle) * 150;

    let size = 20 + sin(time * 2 + i) * 10;

    fill(i * 20, 150, 255);
    ellipse(x, y, size, size);
  }
}
```

## Drawing Patterns

Create complex patterns with simple loops:

```javascript
function setup() {
  createCanvas(600, 400);
  background(240);
  strokeWeight(2);
}

function draw() {
  background(240);

  let spacing = 30;

  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      // Calculate distance from mouse
      let d = dist(x, y, mouseX, mouseY);
      let size = map(d, 0, 200, 20, 5);

      if (d < 100) {
        fill(255, 100, 100);
      } else {
        fill(100, 100, 255);
      }

      ellipse(x, y, size, size);
    }
  }
}
```

## Loop Control

Sometimes you need to skip or break:

```javascript
function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  for (let i = 0; i < 20; i++) {
    let x = i * 30 + 30;
    let y = height / 2;

    // Skip even numbers
    if (i % 2 === 0) {
      continue; // Skip to next iteration
    }

    // Stop at 15
    if (i > 15) {
      break; // Exit the loop
    }

    fill(i * 15, 100, 200);
    ellipse(x, y, 25, 25);
  }
}
```

## Performance Tips

1. **Avoid heavy calculations in loops**: Move them outside when possible
2. **Use variables for repeated values**: Don't calculate the same thing multiple times
3. **Be mindful of nested loops**: They multiply quickly (10×10 = 100 iterations)

```javascript
// Good - calculate once
let centerX = width / 2;
let centerY = height / 2;

for (let i = 0; i < 100; i++) {
  let x = centerX + cos(i * 0.1) * 100;
  let y = centerY + sin(i * 0.1) * 100;
  ellipse(x, y, 5, 5);
}
```

## Common Loop Patterns

**Spacing elements evenly:**

```javascript
for (let i = 0; i < count; i++) {
  let x = map(i, 0, count - 1, margin, width - margin);
}
```

**Creating circular arrangements:**

```javascript
for (let i = 0; i < count; i++) {
  let angle = map(i, 0, count, 0, TWO_PI);
  let x = centerX + cos(angle) * radius;
  let y = centerY + sin(angle) * radius;
}
```

**Grid with single loop:**

```javascript
for (let i = 0; i < total; i++) {
  let col = i % cols;
  let row = floor(i / cols);
  let x = col * spacing;
  let y = row * spacing;
}
```

## Exercise

Create a pattern that uses:

1. A nested loop to create a grid
2. Distance from mouse to affect size or color
3. Math functions (sin, cos) to create variation
4. At least 3 different colors

Try experimenting with different spacing, sizes, and mathematical relationships!
