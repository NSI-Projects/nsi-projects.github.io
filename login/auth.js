import { is_admin } from "../admin/admin.js";

async function display_info() {
    const { data: { session }, error } = await sb.auth.getSession();
    const user = session?.user;
    if (!user) {
        document.getElementById("signin-page").style.display = "block";
        document.getElementById("logout-page").style.display = "none";
        return;
    }

    document.getElementById("signin-page").style.display = "none";
    document.getElementById("logout-page").style.display = "block";
    document.getElementById("session-id").textContent = user.email;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-created-at").textContent = new Date(user.created_at).toLocaleString("fr-FR");
    document.getElementById("user-connected-at").textContent = new Date(user.last_sign_in_at).toLocaleString("fr-FR");

    const admin = await is_admin();
    document.getElementById("user-admin").innerHTML = admin ? "<a class=\"admin-link\" href=\"../admin/index.html\">Oui</a>" : "<span style=\"color: red;\">Non</span>";
}

sb.auth.onAuthStateChange((event, session) => {
    display_info();
});
