Health Dashboard – Front-End Skills Test

This project is a front-end implementation of a medical dashboard converted from an Adobe XD design into a responsive HTML/CSS/JavaScript webpage.
It dynamically loads patient data through an API and visualizes blood pressure trends using Chart.js.

This project was built as part of a front-end skills test, focused on clean UI, responsive layout, API usage, and JavaScript data rendering.

🚀 Features
✔ Fully responsive layout

Using CSS Flexbox and clean class-based structure.

✔ Live API data

JavaScript fetches real patient data from the Coalition Technologies REST API.

✔ Dynamic content rendering

JS updates:

Patient profile

Vitals (respiratory rate, temperature, heart rate)

Diagnosis history chart

Diagnostic table

Lab results

✔ Chart.js Integration

Displays a line chart of systolic & diastolic blood pressure values.

✔ Clean, modular code

Organized in:

index.html

style.css

script.js

Tech Stack
Technology	Use
HTML5	Structure & semantic layout
CSS3 (Flexbox)	Styling, responsiveness
JavaScript (ES6+)	Fetch API, dynamic DOM updates
Chart.js	Data visualization
REST API	Patient data retrieval
📂 Project Structure
/project-folder
│── index.html         # Main HTML structure
│── style.css          # All styling
│── script.js          # API fetch + dynamic UI + chart logic
└── README.md          # Project documentation

🔌 How to Run Locally
1. Clone or download the project
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git

2. Open the project in VS Code
3. Start a Live Server

If using VS Code:

Right-click index.html

Click "Open with Live Server"

4. Add your API credentials

Create a file named:

config.js


Inside it, add:

export const API_USERNAME = "your-username";
export const API_PASSWORD = "your-password";


Then ensure this file is ignored:

# .gitignore
config.js

📊 Data Source

Patient data is fetched from the Coalition Technologies API and processed using:

fetch(API_URL, { headers: { Authorization: "Basic <token>" } })