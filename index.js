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
    import("./js/login.js");
  }

  if (pathname === "/register") {
    if (user) {
      alert("You already register");
      return navigate("/events");
    }
    import("./js/register.js");
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
    if (!user.admin){
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
