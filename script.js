window.addEventListener("DOMContentLoaded", () => {
    const projects = document.querySelectorAll(".project-site");
    const countDiv = document.getElementById("projects-count");
    countDiv.textContent = projects.length > 0 
        ? `📂 ${projects.length} projets disponibles` 
        : "❌ Aucun projet trouvé.";
});
let mybutton = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    mybutton.classList.add("show");
} else {
    mybutton.classList.remove("show");
}
});
function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
    if (
        (e.ctrlKey && e.key.toLowerCase() === "u") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        (e.key === "F12") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j")
    ) {
        e.preventDefault();
    }
});