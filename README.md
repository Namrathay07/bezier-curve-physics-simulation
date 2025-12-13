# Interactive Bézier Curve with Physics

## Project Overview
This project implements an interactive cubic Bézier curve that behaves like a springy rope, responding to mouse movement with real-time physics simulation.

## Key Features
- **Cubic Bézier Curve**: Implemented from scratch using the mathematical formula
- **Spring Physics**: Dynamic control points with spring-damping simulation
- **Tangent Visualization**: Shows curve direction at multiple points
- **Interactive Control**: Drag control points or move mouse to influence the curve
- **Real-time Rendering**: Smooth 60+ FPS animation

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

## How to Use
1. Open `index.html` in a modern web browser
2. Move mouse near the curve to influence it with physics
3. Click and drag control points P₁ or P₂ for direct manipulation
4. Adjust spring stiffness and damping using sliders
5. Click "Reset Curve" to return to initial state

## Performance Considerations
- **Efficient Rendering**: Uses trail effect with semi-transparent clear
- **Fixed Time Step**: Physics updates with delta time for consistency
- **Optimized Calculations**: Pre-computed values where possible
- **60 FPS Target**: Achieved through efficient canvas operations

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

## Future Enhancements
- Touch support for mobile devices
- Multiple curves with different properties
- Export functionality for curve data
- Advanced physics (collisions, multiple springs)