// bezier.js - Complete implementation

// Add at the top of bezier.js, before the BezierCurve class
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
        this.radius *= 0.99;
    }
    
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    
    isAlive() {
        return this.life > 0;
    }
}

class GlowEffect {
    constructor() {
        this.particles = [];
        this.colors = ['#4cc9f0', '#4361ee', '#7209b7', '#f72585'];
    }
    
    emit(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.particles.push(new Particle(x, y, color));
        }
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (!this.particles[i].isAlive()) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        this.particles.forEach(particle => particle.draw(ctx));
        ctx.restore();
    }
}

class BezierCurve {
    constructor() {
        this.canvas = document.getElementById('bezierCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Visual effects
        this.glowEffect = new GlowEffect();
        this.showParticles = true;
        this.glowIntensity = 0.8;
        this.trailEffect = true;
        
        // Curve styling
        this.curveGradient = null;
        this.tangentColors = ['#ff006e', '#fb5607', '#ffbe0b', '#3a86ff', '#8338ec'];
        
        // Physics and interaction
        this.autoOscillate = false;
        this.oscillationTime = 0;
        this.windForce = 0;
        this.gravity = 0;
        this.environmentForces = true;
        this.showMathInfo = false;
        this.lastFrameTime = 0;
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Control points: P0, P1, P2, P3
        this.controlPoints = [
            { x: 100, y: 300, fixed: true, targetX: 100, targetY: 300 },    // P0 - fixed
            { x: 200, y: 100, vx: 0, vy: 0, targetX: 200, targetY: 100 },   // P1 - dynamic
            { x: 400, y: 100, vx: 0, vy: 0, targetX: 400, targetY: 100 },   // P2 - dynamic
            { x: 500, y: 300, fixed: true, targetX: 500, targetY: 300 }     // P3 - fixed
        ];
        
        // Spring physics parameters
        this.springStiffness = 0.1;
        this.damping = 0.95;
        
        // Mouse interaction
        this.mouse = { x: 0, y: 0, isDown: false, draggingPoint: null };
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation
        this.lastTime = 0;
        this.animate();
        
        // Setup sliders and controls
        this.setupSliders();
    }
    
    resizeCanvas() {
        this.canvas.width = Math.min(900, window.innerWidth - 40);
        this.canvas.height = 600;
    }
    
    setupEventListeners() {
        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            
            // If dragging a point, update its target
            if (this.mouse.isDown && this.mouse.draggingPoint !== null) {
                const point = this.controlPoints[this.mouse.draggingPoint];
                point.targetX = this.mouse.x;
                point.targetY = this.mouse.y;
            }
        });
        
