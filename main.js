import fs from "fs";
import readline from "readline";
import chalk from "chalk";
import { exec } from "child_process";
import gtts from "gtts";

// Tạo giao diện nhập liệu
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Từ vựng mặc định
const defaultVocabulary = [
    { english: "last name", vietnamese: "họ", type: "danh từ, số ít" },
    { english: "pretty", vietnamese: "xinh đẹp", type: "tính từ" },
    { english: "happy", vietnamese: "vui vẻ", type: "tính từ" },
];

// Đọc từ vựng từ tệp nếu tồn tại, ngược lại sử dụng từ vựng mặc định
function loadVocabulary() {
    return new Promise((resolve, reject) => {
        const fileName = "vocabulary.txt";
        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(
                    chalk.yellow(
                        `Tệp ${fileName} không tồn tại, tạo mới với từ vựng mặc định.`
                    )
                );
                // Tạo và ghi dữ liệu vào tệp
                const data = defaultVocabulary
                    .map(
                        (item) =>
                            `${item.english}=${item.vietnamese}/${item.type}`
                    )
                    .join("\n");

                fs.writeFile(fileName, data, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log(
                        chalk.green(
                            `Tệp ${fileName} đã được tạo với từ vựng mặc định.`
                        )
                    );
                    resolve(defaultVocabulary);
                });
                return;
            }

            fs.readFile(fileName, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                const lines = data.trim().split("\n");
                const vocab = lines.map((line) => {
                    const [english, rest] = line.split("=");
                    const [vietnamese, type] = rest.split("/");
                    return {
                        english: english.trim(),
                        vietnamese: vietnamese.trim(),
                        type: type.trim(),
                    };
                });
                resolve(vocab);
            });
        });
    });
}

// Hiển thị menu lựa chọn
function showMenu() {
    console.log(chalk.cyan("\nChọn chế độ:"));
    console.log(chalk.green("1. Nhập từ vựng tiếng Việt cho từ tiếng Anh"));
    console.log(chalk.green("2. Nhập từ vựng tiếng Anh cho từ tiếng Việt"));
    console.log(chalk.yellow("3. Thoát"));
}

// Làm sạch màn hình
function clearScreen() {
    process.stdout.write("\x1Bc");
}

// Yêu cầu người dùng nhấn Enter để tiếp tục
function pause() {
    return new Promise((resolve) =>
        rl.question(
            `${chalk.bold.yellow("Nhấn Enter để tiếp tục...")}`,
            resolve
        )
    );
}

// Hiển thị thanh tiến trình
function showProgress(remaining, total) {
    const progress = ((total - remaining) / total) * 100;
    const barLength = 40;
    const filledLength = Math.max(0, Math.round((progress / 100) * barLength));
    const emptyLength = Math.max(0, barLength - filledLength);
    const bar = "█".repeat(filledLength) + "░".repeat(emptyLength);

    console.log(
        chalk.green(
            `\nTiến trình: [${bar}] ${Math.round(progress)}% (${
                total - remaining
            }/${total})`
        )
    );
}

// Kiểm tra đáp án
function checkAnswer(word, answer, isEnglishToVietnamese) {
    if (isEnglishToVietnamese) {
        return word.vietnamese.toLowerCase() === answer.toLowerCase();
    } else {
        return word.english.toLowerCase() === answer.toLowerCase();
    }
}

// Phát âm từ vựng
function speak(text, lang) {
    return new Promise((resolve, reject) => {
        const speech = new gtts(text, lang);
        speech.save("/tmp/voice.mp3", (err, result) => {
            if (err) {
                reject(err);
            } else {
                exec("mpg123 /tmp/voice.mp3", (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

// Cơ chế luyện tập
async function practiceVocabulary(vocabulary) {
    let incorrectWords = [...vocabulary];

    while (true) {
        showMenu();

        const choice = await new Promise((resolve) =>
            rl.question("Chọn: ", resolve)
        );

        if (choice === "3") {
            console.log(chalk.yellow("Đã thoát khỏi chương trình."));
            rl.close();
            break;
        }

        while (incorrectWords.length > 0) {
            showProgress(incorrectWords.length, vocabulary.length);
            const index = Math.floor(Math.random() * incorrectWords.length);
            const word = incorrectWords[index];
            let answer;

            // Phát âm từ với ngôn ngữ tương ứng
            await speak(
                choice === "1" ? word.english : word.vietnamese,
                choice === "1" ? "en" : "vi"
            );

            if (choice === "1") {
                answer = await new Promise((resolve) =>
                    rl.question(
                        `Từ "${chalk.bold.blue(
                            word.english
                        )}" ("q" để trở về): `,
                        resolve
                    )
                );
                if (answer.toLowerCase() === "q") {
                    break; // Quay về menu chính
                }
                if (checkAnswer(word, answer, true)) {
                    console.log(
                        chalk.green(
                            `Đúng! ${chalk.bold.blue(
                                word.english
                            )} có nghĩa là ${chalk.bold.blue(
                                word.vietnamese
                            )} (${chalk.white(word.type)}).`
                        )
                    );
                    incorrectWords.splice(index, 1);
                } else {
                    console.log(
                        chalk.yellow(
                            `Sai! Đáp án đúng là ${chalk.bold.blue(
                                word.vietnamese
                            )} (${chalk.white(word.type)}).`
                        )
                    );
                }
            } else if (choice === "2") {
                answer = await new Promise((resolve) =>
                    rl.question(
                        `Từ "${chalk.bold.blue(
                            word.vietnamese
                        )}" ("q" để trở về): `,
                        resolve
                    )
                );
                if (answer.toLowerCase() === "q") {
                    break; // Quay về menu chính
                }
                if (checkAnswer(word, answer, false)) {
                    console.log(
                        chalk.green(
                            `Đúng! ${chalk.bold.green(
                                word.vietnamese
                            )} có nghĩa là ${chalk.bold.blue(
                                word.english
                            )} (${chalk.white(word.type)}).`
                        )
                    );
                    incorrectWords.splice(index, 1);
                } else {
                    console.log(
                        chalk.yellow(
                            `Sai! Đáp án đúng là ${chalk.bold.blue(
                                word.english
                            )} (${chalk.white(word.type)}).`
                        )
                    );
                }
            } else {
                console.log(chalk.yellow("Lựa chọn không hợp lệ."));
            }

            await pause(); // Yêu cầu nhấn Enter để tiếp tục
            clearScreen(); // Làm sạch màn hình sau khi nhấn Enter
        }

        if (incorrectWords.length === 0) {
            console.log(
                chalk.green("Chúc mừng! Bạn đã hoàn thành tất cả từ vựng.")
            );
            await pause(); // Yêu cầu nhấn Enter để kết thúc chương trình
            clearScreen(); // Làm sạch màn hình trước khi thoát
            process.exit(0); // Thoát chương trình ngay lập tức
        }
    }
}

// Chạy chương trình
(async () => {
    const vocabulary = await loadVocabulary();
    await practiceVocabulary(vocabulary);
})();
