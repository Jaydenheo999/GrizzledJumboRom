document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const solveButton = document.getElementById('solve-button');
    const resetButton = document.getElementById('reset-button');

    // Predefined Sudoku puzzle for the game-like feel
    const initialPuzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    // Create the Sudoku grid
    for (let i = 0; i < 81; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.setAttribute('data-index', i);
        input.oninput = handleInput;
        sudokuGrid.appendChild(input);
    }

    // Initialize the puzzle with predefined numbers
    function initializePuzzle() {
        const inputs = sudokuGrid.getElementsByTagName('input');
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            if (initialPuzzle[row][col] !== 0) {
                inputs[i].value = initialPuzzle[row][col];
                inputs[i].classList.add('fixed');
                inputs[i].readOnly = true;
            } else {
                inputs[i].value = '';
                inputs[i].classList.remove('fixed');
                inputs[i].readOnly = false;
            }
        }
    }

    function handleInput(e) {
        const value = e.target.value;
        if (!/^[1-9]$/.test(value)) {
            e.target.value = '';
        }
    }

    solveButton.addEventListener('click', () => {
        const board = getBoard();
        if (solveSudoku(board)) {
            setBoard(board);
        } else {
            alert('No solution found!');
        }
    });

    resetButton.addEventListener('click', initializePuzzle);

    function getBoard() {
        const inputs = sudokuGrid.getElementsByTagName('input');
        const board = Array.from({ length: 9 }, () => Array(9).fill(0));
        for (let input of inputs) {
            const index = parseInt(input.getAttribute('data-index'));
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = parseInt(input.value);
            if (!isNaN(value)) {
                board[row][col] = value;
            }
        }
        return board;
    }

    function setBoard(board) {
        const inputs = sudokuGrid.getElementsByTagName('input');
        for (let input of inputs) {
            const index = parseInt(input.getAttribute('data-index'));
            const row = Math.floor(index / 9);
            const col = index % 9;
            input.value = board[row][col] !== 0 ? board[row][col] : '';
        }
    }

    function isValid(board, num, pos) {
        const [row, col] = pos;

        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num && col !== i) {
                return false;
            }
            if (board[i][col] === num && row !== i) {
                return false;
            }
        }

        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num && (boxRow + i !== row || boxCol + j !== col)) {
                    return false;
                }
            }
        }

        return true;
    }

    function findEmpty(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null;
    }

    function solveSudoku(board) {
        const empty = findEmpty(board);
        if (!empty) {
            return true;
        }
        const [row, col] = empty;

        for (let num = 1; num <= 9; num++) {
            if (isValid(board, num, [row, col])) {
                board[row][col] = num;

                if (solveSudoku(board)) {
                    return true;
                }

                board[row][col] = 0;
            }
        }
        return false;
    }

    // Initialize the puzzle when the page loads
    initializePuzzle();
});