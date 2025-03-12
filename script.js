// Get DOM elements
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generate-btn');
const saveBtn = document.getElementById('save-btn');
const shapeCountSlider = document.getElementById('shape-count');
const shapeCountValue = document.getElementById('shape-count-value');
const sizeRangeSlider = document.getElementById('size-range');
const sizeRangeValue = document.getElementById('size-range-value');
const opacityRangeSlider = document.getElementById('opacity-range');
const opacityRangeValue = document.getElementById('opacity-range-value');
const bgColorPicker = document.getElementById('background-color');
const complexitySlider = document.getElementById('complexity');
const complexityValue = document.getElementById('complexity-value');
const overlapSlider = document.getElementById('overlap');
const overlapValue = document.getElementById('overlap-value');
const shapesCheckboxes = {
    circles: document.getElementById('circles'),
    rectangles: document.getElementById('rectangles'),
    triangles: document.getElementById('triangles'),
    lines: document.getElementById('lines'),
    spiral: document.getElementById('spirals'),
    star: document.getElementById('stars')
};
const paletteBtns = document.querySelectorAll('.palette-btn');

// Enhanced color palettes
const colorPalettes = {
    warm: [
        'hsl(0, 85%, 60%)', // Red
        'hsl(20, 90%, 60%)', // Orange-Red
        'hsl(30, 90%, 65%)', // Orange
        'hsl(45, 95%, 65%)', // Yellow-Orange
        'hsl(60, 90%, 70%)' // Yellow
    ],
    cool: [
        'hsl(180, 80%, 50%)', // Cyan
        'hsl(210, 85%, 60%)', // Sky Blue
        'hsl(240, 70%, 60%)', // Blue
        'hsl(270, 75%, 65%)', // Purple
        'hsl(300, 70%, 65%)' // Magenta
    ],
    pastel: [
        'hsl(0, 60%, 85%)', // Pastel Red
        'hsl(40, 70%, 85%)', // Pastel Orange
        'hsl(120, 50%, 85%)', // Pastel Green
        'hsl(200, 60%, 85%)', // Pastel Blue
        'hsl(280, 50%, 85%)' // Pastel Purple
    ],
    monochrome: [
        'hsl(0, 0%, 20%)', // Dark Gray
        'hsl(0, 0%, 40%)', // Medium Gray
        'hsl(0, 0%, 60%)', // Light Gray
        'hsl(0, 0%, 80%)', // Very Light Gray
        'hsl(0, 10%, 90%)' // Off-White
    ],
    contrast: [
        'hsl(0, 90%, 60%)', // Red
        'hsl(180, 90%, 40%)', // Cyan
        'hsl(60, 90%, 60%)', // Yellow
        'hsl(270, 90%, 50%)', // Purple
        'hsl(120, 90%, 40%)' // Green
    ]
};

// Set canvas size
function setCanvasSize() {
    const container = document.querySelector('.canvas-container');
    const size = Math.min(container.clientWidth - 40, 600);
    canvas.width = size;
    canvas.height = size;
}

// Initialize the app
function init() {
    setCanvasSize();
    updateShapeCountValue();
    updateSizeRangeValue();
    updateOpacityRangeValue();
    updateComplexityValue();
    updateOverlapValue();
    setupEventListeners();

    // Add contrast palette to HTML
    addContrastPalette();

    generateArt();

    // Handle window resize
    window.addEventListener('resize', () => {
        setCanvasSize();
        generateArt();
    });
}

// Add contrast palette button if it doesn't exist
function addContrastPalette() {
    const paletteOptions = document.querySelector('.palette-options');
    if (!document.querySelector('[data-palette="contrast"]')) {
        const contrastBtn = document.createElement('button');
        contrastBtn.className = 'palette-btn';
        contrastBtn.dataset.palette = 'contrast';
        contrastBtn.textContent = 'Contrast';
        contrastBtn.addEventListener('click', () => {
            paletteBtns.forEach(b => b.classList.remove('active'));
            contrastBtn.classList.add('active');
            generateArt();
        });
        paletteOptions.appendChild(contrastBtn);

        // Update paletteBtns NodeList
        paletteBtns.forEach(btn => btn.removeEventListener('click', paletteClickHandler));
        const updatedPaletteBtns = document.querySelectorAll('.palette-btn');
        updatedPaletteBtns.forEach(btn => {
            btn.addEventListener('click', paletteClickHandler);
        });
    }
}

