import React, { useState, useRef, useEffect } from 'react';

// --- MOCK MODEL LOGIC (Simulating your Python Backend) ---
// In production, these functions would be replaced by a fetch() call to your FastAPI/Python server

const calculateMockXG = (x, y) => {
  // Goal is located at (120, 40)
  const distToGoal = Math.hypot(120 - x, 40 - y);
  
  // If player is in their own half, xG is practically 0
  if (x < 60) return 0.00;
  
  // Simple exponential decay based on distance to simulate our XGBoost model
  let xg = 0.9 * Math.exp(-distToGoal / 12);
  
  // Penalize bad angles (y too far from center 40)
  const anglePenalty = Math.abs(40 - y) / 40;
  xg = xg * (1 - (anglePenalty * 0.5));
  
  return Math.max(0, Math.min(0.99, xg));
};

const calculateMockXT = (cellX, cellY) => {
  // Simulating the converged Bellman Equation Grid
  // xT grows exponentially as we get closer to the opponent's goal (cellX = 15)
  const xFactor = Math.pow((cellX / 15), 3);
  
  // High value zones are slightly centralized (Zone 14)
  const yDistance = Math.abs(5.5 - cellY); // center is roughly between 5 and 6
  const yFactor = 1 - (yDistance / 10);
  
  const baseXT = xFactor * 0.25 * yFactor;
  
  return Math.max(0.001, baseXT);
};

