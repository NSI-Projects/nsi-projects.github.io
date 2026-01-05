import { is_admin } from "../admin/admin.js";

document.addEventListener("DOMContentLoaded", async () => {
    const admin = await is_admin();
    const panel = document.getElementById("panel");
    const accessRefused = document.getElementById("access-refused");

    if (admin) {
        panel.style.display = "block";
        accessRefused.style.display = "none";
    } else {
        panel.style.display = "none";
        accessRefused.style.display = "block";
    }
});