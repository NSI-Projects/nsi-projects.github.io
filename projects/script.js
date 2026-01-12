import { is_admin } from "../src/admin.js";
import { fetchLastModifiedDate, formatName } from "../src/projects.js";

let projects = [];

async function display_info(project) {
    document.getElementById("error").textContent = "Chargement des informations du projet...";
    document.getElementById("error").style.color = "white";

    document.getElementById("project-id").innerHTML = "chargement...";
    document.getElementById("project-desc").textContent = "chargement...";
    document.getElementById("project-created-at").textContent = "chargement...";
    document.getElementById("project-raw-name").textContent = "chargement...";
    document.getElementById("security-level-loading").textContent = "chargement...";

    document.getElementById("beta").classList.remove("active");
    document.getElementById("building").classList.remove("active");
    document.getElementById("hidden").classList.remove("active");
    document.getElementById("beta").disabled = true;
    document.getElementById("building").disabled = true;
    document.getElementById("hidden").disabled = true;
    document.getElementById("security-level").style.display = "none";

    document.getElementById("project-id").innerHTML = "<span style=\"color: #d1ffe7ff;\">" + project.title? project.title : formatName(project.project) + "</span>";
    document.getElementById("project-desc").textContent = project.building === false ? (project.description? project.description : "Ce projet n'a pas encore de description.") : "Ce projet est en cours de construction, revenez plus tard !";
    document.getElementById("project-created-at").textContent = project.building === false ? (localStorage.getItem(`lastModified_${project.project}`)? new Date(localStorage.getItem(`lastModified_${project.project}`)).toLocaleString("fr-FR") : new Date(await fetchLastModifiedDate(project.project)).toLocaleString("fr-FR")) : "À venir";
    document.getElementById("project-raw-name").textContent = project.project;
    document.getElementById("security-level").value = project.admin;
    document.getElementById("security-level-loading").textContent = "";

    Object.entries(project).forEach(([key, value]) => {
        if (typeof value === "boolean") {
            document.getElementById(key).classList.toggle("active", value);
        }
    });
    document.getElementById("error").textContent = "";
    document.getElementById("error").style.color = "red";

    document.getElementById("beta").disabled = false;
    document.getElementById("building").disabled = false;
    document.getElementById("hidden").disabled = false;
    document.getElementById("show-project-info").style.display = "block";
    document.getElementById("security-level").style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
    const admin = await is_admin("", 4);
    const panel = document.getElementById("panel");
    const accessRefused = document.getElementById("access-refused");
    const accessWaiting = document.getElementById("access-waiting");
    const projects_box = document.getElementById("projects-box");

    if (admin) {
        const { data, error } = await sb
            .from("CurrentProjects")
            .select("*")
        
        projects = data;

        projects.forEach(project => {
            const button = document.createElement("button");
            button.setAttribute("class", "project-button");
            button.innerHTML = `
                <p>${project.project}</p>
            `;

            button.addEventListener("click", () => {
                display_info(project);
            });
            projects_box.appendChild(button);
        });
        panel.style.display = "block";
        accessWaiting.style.display = "none";
    } else {
        accessRefused.style.display = "block";
        accessWaiting.style.display = "none";
    }
});

window.change_setting = async function (settingName) {
    const isActive = document.getElementById(settingName).classList.contains("active") ? true : false;

    await sb
        .from("CurrentProjects")
        .update({
            [settingName]: !isActive
        })
        .eq("project", document.getElementById("project-raw-name").textContent)
        .single();
    document.getElementById(settingName).classList.toggle("active", !isActive);
    
    const project = projects.find(p => p.project === document.getElementById("project-raw-name").textContent);
    project[settingName] = !isActive;
}

const select = document.getElementById("security-level");
select.addEventListener("change", async (event) => {
    const value = event.target.value;
    select.disabled = true;
    setTimeout(() => {
        select.disabled = false;
    }, 5000)
    
    await sb
        .from("CurrentProjects")
        .update({
            admin: value
        })
        .eq("project", document.getElementById("project-raw-name").textContent)
        .single();
});
