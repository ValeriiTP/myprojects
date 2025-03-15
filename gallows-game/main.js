const rulesSubmitButton = document.getElementById("rules-submit-button");
const rulesWrapper = document.getElementById("rules-wrapper");
const gameWrapper = document.getElementById("game-wrapper");

const hiddenWordElement = document.getElementById("hidden-word");
const hiddenWord = "СТАТЕВИЙ ЧЛЕН";
const hiddenWordLetters = new Set(hiddenWord.split(""))
const guessedLetters = new Set()

const buttonElementsMap = new Map()

const gameImageElement = document.getElementById("game-image");
let failStage = 0;
const failImagesMaps = {
    0: "progress-0.png",
    1: "progress-1.png",
    2: "progress-2.png",
    3: "progress-3.png",
    4: "progress-4.png",
    5: "progress-5.png",
    6: "progress-6.png",
    7: "progress-7.png",
    8: "progress-8.png",
    9: "progress-9.png",
    10: "progress-10.png"
}

const resetButtonElement = document.getElementById("reset-button");

// Initial render
renderHiddenWord();
renderImage();

rulesSubmitButton.addEventListener("click", () => {
    hideElement(rulesWrapper);
    showElement(gameWrapper);
})

resetButtonElement.addEventListener("click", () => {
    failStage = 0;
    guessedLetters.clear();

    renderHiddenWord();
    renderImage();

    buttonElementsMap.values().forEach(buttonElement => {
        buttonElement.classList.remove("disabled", "failed", "guessed");
    });
})

const alphabetMap = {
    1: "А", 2: "Б", 3: "В", 4: "Г", 5: "Ґ", 6: "Д", 7: "Е", 8: "Є", 9: "Ж",
    10: "З", 11: "И", 12: "І", 13: "Ї", 14: "Й", 15: "К", 16: "Л", 17: "М", 18: "Н",
    19: "О", 20: "П", 21: "Р", 22: "С", 23: "Т", 24: "У", 25: "Ф", 26: "Х", 27: "Ц",
    28: "Ч", 29: "Ш", 30: "Щ", 31: "Ь", 32: "Ю", 33: "Я"
};


const keyboardElement = document.getElementById("keyboard");

Object.entries(alphabetMap).forEach(([key, value]) => {
    const buttonElement = document.createElement("div")
    buttonElement.setAttribute("class", `keyboard-button`);
    buttonElement.setAttribute("id", `button-${key}`);
    buttonElement.innerText = value;
    keyboardElement.appendChild(buttonElement);
    buttonElementsMap.set(key, buttonElement);
})

window.addEventListener("click", (e) => {
    if (e.target.className !== "keyboard-button")
        return;

    if (failStage > Object.entries(failImagesMaps).length - 1) {
        blockKeyboard();
        return;
    }

    checkGuess(e.target);
    renderHiddenWord();
    renderImage();
})

function renderHiddenWord() {
    let filteredWord = hiddenWord;
    hiddenWordLetters.forEach(letter => {
        if (guessedLetters.has(letter)) return;
        if (letter === " ") return;
        filteredWord = filteredWord.replaceAll(letter, "-");
    })
    hiddenWordElement.innerText = filteredWord;
}

function renderImage() {
    gameImageElement.src = `public/images/progression/${failImagesMaps[failStage]}`
}

function blockKeyboard() {
    keyboardElement.classList.add("disabled");
    hiddenWordElement.innerText = "GAME OVER"
}

function checkGuess(guessButton) {
    const buttonId = guessButton.id.slice(7);
    const isGuessed = checkLetter(alphabetMap[buttonId])
    const buttonElement = buttonElementsMap.get(buttonId);
    if (buttonElement.classList.contains("disabled")) return;

    buttonElement.classList.add("disabled");

    if (isGuessed) {
        buttonElement.classList.add("guessed");
    } else {
        buttonElement.classList.add("failed");
        failStage++;
    }
}

function checkLetter(letter) {
    if (hiddenWordLetters.has(letter)) {
        guessedLetters.add(letter);
        return true;
    }

    return false;
}

function hideElement(element) {
    element.style.visibility = "hidden";
}

function showElement(element) {
    element.style.visibility = "visible";
}