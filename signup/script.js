async function signup() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const password2 = document.getElementById("password2");

    if (email === "" || password === "" || password2 === "") {
        document.getElementById("error").textContent = "Veuillez remplir tous les champs.";
        return;
    }

    if (password.value !== password2.value) {
        document.getElementById("error").textContent = "Les mots de passe ne correspondent pas.";
        return;
    }

    const { error } = await sb.auth.signUp({
        email: email.value,
        password: password.value
    });

    if (error) {
        document.getElementById("error").innerHTML = "Erreur : l'identifiant est peut-être utilisé.<br>Déjà un compte ? Connectez-vous !";
    } else {
        document.getElementById("error").textContent = "";
        await sb.from("Projects").insert([{email: email.value}]);
        email.value = "";
        password.value = "";
        password2.value = "";
    }
}