// Palette button click handler
function paletteClickHandler() {
    paletteBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    generateArt();
}

// Setup event listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generateArt);
    saveBtn.addEventListener('click', saveArtwork);

    shapeCountSlider.addEventListener('input', updateShapeCountValue);
    sizeRangeSlider.addEventListener('input', updateSizeRangeValue);
    opacityRangeSlider.addEventListener('input', updateOpacityRangeValue);
    complexitySlider.addEventListener('input', updateComplexityValue);
    overlapSlider.addEventListener('input', updateOverlapValue);

    // Add event listeners to all inputs that should trigger art generation
    const inputs = document.querySelectorAll('input[type="range"], input[type="checkbox"], input[type="color"]');
    inputs.forEach(input => {
        input.addEventListener('change', generateArt);
    });

    // Palette buttons
    paletteBtns.forEach(btn => {
        btn.addEventListener('click', paletteClickHandler);
    });
}

// Update value displays
function updateShapeCountValue() {
    shapeCountValue.textContent = shapeCountSlider.value;
}

function updateSizeRangeValue() {
    sizeRangeValue.textContent = sizeRangeSlider.value;
}

function updateOpacityRangeValue() {
    opacityRangeValue.textContent = opacityRangeSlider.value;
}

function updateComplexityValue() {
    complexityValue.textContent = complexitySlider.value;
}

function updateOverlapValue() {
    overlapValue.textContent = `${overlapSlider.value}%`;
}

// Enhanced color selection with harmonious combinations
function getColorFromPalette() {
    const activePalette = document.querySelector('.palette-btn.active').dataset.palette;

    if (activePalette === 'random') {
        return `hsl(${randomInt(0, 360)}, ${randomInt(60, 100)}%, ${randomInt(40, 80)}%)`;
    } else {
        const palette = colorPalettes[activePalette];
        return palette[Math.floor(Math.random() * palette.length)];
    }
}

// Get complementary color for effects
function getComplementaryColor(color) {
    // Extract HSL values
    const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
        const h = parseInt(hslMatch[1]);
        const s = parseInt(hslMatch[2]);
        const l = parseInt(hslMatch[3]);

        // Calculate complementary hue (opposite on color wheel)
        const complementaryH = (h + 180) % 360;

        return `hsl(${complementaryH}, ${s}%, ${l}%)`;
    }
    return color;
}

// Enhanced shape drawing functions
function drawCircle(x, y, size, color, complexity) {
    // Basic circle
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Add details based on complexity
    if (complexity > 5) {
        // Add concentric circles or highlights
        const ringCount = Math.floor(complexity / 2);
        const complementaryColor = getComplementaryColor(color);

        for (let i = 1; i <= ringCount; i++) {
            const ringSize = (size / 2) * (1 - (i / (ringCount + 1)));
            ctx.beginPath();
            ctx.arc(x, y, ringSize, 0, Math.PI * 2);

            // Alternate between stroke and fill
            if (i % 2 === 0) {
                ctx.strokeStyle = color.replace('hsl', 'hsla').replace(')', ', 0.3)');
                ctx.lineWidth = 1;
                ctx.stroke();
            } else {
                ctx.fillStyle = complementaryColor.replace('hsl', 'hsla').replace(')', ', 0.2)');
                ctx.fill();
            }
        }
    }
}

