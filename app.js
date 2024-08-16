let vocabulary = [];
let currentWord;
let remainingWords = [];
let incorrectWords = [];
let isVietnameseToEnglish = true;
let correctWords = 0;
let isAnswerSubmitted = false;
let learnedWords = []; // Thêm biến này để lưu trữ các từ đã học thành công
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
const loadProgressEl = document.getElementById("load-progress");

document
    .getElementById("practice-vi-en")
    .addEventListener("click", () => startPractice(true));
document
    .getElementById("practice-en-vi")
    .addEventListener("click", () => startPractice(false));
submitEl.addEventListener("click", handleSubmitClick);
speakEl.addEventListener("click", speakWord);
saveProgressEl.addEventListener("click", saveProgressToFile);
loadProgressEl.addEventListener("click", loadProgressFromFile);

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
            note: "tên họ của một người, thường đứng sau tên đệm và tên gọi",
        },
        {
            english: "pretty",
            vietnamese: "xinh đẹp",
            type: "tính từ",
            note: "có vẻ đẹp dễ thương, thu hút",
        },
        {
            english: "happy",
            vietnamese: "vui vẻ",
            type: "tính từ",
            note: "cảm thấy hoặc thể hiện niềm vui, hạnh phúc",
        },
    ];
}

function startPractice(viToEn, loadedProgress = null) {
    isVietnameseToEnglish = viToEn;
    menuEl.style.display = "none";
    practiceEl.style.display = "block";

    if (loadedProgress) {
        learnedWords = loadedProgress.learnedWords || [];
        remainingWords = loadedProgress.remainingWords.filter(
            (word) => !learnedWords.includes(word)
        );
        incorrectWords = loadedProgress.incorrectWords.filter(
            (word) => !learnedWords.includes(word)
        );
        correctWords = loadedProgress.correctWords;
    } else {
        learnedWords = [];
        remainingWords = [...vocabulary];
        incorrectWords = [];
        correctWords = 0;
    }

    isAnswerSubmitted = false;
    submitEl.textContent = "Gửi";
    updateProgress();
    nextWord();
}

function nextWord() {
    if (remainingWords.length === 0) {
        if (incorrectWords.length === 0) {
            practiceEl.innerHTML =
                "<h2>Chúc mừng! Bạn đã hoàn thành tất cả các từ.</h2>";
            return;
        } else {
            remainingWords = incorrectWords.filter(
                (word) => !learnedWords.includes(word)
            );
            incorrectWords = [];
        }
    }

    const index = Math.floor(Math.random() * remainingWords.length);
    currentWord = remainingWords[index];
    if (isVietnameseToEnglish) {
        const cleanedNote = currentWord.note
            .replace(/\(ví dụ:.*?\)/gi, "")
            .trim();
        wordEl.textContent = `${currentWord.vietnamese}${
            cleanedNote ? ` (${cleanedNote})` : ""
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
        if (!learnedWords.includes(currentWord)) {
            learnedWords.push(currentWord);
        }
        correctWords++;
        updateProgress();
    } else {
        feedbackEl.textContent = "Sai!";
        feedbackEl.className = "feedback incorrect";
        incorrectWords.push(currentWord);
    }

    let infoText = "";
    if (isVietnameseToEnglish) {
        infoText = `<span class="highlight">${
            currentWord.vietnamese
        }</span> có nghĩa là <span class="highlight">${
            currentWord.english
        }</span> (${currentWord.type}${
            currentWord.note ? ` - ${currentWord.note}` : ""
        })`;
    } else {
        infoText = `<span class="highlight">${
            currentWord.english
        }</span> có nghĩa là <span class="highlight">${
            currentWord.vietnamese
        }</span> (${currentWord.type}${
            currentWord.note ? ` - ${currentWord.note}` : ""
        })`;
    }

    if (currentWord.exampleEn && currentWord.exampleVi) {
        infoText += ` (ví dụ: ${currentWord.exampleEn} + ${currentWord.exampleVi})`;
    }

    infoEl.innerHTML = infoText;

    isAnswerSubmitted = true;
    submitEl.textContent = "Tiếp";
}

function updateProgress() {
    const progress =
        ((totalWords() - remainingWords.length) / totalWords()) * 100;
    progressEl.style.width = `${progress}%`;
}

function speakWord() {
    const text = currentWord.english;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
}

function parseVocabularyFile(content) {
    const lines = content.trim().split("\n");
    return lines.map((line) => {
        const [english, rest] = line.split("=");
        const [vietnamese, typeAndNote] = rest.split("/");
        const [type, fullNote] = typeAndNote.split(" - ");

        const noteMatch = fullNote.match(/(.*?)\(ví dụ: (.*?) \+ (.*?)\)/);
        let note = "",
            exampleEn = "",
            exampleVi = "";
        if (noteMatch) {
            note = noteMatch[1].trim();
            exampleEn = noteMatch[2].trim();
            exampleVi = noteMatch[3].trim();
        } else {
            note = fullNote.trim();
        }

        return {
            english: english.trim(),
            vietnamese: vietnamese.trim(),
            type: type.trim(),
            note: note,
            exampleEn: exampleEn,
            exampleVi: exampleVi,
        };
    });
}

function saveProgressToFile() {
    const progress = {
        remainingWords,
        incorrectWords,
        correctWords,
        isVietnameseToEnglish,
        learnedWords,
    };
    const blob = new Blob([JSON.stringify(progress)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vocabulary_progress.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadProgressFromFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const savedProgress = JSON.parse(e.target.result);
                startPractice(
                    savedProgress.isVietnameseToEnglish,
                    savedProgress
                );
                alert("Tiến độ đã được tải thành công!");
            } catch (error) {
                console.error("Lỗi khi đọc file tiến độ:", error);
                alert(
                    "Không thể đọc file tiến độ. Vui lòng kiểm tra lại file."
                );
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
