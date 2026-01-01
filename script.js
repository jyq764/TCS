// 游戏常量
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_COUNT = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SPEED = 150;

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

// 游戏变量
let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = INITIAL_SPEED;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

// 初始化游戏
function initGame() {
    // 设置初始蛇位置（居中）
    snake = [
        { x: Math.floor(CELL_COUNT / 2), y: Math.floor(CELL_COUNT / 2) },
        { x: Math.floor(CELL_COUNT / 2) - 1, y: Math.floor(CELL_COUNT / 2) },
        { x: Math.floor(CELL_COUNT / 2) - 2, y: Math.floor(CELL_COUNT / 2) }
    ];
    
    // 重置方向
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    
    // 重置分数
    score = 0;
    updateScore();
    
    // 生成初始食物
    generateFood();
    
    // 更新最高分显示
    highScoreElement.textContent = highScore;
    
    // 使用滑块当前值作为初始速度
    gameSpeed = parseInt(speedSlider.value);
    updateSpeedDisplay(gameSpeed);
    
    // 启动游戏
    gameRunning = true;
    gamePaused = false;
    
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    gameLoop = setInterval(gameStep, gameSpeed);
}

// 生成食物
function generateFood() {
    // 确保食物不会出现在蛇身上
    do {
        food.x = Math.floor(Math.random() * CELL_COUNT);
        food.y = Math.floor(Math.random() * CELL_COUNT);
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        // 蛇头颜色不同
        if (index === 0) {
            ctx.fillStyle = '#45a049';
        }
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    
    // 绘制食物
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    
    // 绘制暂停信息
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏暂停', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        ctx.font = '16px Arial';
        ctx.fillText('按空格键继续', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40);
    }
}

// 游戏主循环
function gameStep() {
    if (gamePaused) {
        drawGame();
        return;
    }
    
    // 更新方向
    direction = nextDirection;
    
    // 移动蛇
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // 将新头部添加到蛇的前端
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
    } else {
        // 移除蛇尾
        snake.pop();
    }
    
    // 检查碰撞
    if (checkCollision()) {
        endGame();
        return;
    }
    
    // 绘制游戏
    drawGame();
}

// 检查碰撞（墙壁或自身）
function checkCollision() {
    const head = snake[0];
    
    // 墙壁碰撞
    if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
        return true;
    }
    
    // 自身碰撞
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 更新分数显示
function updateScore() {
    scoreElement.textContent = score;
    
    // 更新最高分
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }
}

// 结束游戏
function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // 显示游戏结束信息
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    ctx.font = '16px Arial';
    ctx.fillText(`最终得分: ${score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40);
    ctx.fillText('按重新开始按钮继续', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 70);
}

// 处理键盘输入
function handleKeyPress(event) {
    // 防止默认行为
    event.preventDefault();
    
    // 方向控制
    const key = event.key.toLowerCase();
    
    // 仅在游戏运行时处理方向键
    if (gameRunning && !gamePaused) {
        // 上
        if ((key === 'arrowup' || key === 'w') && direction.y === 0) {
            nextDirection = { x: 0, y: -1 };
        }
        // 下
        else if ((key === 'arrowdown' || key === 's') && direction.y === 0) {
            nextDirection = { x: 0, y: 1 };
        }
        // 左
        else if ((key === 'arrowleft' || key === 'a') && direction.x === 0) {
            nextDirection = { x: -1, y: 0 };
        }
        // 右
        else if ((key === 'arrowright' || key === 'd') && direction.x === 0) {
            nextDirection = { x: 1, y: 0 };
        }
    }
    
    // 空格键暂停/继续
    if (key === ' ' && gameRunning) {
        gamePaused = !gamePaused;
    }
}

// 更新速度显示
function updateSpeedDisplay(speed) {
    speedValue.textContent = speed + 'ms';
}

// 处理速度滑块变化
function handleSpeedChange() {
    gameSpeed = parseInt(speedSlider.value);
    updateSpeedDisplay(gameSpeed);
    
    // 如果游戏正在运行且未暂停，更新游戏循环速度
    if (gameRunning && !gamePaused) {
        clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, gameSpeed);
    }
}

// 事件监听器
window.addEventListener('keydown', handleKeyPress);
resetBtn.addEventListener('click', initGame);
speedSlider.addEventListener('input', handleSpeedChange);

// 启动游戏
initGame();

// 绘制初始游戏画面
drawGame();

// 防止方向快速切换导致的问题
setInterval(() => {
    if (gameRunning && !gamePaused) {
        direction = nextDirection;
    }
}, gameSpeed / 2);
