

# ⚽ Football Analytics: xG & xT Models

This repository contains implementations of two widely used football analytics metrics:

* **Expected Goals (xG)** – estimates the probability of a shot resulting in a goal.
* **Expected Threat (xT)** – quantifies how valuable ball movements are in increasing the likelihood of scoring.

These models help evaluate **shot quality** and **possession value across the pitch** using event-based match data.

---

# 📊 Overview

Modern football analytics relies on probabilistic models to better understand team and player performance.

This project implements:

### Expected Goals (xG)

The **xG model** predicts the probability that a given shot will result in a goal based on factors such as:

* Shot location
* Distance to goal
* Shot angle
* Body part used
* Defensive pressure (if available)

Example:

| Shot               | xG   |
| ------------------ | ---- |
| Close range tap-in | 0.75 |
| Long range shot    | 0.03 |

---

### Expected Threat (xT)

The **xT model** evaluates the value of moving the ball to different areas of the pitch.

Instead of focusing only on shots, xT measures **how dangerous an action is**.

For example:

| Action                    | xT Value |
| ------------------------- | -------- |
| Pass from midfield to box | +0.12    |
| Back pass                 | -0.01    |

This helps evaluate players who **create danger without taking shots**.

---

# 🧠 Models Implemented

## 1. Expected Goals (xG)

Approach:

* Logistic Regression / Machine Learning classifier
* Predicts goal probability

Typical features used:

* Shot distance
* Shot angle
* Shot type
* Body part
* Game situation

Output:

```
xG ∈ [0,1]
```

---

## 2. Expected Threat (xT)

Approach:

* Divide pitch into grid cells
* Learn probability of:

  * scoring from a zone
  * moving to another zone
  * losing possession

Then compute **threat values for each zone**.

Reference methodology inspired by:

* Karun Singh's xT model

Output:

```
xT value per pitch zone
```
