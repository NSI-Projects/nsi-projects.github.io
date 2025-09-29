const input = document.getElementById('inputnum');
const result = document.getElementById('result');
const button = document.getElementById('monnayeurButton');

button.addEventListener('click', monnayeur);

function monnayeur() {
    let value = input.value.trim();

    input.value = "";

    if (value === "") {
        result.textContent = "Veuillez entrer un nombre !";
        result.style.color = "red";
        result.style.height = "6vh";
    } else if (value < 0) {
        result.textContent = "Veuillez entrer un nombre supérieur ou egal à 0 !";
        result.style.color = "red";
        result.style.height = "6vh";
    } else if (value === "0") {
        result.textContent = "Il n'y a rien à monnayer !";
        result.style.color = "white";
        result.style.height = "6vh";
    } else if (parseFloat(value).toFixed(2) === "NaN") {
        result.textContent = "Veuillez entrer un montant valide !";
        result.style.color = "red";
        result.style.height = "6vh";
    } else {
        try {
            value = parseFloat(value).toFixed(2);
            let message = `Voici votre monnaie de ${value}€ : <br>`;

            let monnaies = [50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
            let monnaies_types = [
                " billet(s) de 500€", " billet(s) de 200€", " billet(s) de 100€",
                " billet(s) de 50€", " billet(s) de 20€", " billet(s) de 10€",
                " billet(s) de 5€", " pièce(s) de 2€", " pièce(s) de 1€",
                " pièce(s) de 50 centimes", " pièce(s) de 20 centimes",
                " pièce(s) de 10 centimes", " pièce(s) de 5 centimes",
                " pièce(s) de 2 centimes", " pièce(s) de 1 centime"
            ];
            value *= 100;

            for (let i = 0; i < monnaies.length; i++) {
                if (value >= monnaies[i]) {
                    let nb = Math.floor(value / monnaies[i]);
                    message += `${nb} ${monnaies_types[i]}<br>`;
                    value = value - nb * monnaies[i];
                }
            }

            result.innerHTML = message;
            result.style.color = "white";
            result.style.height = "auto";
        } catch (error) {
            result.textContent = "Veuillez entrer un montant valide : " + error;
            result.style.color = "red";
            result.style.height = "6vh";
        }
    }
}

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
    if (
        (e.ctrlKey && e.key.toLowerCase() === "u") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        (e.key === "F12") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j")
    ) {
        e.preventDefault();
    }
});
