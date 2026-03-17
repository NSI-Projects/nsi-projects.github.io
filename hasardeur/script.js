const initialStudents = [
    "ANNÉZO--SÉBIRE Cyprien", "AUDE Mael", "BEAUMIER Nolan", "BEDEL Zoé",
    "BOSQUAIN Nolan", "BRETONNET Julie", "BULOT Justine", "CARABEUF Hugo",
    "CARON Rachel", "CAVALIER Marion", "COCHEPIN Siméon", "DE CACHELEU Amaury",
    "FERNAND Elouan", "FOUACE Louise", "GESBERT Jeanne", "HAAVIND Astrid",
    "HARDY Oscar", "HUE Armelle", "JANNOT Anaïs", "LECLERRE Anaëlle",
    "LEPOTIER Franck", "LORRE Elsa", "MALLET Doryan", "MARGUERITTE Dorian",
    "MARIE Maewenn", "MAURICE VOISIN Lolita", "MOREL HÉLIE Louca",
    "PUCHEU Noé", "SARR Clarisse", "THERESE June", "THOMAS Luna"
];

let studentStates = initialStudents.map(name => ({ name, active: true }));

function initList() {
    const listDiv = document.getElementById('studentList');
    listDiv.innerHTML = '';
    studentStates.forEach((student, index) => {
        const label = document.createElement('label');
        label.className = 'cb';
        label.innerHTML = `
            <input type="checkbox" ${student.active ? 'checked' : ''} 
                   onchange="studentStates[${index}].active = this.checked">
            <span class="checkbox_box"></span>
            ${student.name}
        `;
        listDiv.appendChild(label);
    });
}

function toggleModal(show) {
    document.getElementById('studentModal').style.display = show ? 'block' : 'none';
}

let currentTimeout = null;

function pickRandom() {
    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }

    const activeStudents = studentStates.filter(s => s.active);
    const resultDiv = document.getElementById('result');

    if (activeStudents.length === 0) {
        resultDiv.innerText = "Aucun élève sélectionné";
        return;
    } else if (activeStudents.length === 1) {
        resultDiv.innerText = "Il n'y a pas assez d'élèves actifs";
        return;
    }

    resultDiv.style.color = "#f0f0f0";
    resultDiv.style.fontWeight = "normal";
    resultDiv.style.transform = "scale(1)";

    let iterations = 0;
    let maxIterations = 25;
    let currentDelay = 50;

    function animate() {
        const randomIndex = Math.floor(Math.random() * activeStudents.length);
        resultDiv.innerText = activeStudents[randomIndex].name;

        iterations++;

        if (iterations < maxIterations) {
            currentDelay += (iterations * 1.5);
            currentTimeout = setTimeout(animate, currentDelay);
        } else {
            resultDiv.style.color = "#03dac6";
            resultDiv.style.fontWeight = "bold";
            resultDiv.style.transform = "scale(1.1)";

            currentTimeout = setTimeout(() => {
                resultDiv.style.transform = "scale(1)";
                currentTimeout = null;
            }, 200);
        }
    }

    animate();
}

function setAll(status) {
    studentStates.forEach(student => {
        student.active = status;
    });

    initList();
}

window.onload = initList;