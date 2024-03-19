document.addEventListener("DOMContentLoaded", function () {
  const allSideMenu = document.querySelectorAll("#sidebar .side_menu.top li a");
  const menuBar = document.querySelector("#top_menu nav .bx.bx-menu");
  const sidebar = document.getElementById("sidebar");
  const windowLayout = document.getElementById("window_layout"); // Changed from "window"
  const searchButton = document.querySelector(
    "#top_menu nav form .form-input button"
  );
  const searchButtonIcon = searchButton.querySelector(".bx");
  const searchForm = document.querySelector("#top_menu nav form");
  const switchMode = document.getElementById("switch-mode");

  //   sidebar.classList.add("active");

  function setActiveLink() {
    const currentPath = window.location.pathname;

    allSideMenu.forEach((item) => {
      const linkPath = item.getAttribute("href");
      item.parentElement.classList.toggle("active", currentPath === linkPath);
    });
  }

  allSideMenu.forEach((item) => {
    item.addEventListener("click", function () {
      allSideMenu.forEach((i) => i.parentElement.classList.remove("active"));
      item.parentElement.classList.add("active");
      console.log("Clicked Item:", item.textContent);
    });
  });

  setActiveLink();

  menuBar.addEventListener("click", function () {
    console.log("Menu bar clicked");
    sidebar.classList.toggle("hide");
    windowLayout.classList.toggle(
      "window-closed",
      sidebar.classList.contains("hide")
    );
  });

  searchButton.addEventListener("click", function (e) {
    if (window.innerWidth < 576) {
      e.preventDefault();
      searchForm.classList.toggle("show");
      searchButtonIcon.classList.replace(
        "bx-search",
        searchForm.classList.contains("show") ? "bx-x" : "bx-search"
      );
    }
  });

  function updateResponsiveLayout() {
    const shouldHideSidebar = window.innerWidth > 768;
    sidebar.classList.toggle("hide", shouldHideSidebar);
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");

    if (shouldHideSidebar) {
      sidebar.classList.add("hide");
      windowLayout.classList.toggle(
        "window-closed",
        sidebar.classList.contains("hide")
      );
    } else if (window.innerWidth > 576) {
      sidebar.classList.remove("hide");
    }
  }

  window.addEventListener("resize", updateResponsiveLayout);

  const storedTheme = localStorage.getItem("theme");

  if (storedTheme) {
    document.body.classList.add(storedTheme);
    switchMode.checked = storedTheme === "dark";
  }

  switchMode.addEventListener("change", function () {
    const theme = this.checked ? "dark" : "light";
    document.body.classList.toggle("dark", this.checked);
    localStorage.setItem("theme", theme);
  });

  //   updateResponsiveLayout();
});
