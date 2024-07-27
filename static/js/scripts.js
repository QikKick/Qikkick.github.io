function loadGame(level, isRestart = false) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.dataset.level = level; // Store the current level in the container's dataset
    gameContainer.innerHTML = ''; // Clear previous game

    if (isRestart) {
        switch(level) {
            case 1:
                loadMinesweeper(gameContainer);
                break;
            case 2:
                loadSudoku(gameContainer);
                break;
            case 3:
                loadQuiz(gameContainer);
                break;
            case 4:
                loadNumberGuessingGame(gameContainer);
                break;
            case 5:
                loadRiddleGame(gameContainer);
                break;
        }
    } else {
        switch(level) {
            case 1:
                loadMinesweeper(gameContainer);
                break;
            case 2:
                loadSudoku(gameContainer);
                break;
            case 3:
                loadQuiz(gameContainer);
                break;
            case 4:
                loadNumberGuessingGame(gameContainer);
                break;
            case 5:
                loadRiddleGame(gameContainer);
                break;
            default:
                gameContainer.innerHTML = '<h2>Congratulations! You have completed all levels.</h2>';
        }
    }
}
function loadMinesweeper(container) {
    container.innerHTML = '<h2>Minesweeper</h2>';
    const size = 10; // Change the size to 16x16
    const mines = 15; // Change the number of mines to 40
    const grid = createMinesweeperGrid(size, mines);
    container.appendChild(grid);
}

function createMinesweeperGrid(size, mines) {
    const grid = document.createElement('div');
    grid.className = 'minesweeper-grid';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Update the grid size

    const cells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => revealCell(cell, cells, size));
            grid.appendChild(cell);
            cells.push(cell);
        }
    }

    // Place mines
    let placedMines = 0;
    while (placedMines < mines) {
        const index = Math.floor(Math.random() * cells.length);
        const cell = cells[index];
        if (!cell.classList.contains('mine')) {
            cell.classList.add('mine');
            placedMines++;
        }
    }

    return grid;
}
function revealCell(cell, cells, size) {
    if (cell.classList.contains('mine')) {
        cell.innerHTML = '💣';
        cell.classList.add('revealed');
        showLosePopup();
    } else {
        const minesCount = countAdjacentMines(cell, cells, size);
        cell.innerHTML = minesCount;
        cell.classList.add('revealed');
        if (minesCount === 0) {
            revealAdjacentCells(cell, cells, size);
        }
        if (isGameWon(cells)) {
            showWinPopup();
        }
    }
}

function isGameWon(cells) {
    // The game is won if all non-mine cells are revealed
    return cells.every(cell => cell.classList.contains('mine') || cell.classList.contains('revealed'));
}

function showLosePopup() {
    const popup = document.createElement('div');
    popup.className = 'lose-popup';
    popup.innerHTML = '<h2>Game Over! You hit a mine.</h2>';

    const restartButton = document.createElement('button');
    restartButton.innerHTML = 'Restart Level';
    restartButton.addEventListener('click', () => {
        const gameContainer = document.getElementById('game-container');
        const currentLevel = parseInt(gameContainer.dataset.level);
        loadGame(currentLevel, true);
        document.body.removeChild(popup);
    });

    popup.appendChild(restartButton);
    document.body.appendChild(popup);
}

function showWinPopup() {
    const popup = document.createElement('div');
    popup.className = 'win-popup';
    popup.innerHTML = '<h2>Congratulations! You have completed this level.</h2>';

    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next Level';
    nextButton.addEventListener('click', () => {
        const gameContainer = document.getElementById('game-container');
        const currentLevel = parseInt(gameContainer.dataset.level);
        document.body.removeChild(popup);
        loadGame(currentLevel + 1);
    });

    popup.appendChild(nextButton);
    document.body.appendChild(popup);
}

function countAdjacentMines(cell, cells, size) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = row + i;
            const c = col + j;
            if (r >= 0 && r < size && c >= 0 && c < size) {
                const index = r * size + c;
                if (cells[index].classList.contains('mine')) {
                    count++;
                }
            }
        }
    }
    return count;
}

function revealAdjacentCells(cell, cells, size) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = row + i;
            const c = col + j;
            if (r >= 0 && r < size && c >= 0 && c < size) {
                const index = r * size + c;
                const adjacentCell = cells[index];
                if (!adjacentCell.classList.contains('revealed') && !adjacentCell.classList.contains('mine')) {
                    const minesCount = countAdjacentMines(adjacentCell, cells, size);
                    adjacentCell.innerHTML = minesCount;
                    adjacentCell.classList.add('revealed');
                    if (minesCount === 0) {
                        revealAdjacentCells(adjacentCell, cells, size);
                    }
                }
            }
        }
    }
}

function loadSudoku(container) {
    container.innerHTML = '<h2>Sudoku</h2>';
    fetch('/api/sudoku')
        .then(response => response.json())
        .then(data => {
            const puzzle = data.puzzle.split('').map(Number);
            const grid = createSudokuGrid(puzzle);
            container.appendChild(grid);
        });
}

function createSudokuGrid(puzzle) {
    const grid = document.createElement('div');
    grid.className = 'sudoku-grid';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'sudoku-cell';
            const value = puzzle[i * 9 + j];
            if (value !== 0) {
                cell.value = value;
                cell.readOnly = true;
            } else {
                cell.addEventListener('input', () => {
                    if (isSudokuCompleted(grid)) {
                        showWinPopup();
                    }
                });
            }
            grid.appendChild(cell);
        }
    }

    return grid;
}

