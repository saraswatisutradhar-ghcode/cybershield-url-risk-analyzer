# CYBERSHIELD — Phishing URL Risk Analyzer

CYBERSHIELD is a lightweight, browser-based cybersecurity project that analyzes URLs using rule-based heuristics to identify patterns commonly associated with suspicious links.

## Features

- **URL analysis:** Accepts URLs and evaluates their structure.
- **Risk scoring:** Assigns an illustrative risk score based on detected patterns.
- **Security indicators:** Highlights suspicious characteristics such as non-HTTPS connections, IP-address hostnames, unusually long URLs, and potentially deceptive keywords.
- **Risk classification:** Categorizes analyzed URLs as low, medium, or high risk.
- **Analysis history:** Displays recent analyses during the current browser session.
- **Input validation:** Handles invalid and incomplete URL inputs.
- **Responsive interface:** Provides a dark-themed interface for desktop and mobile screens.

## Technologies Used

- HTML5
- CSS3
- JavaScript

## How to Run

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.
4. Enter a URL and select **Analyze URL** to view the results.

## How It Works

CYBERSHIELD parses the submitted URL and checks for predefined patterns associated with suspicious links. Each detected indicator contributes to a rule-based score, which is then mapped to a risk category.

The analyzer processes the URL locally in the browser. It does not visit the submitted website or query an external threat-intelligence service.

## Limitations

- Risk scores are heuristic estimates, not probabilities that a URL is malicious.
- Legitimate URLs may be flagged, and sophisticated phishing URLs may go undetected.
- The project does not use machine learning or live threat-intelligence feeds.
- Analysis history is temporary and is not persisted after the browser session is refreshed.

**Important:** A low-risk result does not guarantee that a URL is safe. Avoid opening suspicious links just to test them.

## Future Improvements

- Integrate a trusted URL reputation or threat-intelligence API.
- Add automated test cases for URL parsing and risk-scoring rules.
- Improve detection rules and explain how each indicator contributes to the score.

## Project Type

Educational cybersecurity prototype for learning URL analysis, heuristic risk scoring, and phishing awareness.