export default function App() {
  const pitchRef = useRef(null);
  const [position, setPosition] = useState({ x: 95.0, y: 40.0 });
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Calculated Values
  const cellX = Math.min(Math.floor(position.x / 7.5), 15);
  const cellY = Math.min(Math.floor(position.y / 6.666), 11);
  const xTValue = calculateMockXT(cellX, cellY);
  const xGValue = calculateMockXG(position.x, position.y);

  // Handle clicking on the SVG pitch
  const handlePitchClick = (e) => {
    if (!pitchRef.current) return;
    
    const rect = pitchRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert click coordinates to 120x80 StatsBomb scale
    const realX = (clickX / rect.width) * 120;
    const realY = (clickY / rect.height) * 80;
    
    setPosition({
      x: Math.max(0, Math.min(120, realX)),
      y: Math.max(0, Math.min(80, realY))
    });
  };

  // Generate heatmap grid squares
  const renderHeatmap = () => {
    const squares = [];
    for (let cx = 0; cx < 16; cx++) {
      for (let cy = 0; cy < 12; cy++) {
        const xt = calculateMockXT(cx, cy);
        // Normalize opacity for visual effect (max expected xT around 0.25)
        const opacity = Math.min(0.8, (xt / 0.25) * 0.7); 
        
        squares.push(
          <rect
            key={`${cx}-${cy}`}
            x={cx * 7.5}
            y={cy * 6.666}
            width="7.5"
            height="6.666"
            fill="#ffaa00"
            opacity={opacity}
            style={{ pointerEvents: 'none', transition: 'opacity 0.3s' }}
          />
        );
      }
    }
    return squares;
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="border-b border-neutral-700 pb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Football Analytics Engine</h1>
          <p className="text-neutral-400 mt-1">Interactive Expected Goals (xG) & Expected Threat (xT) Demonstration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pitch Area (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Interactive Pitch (120x80)</h2>
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showHeatmap ? 'bg-orange-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
              >
                {showHeatmap ? 'Hide xT Grid' : 'Show xT Grid Overlay'}
              </button>
            </div>
            
            {/* The SVG Pitch Container */}
            <div 
              className="w-full bg-[#22312b] rounded-lg shadow-2xl overflow-hidden cursor-crosshair border-2 border-neutral-700 relative"
              style={{ aspectRatio: '120 / 80' }}
            >
              <svg 
                ref={pitchRef}
                viewBox="0 0 120 80" 
                className="w-full h-full"
                onClick={handlePitchClick}
              >
                {/* Heatmap Overlay */}
                {showHeatmap && renderHeatmap()}

                {/* --- Pitch Markings --- */}
                <g stroke="#c7d5cc" strokeWidth="0.5" fill="none" opacity="0.6">
                  {/* Outline */}
                  <rect x="0" y="0" width="120" height="80" />
                  {/* Halfway Line */}
                  <line x1="60" y1="0" x2="60" y2="80" />
                  {/* Center Circle */}
                  <circle cx="60" cy="40" r="9.15" />
                  {/* Center Spot */}
                  <circle cx="60" cy="40" r="0.5" fill="#c7d5cc" />
                  
                  {/* Left Penalty Area */}
                  <rect x="0" y="18" width="18" height="44" />
                  <rect x="0" y="30" width="6" height="20" />
                  <circle cx="12" cy="40" r="0.5" fill="#c7d5cc" />
                  <path d="M 18 32.7 A 9.15 9.15 0 0 1 18 47.3" />

                  {/* Right Penalty Area */}
                  <rect x="102" y="18" width="18" height="44" />
                  <rect x="114" y="30" width="6" height="20" />
                  <circle cx="108" cy="40" r="0.5" fill="#c7d5cc" />
                  <path d="M 102 32.7 A 9.15 9.15 0 0 0 102 47.3" />
                  
                  {/* Goals */}
                  <rect x="-2" y="36" width="2" height="8" strokeWidth="0.8" fill="#111" />
                  <rect x="120" y="36" width="2" height="8" strokeWidth="0.8" fill="#111" />
                </g>

                {/* Target Direction Indicators */}
                <g stroke="#ef4444" strokeWidth="0.2" opacity="0.4" strokeDasharray="1 1">
                  <line x1={position.x} y1={position.y} x2="120" y2="36" />
                  <line x1={position.x} y1={position.y} x2="120" y2="44" />
                </g>

                {/* The Player / Pin */}
                <circle 
                  cx={position.x} 
                  cy={position.y} 
                  r="1.5" 
                  fill="#3b82f6" 
                  stroke="white" 
                  strokeWidth="0.5" 
                  className="transition-all duration-200"
                />
                
                {/* Ping animation effect */}
                <circle 
                  cx={position.x} 
                  cy={position.y} 
                  r="3" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="0.5" 
                  className="animate-ping"
                  opacity="0.5"
                />
              </svg>
            </div>
            <p className="text-sm text-neutral-500 text-center mt-2">
              Click anywhere on the pitch to simulate player possession. Attacking from Left to Right.
            </p>
          </div>

          {/* Analytics Dashboard (Right Column) */}
          <div className="space-y-6">
            
            {/* Coordinates Input */}
            <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700 shadow-lg">
              <h3 className="text-sm uppercase tracking-wider text-neutral-400 font-semibold mb-4">Current Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">X Coordinate (0-120)</label>
                  <input 
                    type="number" 
                    value={position.x.toFixed(1)}
                    onChange={(e) => setPosition({...position, x: Number(e.target.value)})}
                    className="w-full bg-neutral-900 border border-neutral-600 rounded px-3 py-2 text-white font-mono"
                    max="120" min="0" step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Y Coordinate (0-80)</label>
                  <input 
                    type="number" 
                    value={position.y.toFixed(1)}
                    onChange={(e) => setPosition({...position, y: Number(e.target.value)})}
                    className="w-full bg-neutral-900 border border-neutral-600 rounded px-3 py-2 text-white font-mono"
                    max="80" min="0" step="0.5"
                  />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-between items-center text-sm">
                <span className="text-neutral-400">Mapped Grid Cell:</span>
                <span className="font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                  [{cellX}, {cellY}]
                </span>
              </div>
            </div>

            {/* Expected Threat (xT) Card */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-850 rounded-xl p-6 border border-neutral-700 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-sm uppercase tracking-wider text-neutral-400 font-semibold mb-1">Expected Threat (xT)</h3>
              <p className="text-xs text-neutral-500 mb-4">Value of possessing the ball in this zone.</p>
              
              <div className="flex items-end space-x-2">
                <span className="text-5xl font-bold text-orange-500 tracking-tighter">
                  {xTValue.toFixed(4)}
                </span>
              </div>
              
              <div className="mt-4 w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-600 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (xTValue / 0.25) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Expected Goals (xG) Card */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-850 rounded-xl p-6 border border-neutral-700 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <h3 className="text-sm uppercase tracking-wider text-neutral-400 font-semibold mb-1">Expected Goals (xG)</h3>
              <p className="text-xs text-neutral-500 mb-4">Probability of scoring if a shot is taken here.</p>
              
              <div className="flex items-end space-x-2">
                <span className="text-5xl font-bold text-emerald-400 tracking-tighter">
                  {xGValue.toFixed(3)}
                </span>
                <span className="text-neutral-500 font-medium mb-1">({(xGValue * 100).toFixed(1)}%)</span>
              </div>
              
              <div className="mt-4 w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-600 h-full transition-all duration-500"
                  style={{ width: `${xGValue * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}