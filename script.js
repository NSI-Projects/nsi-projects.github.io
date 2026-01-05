import { fetchLastModifiedDate, fetchReadme, formatName, check_status } from "./src/projects.js";

async function loadProjectData(folderName, state) {
    if (state === "normal" ||state === "beta") {
        var [readmeData, lastModified] = await Promise.all([
            (localStorage.getItem(`readme_${folderName}`) && Date.now() - localStorage.getItem(`cacheTime_${folderName}`) < 60 * 60 * 1000)
                ? Promise.resolve(JSON.parse(localStorage.getItem(`readme_${folderName}`)))
                : fetchReadme(folderName),

            (localStorage.getItem(`lastModified_${folderName}`) && Date.now() - localStorage.getItem(`cacheTime_${folderName}`) < 60 * 60 * 1000)
                ? Promise.resolve(new Date(localStorage.getItem(`lastModified_${folderName}`)))
                : fetchLastModifiedDate(folderName)
        ]);
    } else if (state === "building") {
        var readmeData = {
            description: "Ce projet est en cours de construction, revenez plus tard !"
        };
        var lastModified = "À venir";
    }

    return {
        folder: folderName,
        title: readmeData.title? readmeData.title : formatName(folderName),
        description: readmeData.description? readmeData.description : "",
        lastModified: lastModified
    };
}

function createProjectLink(folder, title, description, date, container=document.getElementById("projects-div"), state) {
    const link = document.createElement("a");
    if (state === "normal" || state === "beta") {
        link.href = `${folder}/index.html`;
        var formattedDate = date
        ? `🕒 Modifié le ${date.toLocaleDateString("fr-FR")} à ${date.getHours()}h${String(date.getMinutes()).padStart(2,'0')}`
        : "";
    } else {
        var formattedDate = `🕒 ${date}`;
    }
    link.classList.add("project-link", "project-site");
    if (state === "building") {
        link.classList.add("project-building");
        link.addEventListener("click", () => {
            link.classList.add("click");
            setTimeout(() => link.classList.remove("click"), 600);
        })
    }

    if (state === "beta") {
        link.classList.add("project-beta");
        description += " <span style='color: #f00;'>Attention, ce projet est en beta, il peut contenir des bugs. Si vous en trouvez, vous pouvez les signaler en envoyant un mail à cette adresse : nsi.projects.contact@gmail.com<span>";
    }

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

    const folders = [];
    const building = [];
    const beta = [];

    for (const item of items) {
        if (item.type !== "dir") continue;

        const status = await check_status(item.name);
        if (status === "hidden") {
            continue;
        } else if (status === "building") {
            building.push(item);
        } else if (status === "beta") {
            beta.push(item);
        } else {
            folders.push(item);
        }
    }

    document.getElementById("projects-count").textContent =
        folders.length + building.length + beta.length > 0
        ? `📂 ${folders.length + building.length + beta.length} projets disponibles`
        : "❌ Aucun projet trouvé.";

    const projects = await Promise.all(
        folders.map(folder => loadProjectData(folder.name, "normal"))
    );

    const buildingProjects = await Promise.all(
        building.map(folder => loadProjectData(folder.name, "building"))
    )

    const betaProjects = await Promise.all(
        beta.map(folder => loadProjectData(folder.name, "beta"))
    )

    projects.sort((a, b) => b.lastModified - a.lastModified);
    projects.forEach(project => {
        createProjectLink(
            project.folder,
            project.title,
            project.description,
            project.lastModified,
            container,
            "normal"
        );
    });

    buildingProjects.forEach(project => {
        createProjectLink(
            project.folder,
            project.title,
            project.description,
            project.lastModified,
            container,
            "building"
        );
    });

    betaProjects.sort((a, b) => b.lastModified - a.lastModified);
    betaProjects.forEach(project => {
        createProjectLink(
            project.folder,
            project.title,
            project.description,
            project.lastModified,
            container,
            "beta"
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

window.topFunction = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}