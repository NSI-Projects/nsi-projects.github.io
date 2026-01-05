import { is_admin } from "../src/admin.js";
import { fetchLastModifiedDate, fetchReadme, formatName, check_status } from "../src/projects.js";

async function display_info(name) {
    document.getElementById("project-id").innerHTML = "chargement...";
    document.getElementById("project-connected-at").textContent = "chargement...";
    const { data: projectData, error: projectError } = await sb
        .from("CurrentProjects")
        .select("*")
        .eq("project", name)
        .single();

    const readme = await fetchReadme(name);
    console.log(readme);

    document.getElementById("show-project-info").style.display = "block";

    document.getElementById("project-id").innerHTML = "<span style=\"color: #d1ffe7ff;\">" + readme.title || formatName(name) + "</span>";

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