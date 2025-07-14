# Performance test 3

This project is a **Single Page Application (SPA)** developed for the administration of events. It uses 'Vite' as a modern bundler, 'JSON Server' as a simulated backend and is written mainly in HTML, CSS and JavaScript.

## 📁 Project Structure

`
Performance test 3/
css/   # CSS Styles
js/   # JS modules organized by functionality
public/   # Static HTML pages
index.html   # Home page
script.js   # SPA main script
db.json   # Fake database for JSON Server
server.js   # Backend server with JSON Server and CORS
package.json   # Project configuration and dependencies
. gitignore   # Files ignored by Git
`

## 🚀 Features

- Panel-type administration interface.
- Management of users and courses.
-SPA with routes managed from the frontend.
- Simulated authentication.
- Simulated backend with 'json-server'.
- Modern style with lateral dashboard structure.

## 🛠️ Installation

1. Clone the repository or unzip this file.
2. Install dependencies:

`bash
npm install
`

3. Run the backend server:

`bash
node server.js
`

4. On another terminal, start the development environment:

`bash
npm run dev
`

5. Open the application in your browser at http://localhost:5173.

## 🧪 Dependencies

- [Vite](https://vitejs.dev/)
- [JSON Server](https://github.com/typicode/json-server)
- [CORS](https://www.npmjs.com/package/cors)

## 📄 Notes

- The 'db.json' file contains simulated data (users, courses, etc.).
- The login is based on simulated validation from the frontend.
- Navigation is controlled by JavaScript, without reloading the page.

## 📌 Author and Repository

Original repository: [https://github.com/Crismiau/Reto-SPA](https://github.com/Crismiau/Reto-SPA)