function drawRectangle(x, y, size, color, complexity) {
    const width = size * (0.5 + Math.random() * 1.5);
    const height = size * (0.5 + Math.random() * 1.5);
    const rotation = Math.random() * Math.PI;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Create main rectangle
    ctx.beginPath();
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = color;
    ctx.fill();

    // Add details based on complexity
    if (complexity > 5) {
        const linesCount = Math.floor(complexity / 2);
        const stepX = width / (linesCount + 1);
        const stepY = height / (linesCount + 1);

        ctx.beginPath();
        // Draw horizontal lines
        for (let i = 1; i <= linesCount; i++) {
            const lineY = -height / 2 + (stepY * i);
            ctx.moveTo(-width / 2, lineY);
            ctx.lineTo(width / 2, lineY);
        }

        // Draw vertical lines
        for (let i = 1; i <= linesCount; i++) {
            const lineX = -width / 2 + (stepX * i);
            ctx.moveTo(lineX, -height / 2);
            ctx.lineTo(lineX, height / 2);
        }

        ctx.strokeStyle = color.replace('hsl', 'hsla').replace(')', ', 0.3)');
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.restore();
}

function drawTriangle(x, y, size, color, complexity) {
    const points = [];
    const rotation = Math.random() * Math.PI * 2;

    // Create triangle points
    for (let i = 0; i < 3; i++) {
        const angle = rotation + (i * (Math.PI * 2) / 3);
        const distance = size / 2 * (0.7 + Math.random() * 0.6);
        points.push({
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance
        });
    }

    // Draw main triangle
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Add details based on complexity
    if (complexity > 5) {
        // Add inner triangles
        const centroidX = (points[0].x + points[1].x + points[2].x) / 3;
        const centroidY = (points[0].y + points[1].y + points[2].y) / 3;

        // Create inner triangle
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const nextPoint = points[(i + 1) % 3];
            const midX = (points[i].x + nextPoint.x) / 2;
            const midY = (points[i].y + nextPoint.y) / 2;

            if (i === 0) {
                ctx.moveTo(midX, midY);
            } else {
                ctx.lineTo(midX, midY);
            }
        }
        ctx.closePath();

        const complementaryColor = getComplementaryColor(color);
        ctx.strokeStyle = complementaryColor.replace('hsl', 'hsla').replace(')', ', 0.4)');
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (complexity > 7) {
            // Connect centroid to vertices
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                ctx.moveTo(centroidX, centroidY);
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.strokeStyle = color.replace('hsl', 'hsla').replace(')', ', 0.3)');
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }
}

function drawLine(x, y, size, color, complexity) {
    const angle = Math.random() * Math.PI * 2;
    const length = size * (1 + Math.random());
    const thickness = size / (3 + Math.random() * 7);

    const startX = x + Math.cos(angle) * (length / 2);
    const startY = y + Math.sin(angle) * (length / 2);
    const endX = x - Math.cos(angle) * (length / 2);
    const endY = y - Math.sin(angle) * (length / 2);

    // Draw main line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Add details based on complexity
    if (complexity > 5) {
        // Add parallel lines
        const parallelCount = Math.floor(complexity / 2);
        const spacing = thickness * 1.5;

        for (let i = 1; i <= parallelCount; i++) {
            // Alternate sides
            const perpX = Math.cos(angle + Math.PI / 2) * spacing * i;
            const perpY = Math.sin(angle + Math.PI / 2) * spacing * i;

            ctx.beginPath();
            ctx.moveTo(startX + perpX, startY + perpY);
            ctx.lineTo(endX + perpX, endY + perpY);

            // Thinner lines with reduced opacity
            ctx.lineWidth = thickness * (1 - i / (parallelCount + 2));
            ctx.strokeStyle = color.replace('hsl', 'hsla').replace(')', `, ${0.5 - (i / (parallelCount * 2))})`);
            ctx.stroke();

            // Draw on the other side as well if high complexity
            if (complexity > 7 && i <= parallelCount / 2) {
                ctx.beginPath();
                ctx.moveTo(startX - perpX, startY - perpY);
                ctx.lineTo(endX - perpX, endY - perpY);
                ctx.stroke();
            }
        }
    }
}

// New shape: Spiral
function drawSpiral(x, y, size, color, complexity) {
    const turns = 2 + (complexity / 10 * 2); // More turns with higher complexity
    const spacing = size / 20;
    const startRadius = size / 10;

    ctx.beginPath();
    for (let i = 0; i <= 360 * turns; i += 5) {
        const angle = i * Math.PI / 180;
        const radius = startRadius + (spacing * angle / (2 * Math.PI));
        const pointX = x + Math.cos(angle) * radius;
        const pointY = y + Math.sin(angle) * radius;

        if (i === 0) {
            ctx.moveTo(pointX, pointY);
        } else {
            ctx.lineTo(pointX, pointY);
        }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = size / 30;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Add some details based on complexity
    if (complexity > 6) {
        const dotCount = Math.floor(complexity / 2);
        const dotSpacing = 360 * turns / dotCount;

        for (let i = 0; i < dotCount; i++) {
            const angle = i * dotSpacing * Math.PI / 180;
            const radius = startRadius + (spacing * angle / (2 * Math.PI));
            const dotX = x + Math.cos(angle) * radius;
            const dotY = y + Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.arc(dotX, dotY, size / 40, 0, Math.PI * 2);
            ctx.fillStyle = getComplementaryColor(color);
            ctx.fill();
        }
    }
}

// New shape: Star
function drawStar(x, y, size, color, complexity) {
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.4;
    const spikes = 5 + Math.floor(complexity / 3);

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / spikes) * i;
        const pointX = x + Math.cos(angle) * radius;
        const pointY = y + Math.sin(angle) * radius;

        if (i === 0) {
            ctx.moveTo(pointX, pointY);
        } else {
            ctx.lineTo(pointX, pointY);
        }
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Add some details based on complexity
    if (complexity > 5) {
        ctx.beginPath();
        ctx.arc(x, y, innerRadius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = getComplementaryColor(color).replace('hsl', 'hsla').replace(')', ', 0.5)');
        ctx.fill();
    }
}

// Utility functions
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPosition(size, overlap) {
    const overlapFactor = overlap / 100; // Convert to decimal
    const margin = size * (1 - overlapFactor);
    return {
        x: margin + Math.random() * (canvas.width - 2 * margin),
        y: margin + Math.random() * (canvas.height - 2 * margin)
    };
}

// Add visual texture to the background
function addBackgroundTexture(bgColor, complexity) {
    if (complexity > 3) {
        const dotCount = complexity * 100;
        const dotSize = 1;

        // Extract background color components
        let bgColorRGB = {
            r: 255,
            g: 255,
            b: 255
        };
        if (bgColor.startsWith('#')) {
            const r = parseInt(bgColor.slice(1, 3), 16);
            const g = parseInt(bgColor.slice(3, 5), 16);
            const b = parseInt(bgColor.slice(5, 7), 16);
            bgColorRGB = {
                r,
                g,
                b
            };
        }

        // Create dots with slightly different colors than background
        for (let i = 0; i < dotCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;

            // Calculate dot color (slight variation from background)
            const variation = 10 + (complexity * 2);
            const r = Math.max(0, Math.min(255, bgColorRGB.r + randomInt(-variation, variation)));
            const g = Math.max(0, Math.min(255, bgColorRGB.g + randomInt(-variation, variation)));
            const b = Math.max(0, Math.min(255, bgColorRGB.b + randomInt(-variation, variation)));

            const opacity = 0.1 + Math.random() * 0.3;

            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();
        }
    }
}

// Apply composition rules (add visual focus points)
function createCompositionGuides(complexity) {
    // Use the rule of thirds or golden ratio for better composition
    if (complexity > 5) {
        const gridLines = complexity > 7 ? 'golden' : 'thirds';

        if (gridLines === 'thirds') {
            // Return rule of thirds points
            const third = canvas.width / 3;
            return [{
                    x: third,
                    y: third
                },
                {
                    x: third * 2,
                    y: third
                },
                {
                    x: third,
                    y: third * 2
                },
                {
                    x: third * 2,
                    y: third * 2
                }
            ];
        } else {
            // Return golden ratio points
            const golden = canvas.width * 0.618;
            const inverse = canvas.width * 0.382;
            return [{
                    x: inverse,
                    y: inverse
                },
                {
                    x: golden,
                    y: inverse
                },
                {
                    x: inverse,
                    y: golden
                },
                {
                    x: golden,
                    y: golden
                }
            ];
        }
    }

    // For simpler compositions, just use center and random points
    return [{
            x: canvas.width / 2,
            y: canvas.height / 2
        },
        {
            x: canvas.width / 4,
            y: canvas.height / 2
        },
        {
            x: canvas.width * 3 / 4,
            y: canvas.height / 2
        },
        {
            x: canvas.width / 2,
            y: canvas.height / 4
        },
        {
            x: canvas.width / 2,
            y: canvas.height * 3 / 4
        }
    ];
}

// Main art generation function
function generateArt() {
    const shapeCount = parseInt(shapeCountSlider.value);
    const maxSize = parseInt(sizeRangeSlider.value);
    const minSize = maxSize * 0.3;
    const maxOpacity = parseFloat(opacityRangeSlider.value);
    const minOpacity = maxOpacity * 0.5;
    const bgColor = bgColorPicker.value;
    const complexity = parseInt(complexitySlider.value);
    const overlap = parseInt(overlapSlider.value);

    // Get enabled shape types
    const enabledShapes = [];
    for (const [shape, checkbox] of Object.entries(shapesCheckboxes)) {
        if (checkbox.checked) {
            enabledShapes.push(shape);
        }
    }

    // Default to circles if no shapes selected
    if (enabledShapes.length === 0) {
        enabledShapes.push('circles');
        shapesCheckboxes.circles.checked = true;
    }

    // Clear canvas and set background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle background texture
    addBackgroundTexture(bgColor, complexity);

    // Get composition guide points for better placement
    const focusPoints = createCompositionGuides(complexity);

    // Create layered effect based on complexity
    const layers = Math.max(1, Math.floor(complexity / 2));
    const shapesPerLayer = Math.floor(shapeCount / layers);

    // Create a focused composition by placing larger elements at key points
    if (complexity > 4) {
        // Place large elements at focus points
        focusPoints.forEach((point, index) => {
            if (index < Math.min(focusPoints.length, complexity / 2)) {
                const size = maxSize * (0.8 + Math.random() * 0.4);
                const opacity = maxOpacity * (0.8 + Math.random() * 0.2);

                // Select random shape type from enabled shapes
                const shapeType = enabledShapes[Math.floor(Math.random() * enabledShapes.length)];

                // Generate color with opacity
                const color = getColorFromPalette();
                const colorWithOpacity = color.replace('hsl', 'hsla').replace(')', `, ${opacity})`);

                // Draw selected shape at focus point
                drawShapeByType(shapeType, point.x, point.y, size, colorWithOpacity, complexity);

                // Add some supporting elements around focus point
                const supportCount = Math.floor(complexity / 3);
                for (let i = 0; i < supportCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = size * 0.6;
                    const supportX = point.x + Math.cos(angle) * distance;
                    const supportY = point.y + Math.sin(angle) * distance;
                    const supportSize = size * (0.3 + Math.random() * 0.3);
                    const supportOpacity = opacity * 0.7;

                    const supportColor = getColorFromPalette();
                    const supportColorWithOpacity = supportColor.replace('hsl', 'hsla').replace(')', `, ${supportOpacity})`);

                    drawShapeByType(shapeType, supportX, supportY, supportSize, supportColorWithOpacity, complexity);
                }
            }
        });
    }

    // Create base layers
    for (let layer = 0; layer < layers; layer++) {
        // Determine layer-specific parameters
        const layerSizeFactor = 1 - (layer * 0.15);
        const layerOpacityFactor = 1 - (layer * 0.1);

        for (let i = 0; i < shapesPerLayer; i++) {
            // Calculate size and opacity based on layer
            const size = (minSize + Math.random() * (maxSize - minSize)) * layerSizeFactor;
            const opacity = (minOpacity + Math.random() * (maxOpacity - minOpacity)) * layerOpacityFactor;

            // Get random position with overlap factor
            const pos = getRandomPosition(size, overlap);

            // Select random shape type from enabled shapes
            let shapeType = enabledShapes[Math.floor(Math.random() * enabledShapes.length)];

            // Occasionally add special shapes for higher complexity
            if (complexity > 6 && Math.random() < 0.2) {
                shapeType = Math.random() < 0.5 ? 'spiral' : 'star';
            }

            // Generate color with opacity
            const color = getColorFromPalette();
            const colorWithOpacity = color.replace('hsl', 'hsla').replace(')', `, ${opacity})`);

            // Draw selected shape
            drawShapeByType(shapeType, pos.x, pos.y, size, colorWithOpacity, complexity);
        }
    }

    // Add small details based on complexity
    const detailCount = complexity * 7;
    const detailSize = minSize * 0.4;

    for (let i = 0; i < detailCount; i++) {
        const size = Math.random() * detailSize;
        const pos = getRandomPosition(size, overlap);
        const opacity = minOpacity + Math.random() * (maxOpacity - minOpacity);
        const color = getColorFromPalette();
        const colorWithOpacity = color.replace('hsl', 'hsla').replace(')', `, ${opacity})`);

        // Randomly choose a shape for details
        const shapeType = enabledShapes[Math.floor(Math.random() * enabledShapes.length)];

        drawShapeByType(shapeType, pos.x, pos.y, size, colorWithOpacity, complexity);
    }

    // Add final artistic touches for high complexity
    if (complexity > 8) {
        addArtisticTouches(complexity, maxOpacity);
    }
}

// Helper function to draw shape based on type
function drawShapeByType(shapeType, x, y, size, color, complexity) {
    switch (shapeType) {
        case 'circles':
            drawCircle(x, y, size, color, complexity);
            break;
        case 'rectangles':
            drawRectangle(x, y, size, color, complexity);
            break;
        case 'triangles':
            drawTriangle(x, y, size, color, complexity);
            break;
        case 'lines':
            drawLine(x, y, size, color, complexity);
            break;
        case 'spiral':
            drawSpiral(x, y, size, color, complexity);
            break;
        case 'star':
            drawStar(x, y, size, color, complexity);
            break;
    }
}

// Add final artistic touches
function addArtisticTouches(complexity, maxOpacity) {
    // Add connecting lines between elements for unity
    const lineCount = complexity * 2;

    ctx.globalCompositeOperation = 'soft-light';

    for (let i = 0; i < lineCount; i++) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Add bezier curve for more organic feel
        const controlX1 = startX + (endX - startX) * 0.33;
        const controlY1 = startY + (endY - startY) * 0.33 + (Math.random() - 0.5) * 100;
        const controlX2 = startX + (endX - startX) * 0.66;
        const controlY2 = startY + (endY - startY) * 0.66 + (Math.random() - 0.5) * 100;

        ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);

        const color = getColorFromPalette();
        // Continuing from where the code was cut off in addArtisticTouches function
        ctx.strokeStyle = color.replace('hsl', 'hsla').replace(')', `, ${maxOpacity * 0.3})`);
        ctx.lineWidth = 0.5 + Math.random() * 1.5;
        ctx.stroke();
    }

    // Reset composite operation to default
    ctx.globalCompositeOperation = 'source-over';

    // Add subtle glow effects to random elements
    const glowCount = Math.floor(complexity / 2);
    for (let i = 0; i < glowCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 30 + Math.random() * 50;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const color = getColorFromPalette();
        gradient.addColorStop(0, color.replace('hsl', 'hsla').replace(')', ', 0.2)'));
        gradient.addColorStop(1, color.replace('hsl', 'hsla').replace(')', ', 0)'));

        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
}

// Save artwork as PNG
function saveArtwork() {
    // Create temporary link
    const link = document.createElement('a');
    link.download = 'abstract-artwork.png';

    // Convert canvas to data URL
    link.href = canvas.toDataURL('image/png');

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize app when DOM is loaded
window.addEventListener('DOMContentLoaded', init);