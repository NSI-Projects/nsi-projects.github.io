function convert(action, result_needed = true, useResult = null, useBase = null) {
    const buttonconvert = document.getElementById('convert');
    const buttonconvertback = document.getElementById('convertback');
    const result_box = document.getElementById('result');
    const relative = document.getElementById('checkbox').checked;
    const size = document.getElementById('inputsize').value;

    let value = document.getElementById('inputnum').value.trim();
    let base = document.getElementById('inputbase').value.trim();

    if (useResult) {
        value = String(useResult);
    }
    if (useBase) {
        base = String(useBase);
    }

    if (value === "") {
        result_box.textContent = "Veuillez entrer un nombre !";
        result_box.style.color = "red";
    } else if (base === "") {
        result_box.textContent = "Veuillez entrer une base pour convertir !";
        result_box.style.color = "red";
    } else if (base < 2 || base > 36) {
        result_box.textContent = "Veuillez entrer une base comprise entre 2 et 36 !";
        result_box.style.color = "red";
    } else if (value < 0 && relative === false) {
        result_box.textContent = "Veuillez entrer un nombre supérieur ou egal à 0 !";
        result_box.style.color = "red";
    } else if (relative && size === "" || relative && size <= 0) {
        result_box.textContent = "Veuillez entrer une taille valide pour la conversion relative !";
        result_box.style.color = "red";
    } else if (action === "convert" && (relative && (BigInt(value) < -(BigInt(base) ** BigInt(size - 1)) || BigInt(value) > (BigInt(base) ** BigInt(size - 1) - 1n)))) {
        result_box.textContent = `Le nombre donné n'entre pas dans la plage des nombres relatifs de la taille d'information donnée : ${size} bits`;
        result_box.style.color = "red";
    } else if (action === "invert"  && relative && String(value).length != size) {
        result_box.textContent = `Le nombre donné n'a pas la bonne taille d'information : ${size} bits`;
        result_box.style.color = "red";
    } else if (value === "0" || value === "0".repeat(size)) {
        result_box.textContent = relative ? "0".repeat(size) : "0";
        result_box.style.color = "white";
    } else {
        try {
            if (action === "invert") {
                const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let result = 0n;
                let len = value.length;

                for (let i = 0; i < len; i++) {
                    let char = value[len - i - 1].toUpperCase();
                    let digit = digits.indexOf(char);

                    if (digit === -1 || digit >= Number(base)) {
                        result_box.textContent = `Caractère invalide "${char}" pour la base ${base}`;
                        result_box.style.color = "red";
                        return;
                    }

                    result += BigInt(digit) * (BigInt(base) ** BigInt(i));
                }

                if (relative && result >= BigInt(base) ** BigInt(size - 1)) {
                    result -= BigInt(base) ** BigInt(size);
                }

                if (result_needed) {
                    result_box.textContent = result;
                    result_box.style.color = "white";
                
                    buttonconvertback.textContent = "Nombre converti !";
                    setTimeout(() => buttonconvertback.textContent = "Revenir base 10 !", 1000);
                } else {
                    return result;
                }
            } else {
                let num;
                num = BigInt(value);
                if (relative && value < 0n) {
                    num += BigInt(base) ** BigInt(size);
                }
                const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let result = "";
                while (num > 0n) {
                    let remainder = num % BigInt(base);
                    result = digits[Number(remainder)] + result;
                    num = num / BigInt(base);
                }

                while (result.length < size && relative) {
                    result = "0" + result;
                }

                if (result_needed) {
                    result_box.textContent = result;
                    result_box.style.color = "white";

                    buttonconvert.textContent = "Nombre converti !";

                    setTimeout(() => buttonconvert.textContent = "Convertir !", 1000);
                } else {
                    return result;
                }
            }
        } catch(e) {
            result_box.textContent = "Erreur lors de la conversion : " + e
            result_box.style.color = "red"
        }
    }
}

function invert() {
    const input = document.getElementById('inputnum');
    const result_box = document.getElementById('result');
    const button = document.getElementById('invert');

    const errorMessages = [
        "Veuillez entrer un nombre !",
        "Veuillez entrer une base pour convertir !",
        "Veuillez entrer une base comprise entre 2 et 36 !",
        "Veuillez entrer un nombre supérieur ou egal à 0 !",
        "Apparaîtra ici votre résultat",
        "Veuillez entrer une taille valide pour la conversion relative !",
        "Le nombre donné n'entre pas dans la plage des nombres relatifs de la taille d'information donnée :",
        "Le nombre donné n'a pas la bonne taille d'information :"
    ];

    if (
        !errorMessages.includes(result_box.textContent) &&
        !result_box.textContent.startsWith("Caractère invalide") &&
        !result_box.textContent.startsWith("Erreur lors de la conversion")
    ) {
        input.value = result_box.textContent;
    } else {
        input.value = "";
        result_box.textContent = "Apparaîtra ici votre résultat";
        result_box.style.color = "gray";
        return;
    }
    result_box.textContent = "Apparaîtra ici votre résultat";
    result_box.style.color = "gray";

    button.textContent = "Résultat repris";

    setTimeout(() => button.textContent = "Reprendre le résultat !", 1000);
}

function convert16() {
    const button = document.getElementById('convert16');

    convert('convert', true, convert("invert", false), 16);

    button.textContent = "Nombre converti !";
    setTimeout(() => button.textContent = "Convertir base X en base 16 !", 1000);
}

function reset() {
    const input = document.getElementById('inputnum');
    const result_box = document.getElementById('result');
    const base = document.getElementById('inputbase');
    const button = document.getElementById('reset');
    const size = document.getElementById('inputsize');
    const checkbox = document.getElementById('checkbox');

    checkbox.checked = false;
    size.value = "";
    input.value = "";
    base.value = "";
    result_box.textContent = "Apparaîtra ici votre résultat";
    result_box.style.color = "gray";

    button.textContent = "Bi-vertisseur reset !";

    setTimeout(() => button.textContent = "Remettre tout à zéro !", 1000);
}

function showTuto() {
    const tuto = document.querySelector('.tuto');
    const button = document.getElementById('tutoBtn');
    
    tuto.classList.toggle('show');

    button.textContent = tuto.classList.contains('show') ? "Masquer les conseils !" : "Montrer les conseils !";
}