        // Mouse down
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            this.checkPointDrag();
        });
        
        // Mouse up
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
            this.mouse.draggingPoint = null;
        });
        
        // Mouse leave
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isDown = false;
            this.mouse.draggingPoint = null;
        });
    }
    
    // === STEP 14: FINAL INTEGRATION WITH ALL CONTROLS ===
    setupSliders() {
        // Physics sliders
        const stiffnessSlider = document.getElementById('stiffnessSlider');
        const dampingSlider = document.getElementById('dampingSlider');
        const windSlider = document.getElementById('windSlider');
        const gravitySlider = document.getElementById('gravitySlider');
        
        // Toggle controls
        const particlesToggle = document.getElementById('particlesToggle');
        const trailToggle = document.getElementById('trailToggle');
        const glowToggle = document.getElementById('glowToggle');
        const mathToggle = document.getElementById('mathToggle');
        const oscillateToggle = document.getElementById('oscillateToggle');
        
        // Buttons
        const resetBtn = document.getElementById('resetBtn');
        const randomBtn = document.getElementById('randomBtn');
        const snapshotBtn = document.getElementById('snapshotBtn');
        
        // Event listeners for sliders
        stiffnessSlider.addEventListener('input', (e) => {
            this.springStiffness = parseFloat(e.target.value);
            document.getElementById('stiffnessValue').textContent = e.target.value;
        });
        
        dampingSlider.addEventListener('input', (e) => {
            this.damping = parseFloat(e.target.value);
            document.getElementById('dampingValue').textContent = e.target.value;
        });
        
        windSlider.addEventListener('input', (e) => {
            this.windForce = parseFloat(e.target.value);
            document.getElementById('windValue').textContent = e.target.value;
        });
        
        gravitySlider.addEventListener('input', (e) => {
            this.gravity = parseFloat(e.target.value);
            document.getElementById('gravityValue').textContent = e.target.value;
        });
        
        // Event listeners for toggles
        particlesToggle.addEventListener('change', (e) => {
            this.showParticles = e.target.checked;
        });
        
        trailToggle.addEventListener('change', (e) => {
            this.trailEffect = e.target.checked;
        });
        
        glowToggle.addEventListener('change', (e) => {
            this.glowIntensity = e.target.checked ? 0.8 : 0;
        });
        
        mathToggle.addEventListener('change', (e) => {
            this.showMathInfo = e.target.checked;
        });
        
        oscillateToggle.addEventListener('change', (e) => {
            this.autoOscillate = e.target.checked;
            if (this.autoOscillate) {
                // Reset oscillation time when starting
                this.oscillationTime = 0;
            }
        });
        
        // Event listeners for buttons
        resetBtn.addEventListener('click', () => {
            this.resetCurve();
        });
        
        randomBtn.addEventListener('click', () => {
            this.randomizeCurve();
        });
        
        snapshotBtn.addEventListener('click', () => {
            this.takeSnapshot();
        });
    }
    
    randomizeCurve() {
        for (let i = 1; i <= 2; i++) {
            const point = this.controlPoints[i];
            point.x = Math.random() * (this.canvas.width - 200) + 100;
            point.y = Math.random() * (this.canvas.height - 200) + 100;
            point.vx = (Math.random() - 0.5) * 5;
            point.vy = (Math.random() - 0.5) * 5;
            point.targetX = point.x;
            point.targetY = point.y;
        }
    }
    
    // Check if mouse is near a control point for dragging
    checkPointDrag() {
        const dragRadius = 20;
        for (let i = 1; i <= 2; i++) { // Only P1 and P2 are draggable
            const point = this.controlPoints[i];
            const dx = point.x - this.mouse.x;
            const dy = point.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < dragRadius) {
                this.mouse.draggingPoint = i;
                point.targetX = this.mouse.x;
                point.targetY = this.mouse.y;
                return;
            }
        }
    }
    
    // Calculate point on Bézier curve at parameter t (0 to 1)
    calculateBezierPoint(t) {
        const p0 = this.controlPoints[0];
        const p1 = this.controlPoints[1];
        const p2 = this.controlPoints[2];
        const p3 = this.controlPoints[3];
        
        // Cubic Bézier formula: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;
        
        const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
        const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
        
        return { x, y };
    }
    
    // Calculate tangent vector at parameter t
    calculateBezierTangent(t) {
        const p0 = this.controlPoints[0];
        const p1 = this.controlPoints[1];
        const p2 = this.controlPoints[2];
        const p3 = this.controlPoints[3];
        
        // Derivative formula: B'(t) = 3(1-t)²(P₁-P₀) + 6(1-t)t(P₂-P₁) + 3t²(P₃-P₂)
        const u = 1 - t;
        
        const dx = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
        const dy = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
        
        // Normalize the tangent vector
        const length = Math.sqrt(dx * dx + dy * dy);
        return {
            x: dx / (length || 1), // Avoid division by zero
            y: dy / (length || 1),
            length: length
        };
    }

    updateOscillation(deltaTime) {
        if (!this.autoOscillate) return;
        
        this.oscillationTime += deltaTime;
        
        // Create gentle wave-like motion
        const amplitude = 100;
        const frequency = 1;
        
        this.controlPoints[1].targetX = 200 + Math.sin(this.oscillationTime * frequency) * amplitude;
        this.controlPoints[1].targetY = 100 + Math.cos(this.oscillationTime * frequency * 0.7) * amplitude * 0.5;
        
        this.controlPoints[2].targetX = 400 + Math.cos(this.oscillationTime * frequency * 1.3) * amplitude;
        this.controlPoints[2].targetY = 100 + Math.sin(this.oscillationTime * frequency * 0.9) * amplitude * 0.5;
    }
 
    applyEnvironmentForces(deltaTime) {
        if (!this.environmentForces) return;
        
        for (let i = 1; i <= 2; i++) {
            const point = this.controlPoints[i];
            
            // Apply wind (horizontal force)
            point.vx += this.windForce * deltaTime;
            
            // Apply gravity (vertical force)
            point.vy += this.gravity * deltaTime;
            
            // Apply air resistance
            point.vx *= 0.999;
            point.vy *= 0.999;
        }
    }
   
    updatePhysics(deltaTime) {
        // Apply oscillation if enabled
        if (this.autoOscillate) {
            this.updateOscillation(deltaTime);
        }
        
        // Apply environmental forces
        this.applyEnvironmentForces(deltaTime);
        
        // Apply spring physics to dynamic control points (P1 and P2)
        for (let i = 1; i <= 2; i++) {
            const point = this.controlPoints[i];
            
            // If not being dragged and not auto-oscillating, use mouse position as target
            if (this.mouse.draggingPoint !== i && !this.autoOscillate) {
                point.targetX = this.mouse.x;
                point.targetY = this.mouse.y;
                
                // Weaken attraction when not dragging
                const attractionStrength = 0.02;
                const dx = point.targetX - point.x;
                const dy = point.targetY - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 50) {
                    point.targetX = point.x + dx * attractionStrength;
                    point.targetY = point.y + dy * attractionStrength;
                }
            }
            
            // Spring force: F = -k * (x - target)
            const springForceX = -this.springStiffness * (point.x - point.targetX);
            const springForceY = -this.springStiffness * (point.y - point.targetY);
            
            // Damping force: F = -damping * velocity
            const dampingForceX = -this.damping * point.vx;
            const dampingForceY = -this.damping * point.vy;
            
            // Update velocity (assuming mass = 1)
            point.vx += (springForceX + dampingForceX) * deltaTime;
            point.vy += (springForceY + dampingForceY) * deltaTime;
            
            // Update position
            point.x += point.vx * deltaTime;
            point.y += point.vy * deltaTime;
            
            // Boundary constraints
            point.x = Math.max(50, Math.min(this.canvas.width - 50, point.x));
            point.y = Math.max(50, Math.min(this.canvas.height - 50, point.y));
        }
    }
    
    updateMathInfo() {
        if (!this.showMathInfo) return;
        
        // Find closest point on curve to mouse
        let closestT = 0.5;
        let minDistance = Infinity;
        
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const point = this.calculateBezierPoint(t);
            const dx = point.x - this.mouse.x;
            const dy = point.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestT = t;
            }
        }
        
        // Update display
        const tValueElement = document.getElementById('tValue');
        const selectedPointElement = document.getElementById('selectedPoint');
        
        if (tValueElement) {
            tValueElement.textContent = closestT.toFixed(3);
        }
        
        if (selectedPointElement) {
            const selectedPoint = this.mouse.draggingPoint !== null ? 
                `P${this.mouse.draggingPoint}` : 'None';
            selectedPointElement.textContent = selectedPoint;
        }
    }
    
    // === STEP 13: PERFORMANCE STATISTICS ===
    updateStatistics() {
        // FPS counter
        const now = performance.now();
        if (!this.lastFrameTime) this.lastFrameTime = now;
        const fps = 1000 / (now - this.lastFrameTime);
        this.lastFrameTime = now;
        
        const fpsElement = document.getElementById('fpsCounter');
        if (fpsElement) {
            fpsElement.textContent = Math.min(60, Math.round(fps));
        }
        
        // Particle count
        const particleCountElement = document.getElementById('particleCount');
        if (particleCountElement) {
            particleCountElement.textContent = this.glowEffect.particles.length;
        }
        
        // Curve length approximation
        let length = 0;
        let lastPoint = null;
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const point = this.calculateBezierPoint(t);
            if (lastPoint) {
                const dx = point.x - lastPoint.x;
                const dy = point.y - lastPoint.y;
                length += Math.sqrt(dx * dx + dy * dy);
            }
            lastPoint = point;
        }
        
        const curveLengthElement = document.getElementById('curveLength');
        if (curveLengthElement) {
            curveLengthElement.textContent = Math.round(length);
        }
        
        // System energy (kinetic + potential)
        let energy = 0;
        for (let i = 1; i <= 2; i++) {
            const point = this.controlPoints[i];
            const kinetic = 0.5 * (point.vx * point.vx + point.vy * point.vy);
            const dx = point.x - point.targetX;
            const dy = point.y - point.targetY;
            const potential = 0.5 * this.springStiffness * (dx * dx + dy * dy);
            energy += kinetic + potential;
        }
        
        const energyElement = document.getElementById('energy');
        if (energyElement) {
            energyElement.textContent = energy.toFixed(2);
        }
    }
    
    draw() {
        const ctx = this.ctx;
        
        // Clear canvas - use trail effect if enabled
        if (this.trailEffect) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            ctx.fillStyle = '#0a0e17';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Draw Bézier curve
        this.drawCurve();
        
        // Draw control points and lines
        this.drawControlPoints();
        
        // Draw tangents along the curve
        this.drawTangents();
        
        // Update math info display
        this.updateMathInfo();
        
        // Update performance statistics
        this.updateStatistics();
    }
    
    drawCurve() {
        const ctx = this.ctx;
        
        // Create gradient for the curve
        if (!this.curveGradient) {
            this.curveGradient = ctx.createLinearGradient(
                this.controlPoints[0].x, 
                this.controlPoints[0].y,
                this.controlPoints[3].x,
                this.controlPoints[3].y
            );
            this.curveGradient.addColorStop(0, '#4cc9f0');
            this.curveGradient.addColorStop(0.5, '#7209b7');
            this.curveGradient.addColorStop(1, '#f72585');
        }
        
        // Draw curve with glow effect
        ctx.beginPath();
        ctx.moveTo(this.controlPoints[0].x, this.controlPoints[0].y);
        
        const steps = 100;
        let lastPoint = null;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const point = this.calculateBezierPoint(t);
            
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
            
            // Emit particles along the curve (randomly)
            if (this.showParticles && Math.random() < 0.1) {
                this.glowEffect.emit(point.x, point.y, 1);
            }
            
            lastPoint = point;
        }
        
        // Draw outer glow
        if (this.glowIntensity > 0) {
            ctx.save();
            ctx.strokeStyle = 'rgba(76, 201, 240, 0.3)';
            ctx.lineWidth = 10;
            ctx.stroke();
            
            ctx.strokeStyle = 'rgba(76, 201, 240, 0.2)';
            ctx.lineWidth = 20;
            ctx.stroke();
            ctx.restore();
        }
        
        // Draw main curve
        ctx.strokeStyle = this.curveGradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        // Update and draw particles
        if (this.showParticles) {
            this.glowEffect.update();
            this.glowEffect.draw(ctx);
        }
    }
    
    drawControlPoints() {
        const ctx = this.ctx;
        
        // Draw control polygon lines
        ctx.beginPath();
        ctx.moveTo(this.controlPoints[0].x, this.controlPoints[0].y);
        ctx.lineTo(this.controlPoints[1].x, this.controlPoints[1].y);
        ctx.lineTo(this.controlPoints[2].x, this.controlPoints[2].y);
        ctx.lineTo(this.controlPoints[3].x, this.controlPoints[3].y);
        ctx.strokeStyle = 'rgba(76, 201, 240, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw control points
        for (let i = 0; i < this.controlPoints.length; i++) {
            const point = this.controlPoints[i];
            
            // Draw point
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = point.fixed ? '#7209b7' : (i === this.mouse.draggingPoint ? '#f72585' : '#4361ee');
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw label
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`P${i}`, point.x - 10, point.y - 15);
        }
    }
    
    drawTangents() {
        const ctx = this.ctx;
        const tangentLength = 40;
        
        // Draw tangents at 8 points along the curve
        for (let i = 0; i <= 8; i++) {
            const t = i / 8;
            const point = this.calculateBezierPoint(t);
            const tangent = this.calculateBezierTangent(t);
            
            // Use different colors for different tangents
            const colorIndex = i % this.tangentColors.length;
            
            // Draw tangent line with arrow
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x + tangent.x * tangentLength, point.y + tangent.y * tangentLength);
            ctx.strokeStyle = this.tangentColors[colorIndex];
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw arrow head
            this.drawArrow(
                point.x + tangent.x * tangentLength,
                point.y + tangent.y * tangentLength,
                Math.atan2(tangent.y, tangent.x)
            );
            
            // Draw tangent point with glow
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = this.tangentColors[colorIndex];
            ctx.shadowColor = this.tangentColors[colorIndex];
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Show tangent vector magnitude
            if (this.showMathInfo) {
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.fillText(`|T|=${tangent.length.toFixed(2)}`, point.x + 10, point.y - 10);
            }
        }
    }
    
    drawArrow(x, y, angle) {
        const ctx = this.ctx;
        const arrowLength = 10;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowLength, -arrowLength / 2);
        ctx.lineTo(-arrowLength, arrowLength / 2);
        ctx.closePath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
        
        ctx.restore();
    }
    
    animate(currentTime = 0) {
        // Calculate delta time (in seconds)
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        // Update physics
        this.updatePhysics(deltaTime);
        
        // Draw everything
        this.draw();
        
        // Request next frame
        requestAnimationFrame((time) => this.animate(time));
    }
    
    resetCurve() {
        this.controlPoints = [
            { x: 100, y: 300, fixed: true, targetX: 100, targetY: 300 },
            { x: 200, y: 100, vx: 0, vy: 0, targetX: 200, targetY: 100 },
            { x: 400, y: 100, vx: 0, vy: 0, targetX: 400, targetY: 100 },
            { x: 500, y: 300, fixed: true, targetX: 500, targetY: 300 }
        ];
        
        this.mouse = { x: 0, y: 0, isDown: false, draggingPoint: null };
        this.oscillationTime = 0;
    }
    
    takeSnapshot() {
        // Create a temporary canvas to draw the snapshot
        const snapshotCanvas = document.createElement('canvas');
        snapshotCanvas.width = this.canvas.width;
        snapshotCanvas.height = this.canvas.height;
        const snapshotCtx = snapshotCanvas.getContext('2d');
        
        // Draw background
        snapshotCtx.fillStyle = '#0a0e17';
        snapshotCtx.fillRect(0, 0, snapshotCanvas.width, snapshotCanvas.height);
        
        // Draw the curve state
        this.drawOnContext(snapshotCtx);
        
        // Convert to data URL and download
        const link = document.createElement('a');
        link.download = `bezier-snapshot-${Date.now()}.png`;
        link.href = snapshotCanvas.toDataURL('image/png');
        link.click();
    }
    
    drawOnContext(ctx) {
        // Save current context and use provided one
        const originalCtx = this.ctx;
        this.ctx = ctx;
        this.draw();
        this.ctx = originalCtx;
    }
}

// Initialize everything when page loads
window.addEventListener('load', () => {
    new BezierCurve();
});