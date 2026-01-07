import { fetchLastModifiedDate, fetchReadme, formatName, check_status } from "./src/projects.js";

async function loadProjectData(folderName, state) {
    var [readmeData, lastModified] = await Promise.all([
        (localStorage.getItem(`readme_${folderName}`) && Date.now() - localStorage.getItem(`cacheTime_${folderName}`) < 60 * 60 * 1000)
            ? Promise.resolve(JSON.parse(localStorage.getItem(`readme_${folderName}`)))
            : fetchReadme(folderName),

        (localStorage.getItem(`lastModified_${folderName}`) && Date.now() - localStorage.getItem(`cacheTime_${folderName}`) < 60 * 60 * 1000)
            ? Promise.resolve(new Date(localStorage.getItem(`lastModified_${folderName}`)))
            : fetchLastModifiedDate(folderName)
    ]);

    return {
        folder: folderName,
        title: readmeData?.title? readmeData.title : formatName(folderName),
        description: readmeData?.description? readmeData.description : "",
        lastModified: lastModified,
        state: state
    };
}

function createProjectLink(folder, title, description, date, container=document.getElementById("projects-div"), state) {
    const link = document.createElement("a");
    if (state.building === false) {
        link.href = `${folder}/index.html`;

        if (typeof date === "string") {
            date = new Date(date);
        }

        var formattedDate = date
        ? `🕒 Modifié le ${date.toLocaleDateString("fr-FR")} à ${date.getHours()}h${String(date.getMinutes()).padStart(2,'0')}`
        : "";
    } else {
        var formattedDate = `🕒 ${date}`;
    }
    link.classList.add("project-link", "project-site");
    if (state.building === true) {
        link.classList.add("project-building");
        link.addEventListener("click", () => {
            link.classList.add("click");
            setTimeout(() => link.classList.remove("click"), 600);
        })
    }

    if (state.beta === true) {
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
    if (localStorage.getItem("projects") && Date.now() - localStorage.getItem("projectsCacheTime") < 2 * 60 * 1000) {
        var projects = JSON.parse(localStorage.getItem("projects"));
        var nb_displayed_projects = localStorage.getItem("projectsNumber");
    } else {
        var nb_displayed_projects = 0
        var container = document.getElementById("projects-div");

        const res = await fetch(`https://api.github.com/repos/NSI-Projects/nsi-projects.github.io/contents/`);
        const items = await res.json();

        const folders = [];

        for (const item of items) {
            if (item.type !== "dir") continue;

            item.state = await check_status(item.name);
            folders.push(item);
        }

        folders.forEach(folder => {
            if (folder.state.hidden === false) nb_displayed_projects += 1;
        })

        var projects = await Promise.all(
            folders.map(folder => loadProjectData(folder.name, folder.state))
        );

        localStorage.setItem("projects", JSON.stringify(projects));
        localStorage.setItem("projectsNumber", nb_displayed_projects);
        localStorage.setItem("projectsCacheTime", Date.now());
    }

    document.getElementById("projects-count").textContent =
        nb_displayed_projects > 0
        ? `📂 ${nb_displayed_projects} projets disponibles`
        : "❌ Aucun projet trouvé.";

    projects.sort((a, b) => b.lastModified - a.lastModified);
    projects.forEach(project => {
        if (project.state.hidden === false) {
            createProjectLink(
                project.folder,
                project.title,
                project.state.building === false ? project.description : "Ce projet est en cours de construction, revenez plus tard !",
                project.state.building === false ? project.lastModified : "À venir",
                container,
                project.state
            );
        }
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