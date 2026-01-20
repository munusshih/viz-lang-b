---
title: "Creating Color Palettes and Harmonies"
description: "Learn to create beautiful, cohesive color schemes for your creative coding projects using color theory principles."
difficulty: "intermediate"
duration: "35 minutes"
tags: ["p5.js", "color", "design", "palettes", "theory"]
order: 4
publishDate: 2025-09-04
---

# Creating Color Palettes and Harmonies

Color is one of the most powerful tools in visual design. Learn how to create harmonious color palettes that make your creative coding projects visually compelling and professional.

## Understanding Color Models

p5.js supports different color models. Choose the right one for your needs:

```javascript
// RGB - Red, Green, Blue (default)
colorMode(RGB);
fill(255, 100, 50);

// HSB - Hue, Saturation, Brightness
colorMode(HSB, 360, 100, 100);
fill(30, 80, 90); // Orange

// HSL is similar but uses Lightness instead of Brightness
```

## Working with HSB

HSB is perfect for creative coding because it's intuitive:

```javascript
function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(220, 20, 95); // Light warm background

  for (let i = 0; i < 8; i++) {
    let hue = i * 45; // Every 45 degrees around color wheel
    let x = i * 75 + 50;

    fill(hue, 70, 80);
    ellipse(x, 200, 60, 60);
  }
}
```

## Analogous Colors

Colors next to each other on the color wheel create harmony:

```javascript
let baseHue = 200; // Starting blue
let analogousColors = [];

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);

  // Create analogous palette
  for (let i = 0; i < 5; i++) {
    let hue = (baseHue + i * 30) % 360;
    analogousColors.push({
      h: hue,
      s: 70 + random(-10, 10),
      b: 80 + random(-15, 15),
    });
  }
}

function draw() {
  background(baseHue, 30, 95);

  for (let i = 0; i < analogousColors.length; i++) {
    let color = analogousColors[i];
    fill(color.h, color.s, color.b);

    let x = i * 120 + 60;
    let y = 200;
    ellipse(x, y, 80, 80);

    // Add smaller accent circles
    fill(color.h, color.s + 20, color.b - 20);
    ellipse(x, y - 50, 30, 30);
  }
}
```

## Complementary Colors

Opposite colors create vibrant contrast:

```javascript
function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  let baseHue = (frameCount * 0.5) % 360;
  let complementHue = (baseHue + 180) % 360;

  background(baseHue, 30, 95);

  // Main color
  fill(baseHue, 80, 80);
  ellipse(200, 200, 150, 150);

  // Complement for accent
  fill(complementHue, 90, 85);
  ellipse(400, 200, 100, 100);

  // Neutral variations
  fill(baseHue, 20, 60);
  ellipse(300, 120, 60, 60);

  fill(complementHue, 15, 40);
  ellipse(300, 280, 40, 40);
}
```

## Triadic Color Scheme

Three colors equally spaced on the color wheel:

```javascript
function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(0, 0, 95);

  let baseHue = 30; // Orange
  let triad = [
    baseHue,
    (baseHue + 120) % 360, // Green
    (baseHue + 240) % 360, // Purple
  ];

  for (let i = 0; i < 3; i++) {
    let hue = triad[i];

    // Main shape
    fill(hue, 70, 80);
    let x = i * 200 + 100;
    ellipse(x, 200, 100, 100);

    // Accent shape with higher saturation
    fill(hue, 90, 60);
    ellipse(x, 150, 40, 40);

    // Light tint
    fill(hue, 30, 90);
    ellipse(x, 250, 60, 60);
  }
}
```

## Monochromatic Scheme

Different shades and tints of one color:

```javascript
function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  let baseHue = 240; // Blue
  background(baseHue, 10, 95);

  let variations = [
    { s: 20, b: 30 }, // Dark
    { s: 40, b: 50 }, // Medium dark
    { s: 60, b: 70 }, // Medium
    { s: 80, b: 85 }, // Bright
    { s: 30, b: 90 }, // Light
  ];

  for (let i = 0; i < variations.length; i++) {
    let v = variations[i];
    fill(baseHue, v.s, v.b);

    let x = i * 100 + 75;
    let size = 60 + v.b * 0.5; // Size varies with brightness

    ellipse(x, 200, size, size);
  }
}
```

