---
title: "Working with Arrays and Objects"
description: "Learn to organize and manage multiple elements in your creative coding projects using arrays and objects effectively."
difficulty: "intermediate"
duration: "40 minutes"
tags: ["p5.js", "arrays", "objects", "data-structures", "animation"]
order: 5
publishDate: 2025-09-05
---

# Working with Arrays and Objects

Arrays and objects are essential for managing multiple elements in creative coding. They let you organize data, create systems of particles, and build complex animations.

## Understanding Arrays

Arrays store multiple values in a single variable:

```javascript
let colors = ["red", "green", "blue"];
let numbers = [10, 25, 30, 45];
let positions = [
  [100, 50],
  [200, 150],
  [300, 100],
];

// Access items by index (starts at 0)
console.log(colors[0]); // 'red'
console.log(numbers[2]); // 30
```

## Basic Array Operations

Common things you'll do with arrays:

```javascript
let circles = [];

function setup() {
  createCanvas(600, 400);

  // Add items to array
  circles.push({ x: 100, y: 100, size: 30 });
  circles.push({ x: 200, y: 150, size: 25 });
  circles.push({ x: 300, y: 200, size: 40 });
}

function draw() {
  background(240);

  // Loop through all items
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    ellipse(circle.x, circle.y, circle.size, circle.size);
  }

  // Alternative: for...of loop
  // for(let circle of circles) {
  //   ellipse(circle.x, circle.y, circle.size, circle.size);
  // }
}

function mousePressed() {
  // Add new circle where clicked
  circles.push({
    x: mouseX,
    y: mouseY,
    size: random(20, 60),
  });
}
```

## Objects for Organization

Objects group related data together:

```javascript
// Simple object
let ball = {
  x: 100,
  y: 50,
  speedX: 3,
  speedY: 2,
  size: 30,
  color: "blue",
};

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  // Update position
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Bounce off edges
  if (ball.x > width - ball.size / 2 || ball.x < ball.size / 2) {
    ball.speedX *= -1;
  }
  if (ball.y > height - ball.size / 2 || ball.y < ball.size / 2) {
    ball.speedY *= -1;
  }

  // Draw
  fill(ball.color);
  ellipse(ball.x, ball.y, ball.size, ball.size);
}
```

## Array of Objects

Combine arrays and objects for power:

```javascript
let particles = [];

function setup() {
  createCanvas(600, 400);

  // Create initial particles
  for (let i = 0; i < 20; i++) {
    particles.push(createParticle());
  }
}

function createParticle() {
  return {
    x: random(width),
    y: random(height),
    speedX: random(-2, 2),
    speedY: random(-2, 2),
    size: random(5, 20),
    hue: random(360),
    alpha: 255,
  };
}

function draw() {
  background(240);
  colorMode(HSB, 360, 100, 100, 255);

  // Update and draw each particle
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    // Update
    p.x += p.speedX;
    p.y += p.speedY;
    p.alpha -= 2; // Fade out

    // Wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Draw
    fill(p.hue, 70, 80, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);

    // Remove if faded out
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // Add new particles occasionally
  if (random() < 0.1) {
    particles.push(createParticle());
  }
}
```

## Object Methods

Objects can have functions (methods):

```javascript
let walker = {
  x: 300,
  y: 200,
  size: 20,
  color: "red",

  // Method to update position
  update: function () {
    this.x += random(-2, 2);
    this.y += random(-2, 2);

    // Keep on screen
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  },

  // Method to draw
  display: function () {
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  },
};

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240);

  walker.update();
  walker.display();
}
```

## Constructor Functions

Create similar objects efficiently:

```javascript
function Bubble(x, y) {
  this.x = x;
  this.y = y;
  this.size = random(20, 60);
  this.speedY = random(-1, -3);
  this.color = color(random(100, 255), random(100, 255), 255, 150);

  this.update = function () {
    this.y += this.speedY;

    // Reset when off screen
    if (this.y < -this.size) {
      this.y = height + this.size;
      this.x = random(width);
    }
  };

  this.display = function () {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  };
}

let bubbles = [];

function setup() {
  createCanvas(600, 400);

  for (let i = 0; i < 15; i++) {
    bubbles.push(new Bubble(random(width), random(height)));
  }
}

function draw() {
  background(50, 100, 150);

  for (let bubble of bubbles) {
    bubble.update();
    bubble.display();
  }
}
```

