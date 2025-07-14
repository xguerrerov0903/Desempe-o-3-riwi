// Main script to handle SPA routing and logic.

const routes = {
  "/": "/events.html",
  "/login": "/login.html",
  "/register": "/register.html",
  "/events": "/events.html",
  "/enrollsment": "/enrollsment.html",
  "/events/create": "/events/create.html",
};

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  } else if (e.target.tagName !== "BUTTON") {
    console.log("hi");
    const action = e.target.value;
    if (action == "logOut") {
      console.log("Boton");
      handleLogout();
    }
  }
});

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
  console.log("h");
  // Perform logout actions here. For example:
  // 1. Clear session data (e.g., localStorage, cookies)
  // 2. Redirect to the login page
  localStorage.removeItem("user"); // Example: Removing a token
  window.location.href = "/login"; // Redirect to login page
});

async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  const user = JSON.parse(localStorage.getItem("user"));

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
      import("./js/login.js").then((module) => module.initLogin());
    }
  

  if (pathname === "/register") {
    if (user) {
      alert("You already register");
      return navigate("/events");
    }
    import("./js/register.js").then((module) => module.initRegister());
  }

  if (pathname === "/enrollsment") {
    if (user.admin) {
      alert("Only users can see this section");
      return navigate("/events");
    } else if (!user) {
      alert("Only users can see this section");
      return navigate("/login");
    }
    import("./js/enrollsment.js");
  }

  if (pathname === "/events/create") {
    if (!user.admin) {
      alert("Only admins can see this section");
      return navigate("/events");
    }
    import("./js/create.js");
  }
}

window.addEventListener("popstate", () => navigate(location.pathname));

document.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});

function handleLogout() {
  localStorage.removeItem("user");
  location.reload();
}