## Split-Complementary

A color plus the two colors adjacent to its complement:

```javascript
function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  let baseHue = 60; // Yellow
  background(baseHue, 15, 95);

  let palette = [
    baseHue, // Base color
    (baseHue + 150) % 360, // Split 1
    (baseHue + 210) % 360, // Split 2
  ];

  // Background pattern
  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {
      let colorIndex = floor(random(3));
      fill(palette[colorIndex], 20, 90, 0.3);
      ellipse(x + 20, y + 20, 30, 30);
    }
  }

  // Main elements
  for (let i = 0; i < 3; i++) {
    fill(palette[i], 80, 80);
    let x = i * 150 + 100;
    ellipse(x, 200, 80, 80);
  }
}
```

## Creating Palette Arrays

Store palettes for easy reuse:

```javascript
let palettes = {
  sunset: ["#FF6B6B", "#FF8E53", "#FF6B9D", "#C44569"],
  ocean: ["#0066CC", "#0080FF", "#3399FF", "#66B2FF"],
  forest: ["#2D5016", "#3E6B20", "#4F7F2A", "#7BA05B"],
  warm: ["#D4A574", "#E6B887", "#F2D399", "#F7E7AB"],
};

let currentPalette;

function setup() {
  createCanvas(600, 400);
  currentPalette = palettes.sunset;
}

function draw() {
  background(255);

  for (let i = 0; i < 50; i++) {
    let color = random(currentPalette);
    fill(color);

    let x = random(50, width - 50);
    let y = random(50, height - 50);
    let size = random(20, 60);

    ellipse(x, y, size, size);
  }

  noLoop();
}

function keyPressed() {
  if (key === "1") currentPalette = palettes.sunset;
  if (key === "2") currentPalette = palettes.ocean;
  if (key === "3") currentPalette = palettes.forest;
  if (key === "4") currentPalette = palettes.warm;
  redraw();
}
```

## Procedural Palette Generation

Generate palettes programmatically:

```javascript
function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  let baseHue = random(360);
  let palette = generatePalette(baseHue, "analogous");

  background(baseHue, 20, 95);

  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]);
    let x = i * 120 + 60;
    ellipse(x, 200, 80, 80);
  }

  noLoop();
}

function generatePalette(baseHue, type) {
  let colors = [];

  if (type === "analogous") {
    for (let i = 0; i < 5; i++) {
      let hue = (baseHue + i * 30) % 360;
      colors.push(color(hue, 70, 80));
    }
  } else if (type === "triadic") {
    for (let i = 0; i < 3; i++) {
      let hue = (baseHue + i * 120) % 360;
      colors.push(color(hue, 70, 80));
    }
  }

  return colors;
}

function mousePressed() {
  redraw();
}
```

## Color Temperature and Mood

Warm vs cool colors affect emotion:

```javascript
function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  let warmSide = map(mouseX, 0, width, 0, 1);

  // Cool palette (blues, greens, purples)
  let coolColors = [200, 220, 240, 260, 280];

  // Warm palette (reds, oranges, yellows)
  let warmColors = [0, 20, 40, 60, 80];

  background(0);

  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);

    let isWarm = x < width * warmSide;
    let hue = isWarm ? random(warmColors) : random(coolColors);

    fill(hue, 70, 80, 0.7);
    ellipse(x, y, random(10, 40), random(10, 40));
  }
}
```

## Tips for Great Color Palettes

1. **Start with inspiration**: Nature, art, photography
2. **Limit your palette**: 3-5 colors are usually enough
3. **Test accessibility**: Ensure sufficient contrast
4. **Use neutrals**: Greys and muted tones help vibrant colors pop
5. **Consider context**: Match colors to your project's mood

## Exercise

Create a generative artwork that:

1. Uses one of the color harmony rules (analogous, complementary, etc.)
2. Includes neutral variations of your main colors
3. Has different saturation and brightness levels
4. Changes palette when you click the mouse

Press keys 1-4 to switch between different color schemes!