## Managing Array Size

Control memory usage and performance:

```javascript
let trails = [];
let maxTrails = 50;

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(240, 50); // Semi-transparent for trails

  // Add current mouse position
  trails.push({ x: mouseX, y: mouseY });

  // Remove old trails
  if (trails.length > maxTrails) {
    trails.splice(0, 1); // Remove first item
  }

  // Draw trail
  for (let i = 0; i < trails.length; i++) {
    let alpha = map(i, 0, trails.length - 1, 0, 255);
    let size = map(i, 0, trails.length - 1, 2, 20);

    fill(255, 100, 100, alpha);
    ellipse(trails[i].x, trails[i].y, size, size);
  }
}
```

## Array Methods

Useful built-in array functions:

```javascript
let numbers = [5, 2, 8, 1, 9, 3];

// Add/remove items
numbers.push(7); // Add to end
numbers.pop(); // Remove from end
numbers.unshift(0); // Add to beginning
numbers.shift(); // Remove from beginning

// Find items
let index = numbers.indexOf(8); // Find position of 8
let has5 = numbers.includes(5); // Check if 5 exists

// Transform arrays
let doubled = numbers.map((n) => n * 2); // [10, 4, 16, 2, 18, 6]
let evens = numbers.filter((n) => n % 2 === 0); // [2, 8]
let sum = numbers.reduce((a, b) => a + b); // Add all numbers

// Sort
numbers.sort((a, b) => a - b); // Sort ascending
```

## Collision Detection

Check if objects interact:

```javascript
let circles = [];

function setup() {
  createCanvas(600, 400);

  for (let i = 0; i < 10; i++) {
    circles.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      size: random(30, 60),
      color: color(random(255), random(255), random(255)),
    });
  }
}

function draw() {
  background(240);

  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];

    // Check collision with mouse
    let distance = dist(circle.x, circle.y, mouseX, mouseY);
    if (distance < circle.size / 2) {
      fill(255, 0, 0); // Red when touching mouse
    } else {
      fill(circle.color);
    }

    ellipse(circle.x, circle.y, circle.size, circle.size);

    // Check collisions with other circles
    for (let j = i + 1; j < circles.length; j++) {
      let other = circles[j];
      let dist2 = dist(circle.x, circle.y, other.x, other.y);

      if (dist2 < (circle.size + other.size) / 2) {
        stroke(255, 0, 0);
        strokeWeight(3);
        line(circle.x, circle.y, other.x, other.y);
        noStroke();
      }
    }
  }
}
```

## Performance Tips

1. **Remove unused objects**: Use `splice()` to remove items you don't need
2. **Limit array size**: Set maximum sizes for particle systems
3. **Reuse objects**: Instead of creating/destroying, reset properties
4. **Use object pooling** for complex systems

```javascript
// Object pooling example
let particles = [];
let particlePool = [];

function getParticle() {
  if (particlePool.length > 0) {
    return particlePool.pop(); // Reuse existing
  } else {
    return createParticle(); // Create new if needed
  }
}

function releaseParticle(particle) {
  particlePool.push(particle); // Return to pool
}
```

## Common Patterns

**Find nearest object:**

```javascript
function findNearest(target, objects) {
  let nearest = null;
  let minDist = Infinity;

  for (let obj of objects) {
    let d = dist(target.x, target.y, obj.x, obj.y);
    if (d < minDist) {
      minDist = d;
      nearest = obj;
    }
  }

  return nearest;
}
```

**Group objects by property:**

```javascript
function groupByColor(objects) {
  let groups = {};

  for (let obj of objects) {
    if (!groups[obj.color]) {
      groups[obj.color] = [];
    }
    groups[obj.color].push(obj);
  }

  return groups;
}
```

## Exercise

Create a system with:

1. An array of 20+ moving objects with different properties
2. Objects that interact with each other (collision, attraction, etc.)
3. Add/remove objects based on user interaction
4. Use at least one array method (map, filter, or reduce)
5. Implement object methods for update and display

Try creating flocking birds, bouncing balls, or particle systems!
