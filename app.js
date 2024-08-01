let vocabulary = [];
let currentWord;
let remainingWords = [];
let incorrectWords = [];
let isEnglishToVietnamese = true;
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

document
    .getElementById("practice-en-vi")
    .addEventListener("click", () => startPractice(true));
document
    .getElementById("practice-vi-en")
    .addEventListener("click", () => startPractice(false));
submitEl.addEventListener("click", handleSubmitClick);
speakEl.addEventListener("click", speakWord);

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
});

// Fetch vocabulary.txt file
fetch("vocabulary.txt")
    .then((response) => response.text())
    .then((content) => {
        vocabulary = parseVocabularyFile(content);
        console.log("Từ vựng đã được tải thành công!");
        errorMessageEl.textContent = "";
    })
    .catch((error) => {
        console.error("Lỗi khi đọc file vocabulary.txt:", error);
        errorMessageEl.textContent =
            "Lỗi khi tải từ vựng. Đang sử dụng từ vựng mặc định.";
        vocabulary = getDefaultVocabulary();
    });

function getDefaultVocabulary() {
    return [
        {
            english: "last name",
            vietnamese: "họ",
            type: "danh từ, số ít",
        },
        {
            english: "pretty",
            vietnamese: "xinh đẹp",
            type: "tính từ",
        },
        {
            english: "happy",
            vietnamese: "vui vẻ",
            type: "tính từ",
        },
    ];
}

function startPractice(enToVi) {
    isEnglishToVietnamese = enToVi;
    menuEl.style.display = "none";
    practiceEl.style.display = "block";
    remainingWords = [...vocabulary];
    incorrectWords = [];
    correctWords = 0;
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
    wordEl.textContent = isEnglishToVietnamese
        ? currentWord.english
        : currentWord.vietnamese;
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
    const correctAnswer = isEnglishToVietnamese
        ? currentWord.vietnamese.toLowerCase()
        : currentWord.english.toLowerCase();

    // Tách các từ trong câu trả lời chính xác sau dấu phẩy
    const correctAnswerWords = correctAnswer.split(/\s*,\s*/);

    // Kiểm tra xem bất kỳ từ nào trong câu trả lời của người dùng có nằm trong các từ đúng không
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

    infoEl.innerHTML = `<span class="highlight">${currentWord.english}</span> có nghĩa là <span class="highlight">${currentWord.vietnamese}</span> (${currentWord.type}).`;
    isAnswerSubmitted = true;
    submitEl.textContent = "Tiếp";
}

function updateProgress() {
    const progress = (correctWords / totalWords()) * 100;
    progressEl.style.width = `${progress}%`;
}

function speakWord() {
    const text = isEnglishToVietnamese
        ? currentWord.english
        : currentWord.vietnamese;
    const lang = isEnglishToVietnamese ? "en-US" : "vi-VN";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

function parseVocabularyFile(content) {
    const lines = content.trim().split("\n");
    return lines.map((line) => {
        const [english, rest] = line.split("=");
        const [vietnamese, type] = rest.split("/");
        return {
            english: english.trim(),
            vietnamese: vietnamese.trim(),
            type: type.trim(),
        };
    });
}
