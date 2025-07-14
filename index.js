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
  }
});

async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  const user = JSON.parse(localStorage.getItem("user"));

  if (pathname === "/" || pathname === "/events") {
    import("./js/events.js").then(module => {
      module.loadEvents();
    });
  }

  

  if (pathname === "/login") {
    import("./js/login.js");

  }

  if (pathname === "/register") {

  }

  if (pathname === "/enrollsment") {

  }

  if (pathname === "/events/create") {

  }
}


window.addEventListener("popstate", () => navigate(location.pathname));

document.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});

