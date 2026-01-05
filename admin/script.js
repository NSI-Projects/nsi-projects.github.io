async function promote() {
    const email = prompt("Entrez l'adresse e-mail de l'utilisateur à promouvoir en administrateur :");
    if (!email) {
        alert("Aucune adresse e-mail fournie.");
        return;
    } else {
        const { data, error } = await sb
            .from("Projects")
            .update({ admin: true })
            .eq("email", email);
        alert("L'utilisateur a été promu en administrateur si vous possédez les droits requis.");
    }
}

async function unpromote() {
    const { data: { session }, error } = await sb.auth.getSession();
    const email = prompt("Entrez l'adresse e-mail de l'utilisateur à rétrograder en utilisateur normal :");
    if (email === session.user.email) {
        alert("Vous ne pouvez pas vous rétrograder vous-même.");
        return;
    }
    if (!email) {
        alert("Aucune adresse e-mail fournie.");
        return;
    } else {
        const { data, error } = await sb
            .from("Projects")
            .update({ admin: false })
            .eq("email", email);
        alert("L'utilisateur a été rétrogradé en utilisateur normal si vous possédez les droits requis.");
    }
}