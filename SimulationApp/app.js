import React, { useState, useRef } from "react";
import "./styles.css";

const calculateMockXG = (x, y) => {
  const distToGoal = Math.hypot(120 - x, 40 - y);

  if (x < 60) return 0.0;

  let xg = 0.9 * Math.exp(-distToGoal / 12);

  const anglePenalty = Math.abs(40 - y) / 40;
  xg = xg * (1 - anglePenalty * 0.5);

  return Math.max(0, Math.min(0.99, xg));
};

const calculateMockXT = (cellX, cellY) => {
  const xFactor = Math.pow(cellX / 15, 3);

  const yDistance = Math.abs(5.5 - cellY);
  const yFactor = 1 - yDistance / 10;

  const baseXT = xFactor * 0.25 * yFactor;

  return Math.max(0.001, baseXT);
};

export default function App() {
  const pitchRef = useRef(null);

  const [position, setPosition] = useState({ x: 95, y: 40 });
  const [showHeatmap, setShowHeatmap] = useState(false);

  const cellX = Math.min(Math.floor(position.x / 7.5), 15);
  const cellY = Math.min(Math.floor(position.y / 6.666), 11);

  const xTValue = calculateMockXT(cellX, cellY);
  const xGValue = calculateMockXG(position.x, position.y);

  const handlePitchClick = (e) => {
    const rect = pitchRef.current.getBoundingClientRect();

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const realX = (clickX / rect.width) * 120;
    const realY = (clickY / rect.height) * 80;

    setPosition({
      x: Math.max(0, Math.min(120, realX)),
      y: Math.max(0, Math.min(80, realY)),
    });
  };

  const renderHeatmap = () => {
    const squares = [];

    for (let cx = 0; cx < 16; cx++) {
      for (let cy = 0; cy < 12; cy++) {
        const xt = calculateMockXT(cx, cy);
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
            className="heat-square"
          />
        );
      }
    }

    return squares;
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Football Analytics Engine</h1>
          <p>Interactive Expected Goals (xG) & Expected Threat (xT)</p>
        </header>

        <div className="grid">
          <div className="pitch-section">
            <div className="pitch-header">
              <h2>Interactive Pitch (120x80)</h2>

              <button
                className="toggle-btn"
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                {showHeatmap ? "Hide xT Grid" : "Show xT Grid"}
              </button>
            </div>

            <div className="pitch-container">
              <svg
                ref={pitchRef}
                viewBox="0 0 120 80"
                className="pitch-svg"
                onClick={handlePitchClick}
              >
                {showHeatmap && renderHeatmap()}

                {/* Pitch Lines */}
                <g className="pitch-lines">
                  <rect x="0" y="0" width="120" height="80" />
                  <line x1="60" y1="0" x2="60" y2="80" />
                  <circle cx="60" cy="40" r="9.15" />
                  <circle cx="60" cy="40" r="0.5" className="pitch-fill" />

                  <rect x="0" y="18" width="18" height="44" />
                  <rect x="0" y="30" width="6" height="20" />
                  <circle cx="12" cy="40" r="0.5" className="pitch-fill" />

                  <rect x="102" y="18" width="18" height="44" />
                  <rect x="114" y="30" width="6" height="20" />
                  <circle cx="108" cy="40" r="0.5" className="pitch-fill" />
                </g>

                {/* Goal Posts */}
                <rect
                  x="-2"
                  y="36"
                  width="2"
                  height="8"
                  className="goal-post"
                />
                <rect
                  x="120"
                  y="36"
                  width="2"
                  height="8"
                  className="goal-post"
                />

                {/* Sight Triangle Lines */}
                <g className="shot-lines">
                  <line x1={position.x} y1={position.y} x2="120" y2="36" />
                  <line x1={position.x} y1={position.y} x2="120" y2="44" />
                </g>

                {/* Player Marker */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="1.5"
                  className="player-dot"
                />
              </svg>
            </div>

            <p className="pitch-note">
              Click anywhere on the pitch to simulate possession.
            </p>
          </div>

          {/* Dashboard */}

          <div className="dashboard">
            <div className="card">
              <h3>Current Location</h3>

              <div className="coord-grid">
                <input
                  type="number"
                  value={position.x.toFixed(1)}
                  onChange={(e) =>
                    setPosition({ ...position, x: Number(e.target.value) })
                  }
                />

                <input
                  type="number"
                  value={position.y.toFixed(1)}
                  onChange={(e) =>
                    setPosition({ ...position, y: Number(e.target.value) })
                  }
                />
              </div>

              <p className="cell-display">
                Grid Cell: [{cellX}, {cellY}]
              </p>
            </div>

            <div className="card xt">
              <h3>Expected Threat (xT)</h3>
              <h1>{xTValue.toFixed(4)}</h1>
            </div>

            <div className="card xg">
              <h3>Expected Goals (xG)</h3>
              <h1>{xGValue.toFixed(3)}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
