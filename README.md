# Interactive Bézier Curve with Physics

## Project Overview
This project implements an interactive cubic Bézier curve that behaves like a springy rope, responding to mouse movement with real-time physics simulation.

##  Features

### **Core Assignment Requirements**
1. **Manual Bézier Mathematics** - Pure implementation without external libraries
2. **Spring Physics Simulation** - Real-time physics with damping model: `acceleration = -k*(position - target) - damping*velocity`
3. **Tangent Visualization** - Dynamic tangent vectors with arrow heads at 8 points along curve
4. **Interactive Control** - Mouse-driven point manipulation with smooth response
5. **60+ FPS Performance** - Optimized canvas rendering using `requestAnimationFrame()`
6. **Control Points Behavior** - P₀ & P₃ fixed, P₁ & P₂ dynamic with physics
7. **Real-time Rendering** - Smooth animation with immediate visual feedback
   
### **Advanced Features Added**
8. **Particle System** - Animated particles along the curve with color variations and life decay
9. **Glow & Visual Effects** - Gradient curve coloring, outer glow, shadow effects, and glassmorphism UI
10. **Environmental Physics** - Wind force (-1 to 1) and gravity (0-2) simulation
11. **Auto-Oscillation Mode** - Automatic wave-like motion for demo purposes
12. **Performance Dashboard** - Real-time statistics: FPS, particle count, curve length, system energy
13. **Math Visualization Panel** - Live parameter (t-value) and tangent magnitude display
14. **Snapshot Feature** - Export current curve state as PNG image with one click
15. **Modern UI/UX** - Professional glassmorphism design with intuitive sliders and toggles
16. **Randomize Function** - Generate infinite random curve configurations

## Mathematical Implementation

### Bézier Curve Formula
The cubic Bézier curve is calculated using:
B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
Where `t ∈ [0, 1]` and P₀-P₃ are control points.

### Tangent Calculation
Tangents are computed using the derivative:
B'(t) = 3(1-t)²(P₁-P₀) + 6(1-t)t(P₂-P₁) + 3t²(P₃-P₂)

Tangents are normalized and visualized along the curve.

### Spring Physics Model
For dynamic control points (P₁, P₂), spring physics is applied:
acceleration = -k * (position - target) - damping * velocity
velocity = velocity + acceleration * dt
position = position + velocity * dt

Where:
- `k` = spring stiffness (adjustable via slider)
- `damping` = velocity damping coefficient
- `target` = mouse position or drag target
- `dt` = time since last frame

## Technical Implementation

### Architecture
- **BezierCurve Class**: Main class encapsulating all functionality
- **Canvas Rendering**: Pure HTML5 Canvas with manual drawing
- **Event-Driven**: Mouse events for interaction
- **Animation Loop**: RequestAnimationFrame for smooth updates

### File Structure
- `index.html` - Main HTML structure
- `style.css` - Styling and layout
- `bezier.js` - Core logic and rendering
- `README.md` - This documentation

## Quick Start (HOW TO USE)

1. **Open** index.html and run
2. **Move mouse** near the curve to influence it with physics
3. **Click and drag** control points P₁ or P₂ for direct manipulation
4. **Adjust sliders** for:
   - Spring Stiffness (0.01-0.5)
   - Damping (0.9-0.99)
   - Wind Force (-1 to 1)
   - Gravity (0-2)
5. **Toggle features**:
   - Particle System
   - Motion Trail
   - Glow Effect
   - Math Info Display
   - Auto Oscillation
6. **Use buttons**:
   - Reset: Return to default curve
   - Randomize: Create random curve
   - Snapshot: Save as PNG image
## 📊 Real-time Statistics Display

| Metric | Description | Real-time Updates |
|--------|-------------|-------------------|
| **FPS** | Frames per second | Shows performance (target: 60) |
| **Particles** | Active particle count | Updates as particles emit/decay |
| **Curve Length** | Approximate length in pixels | Changes with curve deformation |
| **System Energy** | Kinetic + potential energy | Reflects physics system state |

## Interview Talking Points

### 1. Bézier Mathematics
- Understand the parametric nature of Bézier curves
- Explain how the basis functions weight control points
- Discuss the derivative for tangent calculation

### 2. Physics Simulation
- Spring-mass-damper system implementation
- Numerical integration (Euler method)
- Constraints and boundary handling

### 3. Real-time Graphics
- Canvas rendering pipeline
- RequestAnimationFrame for smooth animation
- Event handling and user interaction

### 4. Code Structure
- Object-oriented design with clear separation of concerns
- Configurable parameters for easy experimentation
- Clean, commented code following best practices

