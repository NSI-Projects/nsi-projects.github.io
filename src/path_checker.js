import { check_status } from "../src/projects.js";
import { is_admin } from "../src/admin.js";

async function checkProjectAccess() {
    if (await is_admin("", 4)) return;
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    const projectName = parts[0];

    if (!projectName) return;

    const status = await check_status(projectName);

    if (status.refused === true) {
        window.location.replace("../refused.html");
    }
}

checkProjectAccess();