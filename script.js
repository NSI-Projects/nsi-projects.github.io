function formatName(name) {
return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function createProjectLink(folder, title, description, container=document.getElementById("projects-div")) {
    const link = document.createElement("a");
    link.href = `${folder}/index.html`;
    link.classList.add("project-link", "project-site");

    link.innerHTML = `
        🔗 <strong>${title}</strong>
        <div class="project-desc">${description}</div>
    `;

    container.appendChild(link);
}

function loadProject(folderName) {
    const readmeUrl = `https://api.github.com/repos/NSI-Projects/nsi-projects.github.io/contents/${folderName}/README.md`;

    fetch(readmeUrl)
    .then(res => {
        if (!res.ok) throw new Error("Pas de README");
            return res.json();
    })
    .then(data => {
        const content = atob(data.content);
        const lines = content.split("\n");

        const title = lines[0].replace(/^#\s*/, "").trim();
        const description = lines.slice(2).join(" ").trim();

        createProjectLink(folderName, title, description);
    })
    .catch(() => {
        createProjectLink(folderName, folderName, "");
    });
}

window.addEventListener("DOMContentLoaded", () => {
    fetch(`https://api.github.com/repos/NSI-Projects/nsi-projects.github.io/contents/`)
    .then(res => res.json())
    .then(items => {
        items
        .filter(item => item.type === "dir")
        .forEach(item => loadProject(item.name));
        document.getElementById("projects-count").textContent = items.filter(item => item.type === "dir").length > 0
            ? `📂 ${items.filter(item => item.type === "dir").length} projets disponibles` 
            : "❌ Aucun projet trouvé.";
    });
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