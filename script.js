import { fetchLastModifiedDate, formatName } from "./src/projects.js";
import { is_admin } from "./src/admin.js";

function createProjectLink(folder, title, description, date, container=document.getElementById("projects-div"), state) {
    const link = document.createElement("a");
    if (state.refused === false) {
        link.href = `${folder}/index.html`;
    }
 
    if (state.building === false) {
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

        var projects = [];

        for (const item of items) {
            if (item.type === "dir") {
                projects.push(item);
            }
        }

        const { data: projectData, error } = await sb
            .from("CurrentProjects")
            .select("*")

        for (const project of projects) {
            project.db = projectData.find(p => p.project === project.name);
            if (!localStorage.getItem(`lastModified_${project.name}`) || Date.now() - localStorage.getItem(`cacheTime_${project.name}`) >= 60 * 60 * 1000) {
                await fetchLastModifiedDate(project.name);
            }
        }
        localStorage.setItem("projects", JSON.stringify(projects));
        localStorage.setItem("projectsCacheTime", Date.now());
    }
    projects.sort((a, b) => localStorage.getItem(`lastModified_${b.name}`) - localStorage.getItem(`lastModified_${a.name}`));
    for (const project of projects) {
        if (project.db.hidden === false && await is_admin("", project.db.admin) === true) {
            createProjectLink(
                project.name,
                project.db.title? project.db.title : formatName(project.name),
                project.db.building === false ? (project.db.description? project.db.description : "Ce projet n'a pas encore de description.") : "Ce projet est en cours de construction, revenez plus tard !",
                project.db.building === false ? localStorage.getItem(`lastModified_${project.name}`) : "À venir",
                container,
                project.db
            );
        }
    }

    nb_displayed_projects = document.querySelectorAll(".project-site").length;
    document.getElementById("projects-count").textContent =
        nb_displayed_projects > 0
        ? `📂 ${nb_displayed_projects} projets disponibles`
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

window.topFunction = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}