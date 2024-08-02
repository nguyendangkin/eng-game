let vocabulary = [];
let currentWord;
let remainingWords = [];
let incorrectWords = [];
let isVietnameseToEnglish = true;
let correctWords = 0;
let isAnswerSubmitted = false;
const totalWords = () => vocabulary.length;

const menuEl = document.getElementById("menu");
const practiceEl = document.getElementById("practice");
const wordEl = document.getElementById("word");
const answerEl = document.getElementById("answer");
const submitEl = document.getElementById("submit");
const speakEl = document.getElementById("speak");
const feedbackEl = document.getElementById("feedback");
const infoEl = document.getElementById("info");
const progressEl = document.getElementById("progress");
const errorMessageEl = document.getElementById("error-message");
const saveProgressEl = document.getElementById("save-progress");
const continuePracticeEl = document.getElementById("continue-practice");
const newPracticeEl = document.getElementById("new-practice");

document
    .getElementById("practice-vi-en")
    .addEventListener("click", () => startPractice(true, false));
document
    .getElementById("practice-en-vi")
    .addEventListener("click", () => startPractice(false, false));
submitEl.addEventListener("click", handleSubmitClick);
speakEl.addEventListener("click", speakWord);
saveProgressEl.addEventListener("click", saveProgress);
continuePracticeEl.addEventListener("click", () =>
    startPractice(isVietnameseToEnglish, true)
);
newPracticeEl.addEventListener("click", () =>
    startPractice(isVietnameseToEnglish, false)
);

answerEl.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        if (isAnswerSubmitted) {
            nextWord();
        } else {
            checkAnswer();
        }
    } else if (event.key === "Escape") {
        speakWord();
    }
});

document.getElementById("back-to-menu").addEventListener("click", () => {
    menuEl.style.display = "block";
    practiceEl.style.display = "none";
    saveProgress();
    updateMenuButtons();
});

// Fetch vocabulary.txt file
fetch("vocabulary.txt")
    .then((response) => response.text())
    .then((content) => {
        vocabulary = parseVocabularyFile(content);
        console.log("Từ vựng đã được tải thành công!");
        errorMessageEl.textContent = "";
        updateMenuButtons();
    })
    .catch((error) => {
        console.error("Lỗi khi đọc file vocabulary.txt:", error);
        errorMessageEl.textContent =
            "Lỗi khi tải từ vựng. Đang sử dụng từ vựng mặc định.";
        vocabulary = getDefaultVocabulary();
        updateMenuButtons();
    });

function getDefaultVocabulary() {
    return [
        {
            english: "last name",
            vietnamese: "họ",
            type: "danh từ, số ít",
            note: "",
        },
        {
            english: "pretty",
            vietnamese: "xinh đẹp",
            type: "tính từ",
            note: "",
        },
        {
            english: "happy",
            vietnamese: "vui vẻ",
            type: "tính từ",
            note: "",
        },
    ];
}

function startPractice(viToEn, continueProgress) {
    isVietnameseToEnglish = viToEn;
    menuEl.style.display = "none";
    practiceEl.style.display = "block";

    if (continueProgress) {
        loadProgress();
    } else {
        remainingWords = [...vocabulary];
        incorrectWords = [];
        correctWords = 0;
    }

    isAnswerSubmitted = false;
    submitEl.textContent = "Gửi";
    nextWord();
}

function nextWord() {
    if (remainingWords.length === 0) {
        if (incorrectWords.length === 0) {
            practiceEl.innerHTML =
                "<h2>Chúc mừng! Bạn đã hoàn thành tất cả các từ.</h2>";
            return;
        } else {
            remainingWords = [...incorrectWords];
            incorrectWords = [];
        }
    }

    const index = Math.floor(Math.random() * remainingWords.length);
    currentWord = remainingWords[index];
    if (isVietnameseToEnglish) {
        wordEl.textContent = `${currentWord.vietnamese} ${
            currentWord.note ? `(${currentWord.note})` : ""
        }`;
    } else {
        wordEl.textContent = currentWord.english;
    }
    answerEl.value = "";
    feedbackEl.textContent = "";
    infoEl.textContent = "";
    updateProgress();
    answerEl.focus();
    isAnswerSubmitted = false;
    submitEl.textContent = "Gửi";
}

function handleSubmitClick() {
    if (isAnswerSubmitted) {
        nextWord();
    } else {
        checkAnswer();
    }
}

function checkAnswer() {
    const userAnswer = answerEl.value.trim().toLowerCase();
    const correctAnswer = isVietnameseToEnglish
        ? currentWord.english.toLowerCase()
        : currentWord.vietnamese.toLowerCase();

    const correctAnswerWords = correctAnswer.split(/\s*,\s*/);

    const isCorrect = correctAnswerWords.some((answerWord) =>
        userAnswer.includes(answerWord)
    );

    if (isCorrect) {
        feedbackEl.textContent = "Đúng!";
        feedbackEl.className = "feedback correct";
        remainingWords = remainingWords.filter((word) => word !== currentWord);
        correctWords++;
        updateProgress();
    } else {
        feedbackEl.textContent = "Sai!";
        feedbackEl.className = "feedback incorrect";
        incorrectWords.push(currentWord);
    }

    if (isVietnameseToEnglish) {
        infoEl.innerHTML = `<span class="highlight">${currentWord.vietnamese}</span> có nghĩa là <span class="highlight">${currentWord.english}</span> (${currentWord.type}).`;
    } else {
        infoEl.innerHTML = `<span class="highlight">${currentWord.english}</span> có nghĩa là <span class="highlight">${currentWord.vietnamese}</span> (${currentWord.type}).`;
    }
    isAnswerSubmitted = true;
    submitEl.textContent = "Tiếp";
}

function updateProgress() {
    const progress = (correctWords / totalWords()) * 100;
    progressEl.style.width = `${progress}%`;
}

function speakWord() {
    const text = currentWord.english; // Always speak the English word
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
}

function parseVocabularyFile(content) {
    const lines = content.trim().split("\n");
    return lines.map((line) => {
        const [english, rest] = line.split("=");
        const [vietnamese, typeAndNote] = rest.split("/");
        const [type, note] = typeAndNote.split(" - ");
        return {
            english: english.trim(),
            vietnamese: vietnamese.trim(),
            type: type.trim(),
            note: note ? note.trim() : "",
        };
    });
}

function saveProgress() {
    const progress = {
        remainingWords,
        incorrectWords,
        correctWords,
        isVietnameseToEnglish,
    };
    localStorage.setItem("vocabularyProgress", JSON.stringify(progress));
    alert("Tiến độ đã được lưu!");
}

function loadProgress() {
    const savedProgress = JSON.parse(
        localStorage.getItem("vocabularyProgress")
    );
    if (savedProgress) {
        remainingWords = savedProgress.remainingWords;
        incorrectWords = savedProgress.incorrectWords;
        correctWords = savedProgress.correctWords;
        isVietnameseToEnglish = savedProgress.isVietnameseToEnglish;
        updateProgress();
    }
}

function updateMenuButtons() {
    const savedProgress = JSON.parse(
        localStorage.getItem("vocabularyProgress")
    );
    if (savedProgress) {
        continuePracticeEl.style.display = "inline-block";
    } else {
        continuePracticeEl.style.display = "none";
    }
}

// Thêm event listener cho window unload để lưu tiến độ trước khi đóng trang
window.addEventListener("beforeunload", saveProgress);