function isSudokuCompleted(grid) {
    for (let i = 0; i < 9; i++) {
        const row = new Set();
        const col = new Set();
        const square = new Set();

        for (let j = 0; j < 9; j++) {
            const rowValue = grid.children[i * 9 + j].value;
            const colValue = grid.children[j * 9 + i].value;
            const squareValue = grid.children[3 * (Math.floor(i / 3) * 9 + Math.floor(j / 3)) + j % 3 + Math.floor(i % 3) * 9].value;

            row.add(rowValue);
            col.add(colValue);
            square.add(squareValue);
        }

        if (row.size !== 9 || col.size !== 9 || square.size !== 9) {
            return false;
        }
    }

    return true;
}

function loadQuiz(container) {
    container.innerHTML = '<h2>Complete the Sentence Quiz</h2>';

    const quizData = [
        {
            question: "What's the variable type called that is used for text?",
            choices: ["Integer", "Boolean", "String", "Float"],
            answer: "String"
        },
        {
            question: 'Finish the c++ code line "using namespace ___"',
            choices: ["Std", "Iostream", "Cstdlib", "Cmath"],
            answer: "Std"
        },
        {
            question: "What's the building called in Vilnius that you can reach the highest point above sea level?",
            choices: ["Gediminas Tower", "Europa Tower", "Helios Tower", "Vilnius TV Tower"],
            answer: "Helios Tower"
        },
        {
            question: "Does Emilis like cigarette smell?",
            choices: ["Yes", "No"],
            answer: "No"
        },
        {
            question: "Do you look pretty today?",
            choices: ["Yes", "No"],
            answer: "Yes"
        }
    ];

    const quiz = createQuizUI(quizData);
    container.appendChild(quiz);
}

function createQuizUI(quizData) {
    const container = document.createElement('div');
    container.className = 'quiz-container';

    quizData.forEach(data => {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';

        const question = document.createElement('h3');
        question.innerHTML = data.question;
        questionContainer.appendChild(question);

        data.choices.forEach(choice => {
            const choiceContainer = document.createElement('div');
            choiceContainer.className = 'choice-container';

            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.name = data.question;
            radioButton.value = choice;
            choiceContainer.appendChild(radioButton);

            const label = document.createElement('label');
            label.innerHTML = choice;
            choiceContainer.appendChild(label);

            questionContainer.appendChild(choiceContainer);
        });

        container.appendChild(questionContainer);
    });

    const submitButton = document.createElement('button');
    submitButton.innerHTML = 'Submit';
    submitButton.addEventListener('click', () => {
        quizData.forEach(data => {
            const questionContainers = Array.from(container.getElementsByClassName('question-container'));
            const questionContainer = questionContainers.find(container =>
                container.querySelector('h3').innerHTML === data.question
            );
            checkAnswer(data, questionContainer);
        });
    });
    container.appendChild(submitButton);

    return container;
}

function checkAnswer(quizData, quizContainer) {
    const selectedChoice = quizContainer.querySelector(`input[name="${quizData.question}"]:checked`).value;
    if (selectedChoice === quizData.answer) {
        showWinPopup();
    } else {
        showLosePopup();
    }
}

function loadNumberGuessingGame(container) {
    container.innerHTML = '';
    container.className = 'number-guessing-game-container';

    const title = document.createElement('h2');
    title.innerHTML = 'Number Guessing Game';
    container.appendChild(title);

    const secretNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    const label = document.createElement('label');
    label.innerHTML = 'Enter a number between 1 and 100';
    container.appendChild(label);

    const input = document.createElement('input');
    input.type = 'number';
    container.appendChild(input);

    const button = document.createElement('button');
    button.innerHTML = 'Guess';
    container.appendChild(button);

    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    container.appendChild(messageContainer);

    button.addEventListener('click', () => {
        const guess = parseInt(input.value);
        attempts++;
        if (guess === secretNumber) {
            messageContainer.innerHTML = `<h2>Congratulations! You found the number in ${attempts} attempts.</h2>`;
            button.disabled = true; // disable the button after guessing correctly
            showWinPopup(); // show the win popup
        } else if (guess < secretNumber) {
            messageContainer.innerHTML = '<p>Too low. Try again.</p>';
        } else {
            messageContainer.innerHTML = '<p>Too high. Try again.</p>';
        }
        input.value = ''; // clear the input field for the next guess
    });
}
function loadRiddleGame(container) {
    container.innerHTML = '<h2>Riddle Game</h2>';

    const riddle = "hirjbvearkga ulruse";
    const answer = "kalvariju hesburger";

    const riddleElement = document.createElement('p');
    riddleElement.className = 'riddle-text'; // Add the new CSS class
    riddleElement.innerHTML = riddle;
    container.appendChild(riddleElement);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Your answer here';
    container.appendChild(input);

    const button = document.createElement('button');
    button.innerHTML = 'Submit';
    button.addEventListener('click', () => {
        const userAnswer = input.value.toLowerCase();
        if (userAnswer === answer) {
            container.innerHTML = '<h2>Congratulations! You have solved the riddle, text me "Bananas are yellow".</h2>';
        } else {
            container.innerHTML += '<p>Wrong answer. Try again.</p>';
        }
    });
    container.appendChild(button);
}