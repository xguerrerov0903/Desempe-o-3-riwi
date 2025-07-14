# Performance test 3

This project is a **Single Page Application (SPA)** developed for the administration of events. It uses 'Vite' as a modern bundler, 'JSON Server' as a simulated backend and is written mainly in HTML, CSS and JavaScript.

## 📁 Project Structure

```
Performance test 3/
├──css/   # CSS Styles
├──js/   # JS modules organized by functionality
├──public/   # Static HTML pages
  └── event/ # Creation events page
├──index.html   # Home page
├──script.js   # SPA main script
├──db.json   # Fake database for JSON Server
├──server.js   # Backend server with JSON Server and CORS
├──package.json   # Project configuration and dependencies
└──. gitignore   # Files ignored by Git
```

## 🚀 Features

- Panel-type administration interface.
- Management of events.
- Enrollments of events fro users.
- SPA with routes managed from the frontend.
- Simulated authentication.
- Simulated backend with 'json-server'.
- Modern style with lateral dashboard structure and responsive.

## 🛠️ Installation

1. Clone the repository or unzip this file.
   
3. Install dependencies:

`bash
npm install
`

3. Run the backend server:

`bash
npx json-server --watch db.json --port 3000
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

- The 'db.json' file contains simulated data (users, events and enrolls.).
- The login is based on simulated validation from the frontend.
- Navigation is controlled by JavaScript, without reloading the page.

## 🧪 Test

### Admin user
- Email: x@email.com
- Password: 123

### Normal user
- Email: p@email.com
- Password: 123

## 📌 Author 

Name: Ximena Guerrero Villa
Clan: Lovelace
Email: xguerrerov0903@gmail.com
ID: 1000896809
