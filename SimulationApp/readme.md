# Football Analytics Engine (xG + xT Demo)

This project is an **interactive football analytics visualization built with React**.
It allows users to click anywhere on a football pitch and see:

* **Expected Goals (xG)** – probability of scoring from that location
* **Expected Threat (xT)** – value of possessing the ball in that zone
* **Shot sight triangle** from the ball to the goal posts
* Optional **xT heatmap grid**

---

# Project Files

You only need two custom files:

```text
App.js
styles.css
```

These files should be placed inside the **src** folder of a React project.

Project structure:

```text
my-react-app
 ├── node_modules
 ├── public
 ├── src
 │   ├── App.js
 │   ├── styles.css
 │   └── index.js
 ├── package.json
```

---

# Requirements

Make sure you have:

* **Node.js** installed
* **npm** installed

Check with:

```bash
node -v
npm -v
```

---

# Step 1 — Create a React App

Open a terminal and run:

```bash
npx create-react-app football-analytics
```

Then move into the project folder:

```bash
cd football-analytics
```

---

# Step 2 — Add the Provided Files

Inside the **src** folder:

1. Delete the default `App.js`
2. Create a new file called:

```text
App.js
```

Paste the provided **App.js code** into this file.

3. Create another file called:

```text
styles.css
```

Paste the provided **styles.css code** into this file.

Your **src** folder should now look like:

```text
src
 ├── App.js
 ├── styles.css
 └── index.js
```

---

# Step 3 — Import the CSS File

Inside **App.js**, make sure this line exists at the top:

```javascript
import "./styles.css";
```

This allows React to apply the styles to the application.

---

# Step 4 — Check index.js

Your `index.js` file should render the React app like this:

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

# Step 5 — Run the Application

Start the React development server:

```bash
npm start
```

After a few seconds, the browser will open automatically at:

```text
http://localhost:3000
```

You should now see the **Football Analytics Engine dashboard**.

---

# How to Use the App

### Move the Ball

Click anywhere on the pitch.

The ball will move to that position.

### Coordinate System

The pitch uses a **120 × 80 coordinate system**:

```text
X axis: 0 → 120  (left to right)
Y axis: 0 → 80   (top to bottom)
```

### Expected Goals (xG)

Shows the **probability of scoring if a shot is taken from that location**.

Example:

```text
xG = 0.30 → 30% chance of scoring
```

### Expected Threat (xT)

Shows how valuable that position is for creating a goal later in the attack.

Higher values mean the position is **more dangerous for the opponent**.

### xT Heatmap

Press **"Show xT Grid"** to display the threat map across the pitch.

### Shot Sight Triangle

Two lines connect the ball to the **goal posts**, forming a triangle that represents the **shooting angle**.

---

# What This Project Demonstrates

This small React app demonstrates concepts used in **football data science**, including:

* spatial analytics
* expected goals modelling
* expected threat modelling
* pitch visualizations
* interactive sports analytics dashboards
