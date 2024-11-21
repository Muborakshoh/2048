class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.best = parseInt(localStorage.getItem('best2048')) || 0;
        this.gameOver = false;
        this.init();
    }

    init() {
        this.createGrid();
        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
        this.setupEventListeners();
    }

    createGrid() {
        const gridContainer = document.querySelector('.grid');
        gridContainer.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gridContainer.appendChild(cell);
        }
    }

    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ x: i, y: j });
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const value = this.grid[i][j];
                const cell = cells[i * 4 + j];
                cell.textContent = value || '';
                cell.setAttribute('data-value', value);
            }
        }
        document.getElementById('score').textContent = this.score;
        document.getElementById('best').textContent = this.best;
    }

    move(direction) {
        if (this.gameOver) return;

        const originalGrid = JSON.stringify(this.grid);
        let moved = false;

        switch (direction) {
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
        }

        if (moved) {
            this.addNewTile();
            this.updateDisplay();
            this.checkGameOver();
        }
    }

    moveLeft() {
        return this.moveHorizontal('left');
    }

    moveRight() {
        return this.moveHorizontal('right');
    }

    moveUp() {
        return this.moveVertical('up');
    }

    moveDown() {
        return this.moveVertical('down');
    }

    moveHorizontal(direction) {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            if (direction === 'right') row.reverse();

            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }

            while (row.length < 4) {
                direction === 'left' ? row.push(0) : row.unshift(0);
            }

            if (direction === 'right') row.reverse();
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) moved = true;
            this.grid[i] = row;
        }
        return moved;
    }

    moveVertical(direction) {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = this.grid.map(row => row[j]).filter(cell => cell !== 0);
            if (direction === 'down') column.reverse();

            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }

            while (column.length < 4) {
                direction === 'up' ? column.push(0) : column.unshift(0);
            }

            if (direction === 'down') column.reverse();
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== column[i]) moved = true;
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    checkGameOver() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return;
                if (i < 3 && this.grid[i][j] === this.grid[i + 1][j]) return;
                if (j < 3 && this.grid[i][j] === this.grid[i][j + 1]) return;
            }
        }
        this.gameOver = true;
        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('best2048', this.best);
        }
        document.querySelector('.game-over').classList.remove('hidden');
        document.getElementById('final-score').textContent = this.score;
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.move(e.key);
            }
        });

        // Button controls
        document.querySelectorAll('.control-btn').forEach(button => {
            button.addEventListener('click', () => {
                const direction = button.getAttribute('data-direction');
                this.move(direction);
            });
        });

        document.getElementById('new-game').addEventListener('click', () => {
            this.grid = Array(4).fill().map(() => Array(4).fill(0));
            this.score = 0;
            this.gameOver = false;
            document.querySelector('.game-over').classList.add('hidden');
            this.init();
        });
    }
}

// Start the game
new Game2048();
