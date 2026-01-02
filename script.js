// 游戏常量
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_COUNT = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SPEED = 150;

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置高DPI画布
function setupHighDPICanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    
    canvas.style.width = CANVAS_SIZE + 'px';
    canvas.style.height = CANVAS_SIZE + 'px';
    
    ctx.scale(dpr, dpr);
    
    return dpr;
}

const dpr = setupHighDPICanvas();
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
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制网格背景
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CELL_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
        ctx.stroke();
    }
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        const x = segment.x * GRID_SIZE;
        const y = segment.y * GRID_SIZE;
        const size = GRID_SIZE - 2;
        const radius = 6;
        
        // 创建渐变
        const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
        
        if (index === 0) {
            // 蛇头 - 更亮的绿色渐变
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, '#00cc6a');
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 10;
        } else {
            // 蛇身 - 绿色渐变，越往后越暗
            const brightness = Math.max(0.4, 1 - (index / snake.length) * 0.6);
            gradient.addColorStop(0, `rgba(76, 175, 80, ${brightness})`);
            gradient.addColorStop(1, `rgba(69, 160, 73, ${brightness})`);
            ctx.shadowColor = 'rgba(76, 175, 80, 0.5)';
            ctx.shadowBlur = 5;
        }
        
        // 绘制圆角矩形
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, size, size, radius);
        ctx.fill();
        
        // 添加高光效果
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(x + 3, y + 3, size / 2, size / 2, radius / 2);
        ctx.fill();
        
        // 蛇头添加眼睛
        if (index === 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            const eyeSize = 3;
            const eyeOffset = 5;
            
            if (direction.x === 1) {
                ctx.beginPath();
                ctx.arc(x + size - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.arc(x + size - eyeOffset, y + size - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            } else if (direction.x === -1) {
                ctx.beginPath();
                ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.arc(x + eyeOffset, y + size - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            } else if (direction.y === -1) {
                ctx.beginPath();
                ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.arc(x + size - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(x + eyeOffset, y + size - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.arc(x + size - eyeOffset, y + size - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
    
    // 绘制食物 - 红色圆形带发光效果
    const foodX = food.x * GRID_SIZE + GRID_SIZE / 2;
    const foodY = food.y * GRID_SIZE + GRID_SIZE / 2;
    const foodRadius = GRID_SIZE / 2 - 2;
    
    // 食物发光效果
    ctx.shadowColor = '#ff4757';
    ctx.shadowBlur = 15;
    
    // 食物渐变
    const foodGradient = ctx.createRadialGradient(foodX - 3, foodY - 3, 0, foodX, foodY, foodRadius);
    foodGradient.addColorStop(0, '#ff6b81');
    foodGradient.addColorStop(1, '#ff4757');
    
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 食物高光
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(foodX - 3, foodY - 3, foodRadius / 3, 0, Math.PI * 2);
    ctx.fill();
    
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

// 移动端控制按钮事件监听
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnPause = document.getElementById('btn-pause');

// 处理方向控制
function handleDirection(newDir) {
    if (gameRunning && !gamePaused) {
        if (newDir.x !== 0 && direction.x === 0) {
            nextDirection = newDir;
        } else if (newDir.y !== 0 && direction.y === 0) {
            nextDirection = newDir;
        }
    }
}

// 为上按钮添加事件
if (btnUp) {
    const handleUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDirection({ x: 0, y: -1 });
    };
    btnUp.addEventListener('click', handleUp);
    btnUp.addEventListener('touchstart', handleUp, { passive: false });
    btnUp.addEventListener('touchend', (e) => {
        e.preventDefault();
    });
}

// 为下按钮添加事件
if (btnDown) {
    const handleDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDirection({ x: 0, y: 1 });
    };
    btnDown.addEventListener('click', handleDown);
    btnDown.addEventListener('touchstart', handleDown, { passive: false });
    btnDown.addEventListener('touchend', (e) => {
        e.preventDefault();
    });
}

// 为左按钮添加事件
if (btnLeft) {
    const handleLeft = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDirection({ x: -1, y: 0 });
    };
    btnLeft.addEventListener('click', handleLeft);
    btnLeft.addEventListener('touchstart', handleLeft, { passive: false });
    btnLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
    });
}

// 为右按钮添加事件
if (btnRight) {
    const handleRight = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDirection({ x: 1, y: 0 });
    };
    btnRight.addEventListener('click', handleRight);
    btnRight.addEventListener('touchstart', handleRight, { passive: false });
    btnRight.addEventListener('touchend', (e) => {
        e.preventDefault();
    });
}

// 为暂停按钮添加事件
if (btnPause) {
    const handlePause = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (gameRunning) {
            gamePaused = !gamePaused;
            btnPause.textContent = gamePaused ? '继续' : '暂停';
        }
    };
    btnPause.addEventListener('click', handlePause);
    btnPause.addEventListener('touchstart', handlePause, { passive: false });
    btnPause.addEventListener('touchend', (e) => {
        e.preventDefault();
    });
}

// 启动游戏
initGame();

// 绘制初始游戏画面
drawGame();

// 画布触屏滑动控制
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
    
    handleSwipe();
}, { passive: false });

canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                handleDirection({ x: 1, y: 0 });
            } else {
                handleDirection({ x: -1, y: 0 });
            }
        }
    } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                handleDirection({ x: 0, y: 1 });
            } else {
                handleDirection({ x: 0, y: -1 });
            }
        }
    }
}

// 防止方向快速切换导致的问题
setInterval(() => {
    if (gameRunning && !gamePaused) {
        direction = nextDirection;
    }
}, gameSpeed / 2);
