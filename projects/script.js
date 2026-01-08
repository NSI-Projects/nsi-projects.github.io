import { is_admin } from "../src/admin.js";
import { fetchLastModifiedDate, fetchReadme, check_status } from "../src/projects.js";

async function display_info(name) {
    document.getElementById("error").textContent = "Chargement des informations du projet...";
    document.getElementById("error").style.color = "white";

    document.getElementById("project-id").innerHTML = "chargement...";
    document.getElementById("project-desc").textContent = "chargement...";
    document.getElementById("project-created-at").textContent = "chargement...";
    document.getElementById("project-raw-name").textContent = "chargement...";

    document.getElementById("beta").classList.remove("active");
    document.getElementById("building").classList.remove("active");
    document.getElementById("hidden").classList.remove("active");
    document.getElementById("beta").disabled = true;
    document.getElementById("building").disabled = true;
    document.getElementById("hidden").disabled = true;

    const { data: projectData, error: projectError } = await sb
        .from("CurrentProjects")
        .select("*")
        .eq("project", name)
        .single();

    const readme = await fetchReadme(name);

    document.getElementById("project-id").innerHTML = "<span style=\"color: #d1ffe7ff;\">" + readme.title + "</span>";
    document.getElementById("project-desc").textContent = readme.description;
    document.getElementById("project-created-at").textContent = new Date(await fetchLastModifiedDate(name)).toLocaleString("fr-FR");
    document.getElementById("project-raw-name").textContent = name;

    const status = await check_status(name);
    Object.entries(status).forEach(([key, value]) => {
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
}

document.addEventListener("DOMContentLoaded", async () => {
    const admin = await is_admin("", 4);
    const panel = document.getElementById("panel");
    const accessRefused = document.getElementById("access-refused");
    const accessWaiting = document.getElementById("access-waiting");
    const projects_box = document.getElementById("projects-box");

    if (admin) {
        const { data: projects, error } = await sb
            .from("CurrentProjects")
            .select("*")

        projects.forEach(project => {
            const button = document.createElement("button");
            button.setAttribute("class", "project-button");
            button.innerHTML = `
                <p>${project.project}</p>
            `;

            button.addEventListener("click", () => {
                display_info(project.project);
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
}