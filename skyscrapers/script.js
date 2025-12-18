slider = document.getElementById("size");

slider.addEventListener("input", () => {
    document.getElementById("generate").textContent = "Générer la grille : " + slider.value + "x" + slider.value;
});

document.getElementById("generate").addEventListener("click", () => {
    btn = document.getElementById("generate");
    btn.textContent = "Génération en cours ...";
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = "Générer la grille : " + slider.value + "x" + slider.value;
        btn.disabled = false;
    }, 2000);
});

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