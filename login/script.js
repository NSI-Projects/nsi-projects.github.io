async function login() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (email.value === "" || password.value === "") {
        document.getElementById("error").textContent = "Veuillez remplir tous les champs.";
        return;
    }

    const { error } = await sb.auth.signInWithPassword({
        email: email.value.toLowerCase(),
        password: password.value
    });

    if (error) {
        document.getElementById("error").innerHTML = "Erreur de connexion : Identifiant ou mot de passe incorrect.<br>Pas de compte ? Inscrivez-vous !";
    } else {
        document.getElementById("error").textContent = "";
        email.value = "";
        password.value = "";
    }
}

async function logout() {
    await sb.auth.signOut();
}