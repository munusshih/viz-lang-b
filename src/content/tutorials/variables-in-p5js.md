---
title: "Working with Variables in p5.js"
description: "Learn how to create flexible designs using variables to control size, position, and color in your p5.js sketches."
difficulty: "beginner"
duration: "20 minutes"
tags: ["p5.js", "variables", "fundamentals"]
order: 1
publishDate: 2025-09-01
---

# Working with Variables in p5.js

Variables are one of the most powerful tools for creating flexible and dynamic designs. Instead of using fixed numbers (magic numbers), variables let you experiment and adjust your designs easily.

## What Are Variables?

Variables are containers that store values. Think of them as labeled boxes where you can put numbers, colors, or other data that you want to reuse throughout your code.

```javascript
let circleSize = 50;
let circleX = 100;
let circleY = 150;
```

## Basic Variable Example

Here's a simple example showing how variables make your code more flexible:

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // Using variables instead of magic numbers
  let circleSize = 60;
  let circleX = width / 2;
  let circleY = height / 2;

  ellipse(circleX, circleY, circleSize, circleSize);
}
```

## Making It Interactive

Variables become really powerful when you connect them to user input:

```javascript
let size = 50;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // Size changes based on mouse position
  size = map(mouseX, 0, width, 10, 200);

  ellipse(width / 2, height / 2, size, size);
}
```

## Creating a Design System

Here's how you can use variables to create a consistent design system:

```javascript
// Design system variables
let primaryColor;
let spacing = 40;
let elementSize = 30;

function setup() {
  createCanvas(600, 400);
  primaryColor = color(100, 150, 255);
}

function draw() {
  background(240);
  fill(primaryColor);
  noStroke();

  // Create a grid using our variables
  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      ellipse(x, y, elementSize, elementSize);
    }
  }
}
```

## Adding Variation

Use variables with random() to create controlled variation:

```javascript
let baseSize = 40;
let colorHue = 200;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB);
}

function draw() {
  background(0, 0, 95);

  for (let i = 0; i < 50; i++) {
    // Variation based on base values
    let size = baseSize + random(-10, 10);
    let hue = colorHue + random(-30, 30);

    fill(hue, 70, 80);
    ellipse(random(width), random(height), size, size);
  }
}
```

## Tips for Using Variables

1. **Give them meaningful names**: Use `buttonWidth` instead of `w`
2. **Group related variables**: Keep color variables together
3. **Use constants for fixed values**: `const MARGIN = 20;`
4. **Experiment with relationships**: `let smallSize = baseSize * 0.5;`

## Try It Yourself

Create a sketch that uses variables for:

- Canvas size
- Number of elements
- Color palette
- Spacing between elements

Start simple and gradually add more variables to see how they affect your design!
