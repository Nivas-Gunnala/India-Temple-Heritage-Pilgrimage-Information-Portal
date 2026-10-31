// Shared small-screen navigation for the standalone editorial pages.
const pageMenu = document.querySelector(".menu-toggle");
const pageNav = document.querySelector(".main-nav");
if (pageMenu && pageNav) {
  pageMenu.addEventListener("click", () => {
    const open = pageNav.classList.toggle("open");
    pageMenu.setAttribute("aria-expanded", String(open));
    pageMenu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  pageNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    pageNav.classList.remove("open");
    pageMenu.setAttribute("aria-expanded", "false");
  }));
}
