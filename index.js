// Main script to handle SPA routing and logic.

// Define the routes for the application
const routes = {
  "/": "/events.html",
  "/login": "/login.html",
  "/register": "/register.html",
  "/events": "/events.html",
  "/enrollsment": "/enrollsment.html",
  "/events/create": "/events/create.html",
};

// Function to handle navigation and load the appropriate content
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  } 
});

// Handle logout button click
const logoutButton = document.getElementById("logoutButton");

// Event listener of the logout button
logoutButton.addEventListener("click", function () {
  // Clear user data from localStorage and redirect to login page
  localStorage.removeItem("user"); 
  window.location.href = "/login"; 
});


// Function to navigate to a specific path and load the corresponding content
async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  const user = JSON.parse(localStorage.getItem("user"));

  import("./js/login.js").then((module) => {
    module.controlPermissions(user);
    module.showUserName(user);
  });

  // The views are protected by the user permissions
  if (pathname === "/" || pathname === "/events") {
    if (!user) {
      alert("Only users can see this section");
      return navigate("/login");
    }
    import("./js/events.js").then((module) => {
      module.loadEvents();
    });
  }


    if (pathname === "/login") {
      if (user) {
        alert("You already log in");
        return navigate("/events");
      }
      import("./js/login.js").then((module) => 
        module.initLogin());
    }
  

  if (pathname === "/register") {
    if (user) {
      alert("You already register");
      return navigate("/events");
    }
    import("./js/create.js");
  }

  if (pathname === "/enrollsment") {
    if (user.admin) {
      alert("Only users can see this section");
      return navigate("/events");
    } else if (!user) {
      alert("Only users can see this section");
      return navigate("/login");
    }
    import("./js/enrollsment.js").then((module) => 
      module.loadMyEvents());
  }

  if (pathname === "/events/create") {
    if (!user.admin) {
      alert("Only admins can see this section");
      return navigate("/events");
    }
    import("./js/create.js");
  }
}

// Handle back/forward navigation
window.addEventListener("popstate", () => navigate(location.pathname));

document.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});


