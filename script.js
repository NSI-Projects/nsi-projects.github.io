function formatName(name) {
    return "🔗 " + name
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

function fetchLastModifiedDate(folderName) {
    const url = `https://api.github.com/repos/NSI-Projects/nsi-projects.github.io/commits?path=${folderName}&per_page=1`;

    return fetch(url)
        .then(res => res.ok ? res.json() : [])
        .then(commits => {
            localStorage.setItem(`lastModified_${folderName}`, JSON.stringify(commits[0]?.commit.author.date || null));
            localStorage.setItem(`cacheTime_lastModified_${folderName}`, Date.now());
            if (commits.length === 0) return null;
            return new Date(commits[0].commit.author.date);
    });
}

function fetchReadme(folderName) {
    const url = `https://api.github.com/repos/NSI-Projects/nsi-projects.github.io/contents/${folderName}/readme.md`;

    return fetch(url)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
        if (!data) return null;

        const content = decodeURIComponent(
            escape(atob(data.content))
        );

        const lines = content.split("\n");

        localStorage.setItem(`readme_${folderName}`, JSON.stringify({
            title: lines[0]?.replace(/^#\s*/, "").trim() || formatName(folderName),
            description: lines.slice(2).join(" ").trim()
        }));
        localStorage.setItem(`cacheTime_readme_${folderName}`, Date.now());
        
        return {
            title: lines[0]?.replace(/^#\s*/, "").trim() || formatName(folderName),
            description: lines.slice(2).join(" ").trim()
        };
    });
}

async function loadProjectData(folderName) {
    const [readmeData, lastModified] = await Promise.all([
        () => {
            if (localStorage.getItem(`readme_${folderName}`) && Date.now() - localStorage.getItem(`cacheTime_readme_${folderName}`) < 60 * 60 * 1000) {
                return JSON.parse(localStorage.getItem(`readme_${folderName}`));
            } else {
                return fetchReadme(folderName);
            }
        },
        () => {
            if (localStorage.getItem(`lastModified_${folderName}`) && Date.now() - localStorage.getItem(`cacheTime_lastModified_${folderName}`) < 60 * 60 * 1000) {
                const dateStr = localStorage.getItem(`lastModified_${folderName}`);
                return dateStr ? new Date(dateStr) : null;
            } else {
                return fetchLastModifiedDate(folderName);
            }
        }
    ]);

    return {
        folder: folderName,
        title: readmeData?.title || formatName(folderName),
        description: readmeData?.description || "",
        lastModified
    };
}

function createProjectLink(folder, title, description, date, container=document.getElementById("projects-div")) {
    const link = document.createElement("a");
    link.href = `${folder}/index.html`;
    link.classList.add("project-link", "project-site");

    const formattedDate = date
        ? `🕒 Modifié le ${date.toLocaleDateString("fr-FR")} à ${date.getHours()}h${String(date.getMinutes()).padStart(2,'0')}`
        : "";

    link.innerHTML = `
        <div class="project-title">${title}</div>
        <div class="project-desc">${description}</div>
        <div class="project-date">${formattedDate}</div>
    `;

    container.appendChild(link);
}

window.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("projects-div");

    const res = await fetch(`https://api.github.com/repos/NSI-Projects/nsi-projects.github.io/contents/`);
    const items = await res.json();

    const folders = items.filter(item => item.type === "dir");

    document.getElementById("projects-count").textContent =
        folders.length > 0
        ? `📂 ${folders.length} projets disponibles`
        : "❌ Aucun projet trouvé.";

    const projects = await Promise.all(
        folders.map(folder => loadProjectData(folder.name))
    );

    projects.sort((a, b) => b.lastModified - a.lastModified);
    projects.forEach(project => {
        createProjectLink(
        project.folder,
        project.title,
        project.description,
        project.lastModified,
        container
        );
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