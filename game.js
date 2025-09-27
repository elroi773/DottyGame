class FallingFaceGame {
    constructor() {
        this.gameContainer = document.getElementById('gameContainer');
        this.player = document.getElementById('player');
        this.playerX = window.innerWidth / 2 - 40; // 플레이어 중앙 위치
        this.playerSpeed = 8;
        this.targetCount = 0;
        this.score = 0;
        this.lives = 3;
        this.gameActive = true;
        this.fallingItems = [];
        this.spawnRate = 1200;
        this.fallSpeed = 3;
        this.keys = {};
        
        // 모바일 컨트롤용 터치 상태
        this.leftPressed = false;
        this.rightPressed = false;
        
        this.init();
    }
    
    init() {
        this.updatePlayerPosition();
        this.updateUI();
        this.startSpawning();
        this.gameLoop();
        this.setupEventListeners();
        this.setupMobileControls();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            e.preventDefault();
        });
        
        document.getElementById('restartBtn')?.addEventListener('click', () => {
            this.restart();
        });

        document.getElementById('nextPageBtn')?.addEventListener('click', () => {
            window.location.href = './photocard.html';
        });
    }
    
    setupMobileControls() {
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        
        if (leftBtn && rightBtn) {
            // 왼쪽 버튼 이벤트
            leftBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.leftPressed = true;
            });
            
            leftBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.leftPressed = false;
            });
            
            leftBtn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.leftPressed = false;
            });
            
            // 마우스 이벤트도 추가 (데스크톱에서 테스트용)
            leftBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.leftPressed = true;
            });
            
            leftBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.leftPressed = false;
            });
            
            leftBtn.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.leftPressed = false;
            });
            
            // 오른쪽 버튼 이벤트
            rightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.rightPressed = true;
            });
            
            rightBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.rightPressed = false;
            });
            
            rightBtn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.rightPressed = false;
            });
            
            // 마우스 이벤트도 추가 (데스크톱에서 테스트용)
            rightBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.rightPressed = true;
            });
            
            rightBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.rightPressed = false;
            });
            
            rightBtn.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.rightPressed = false;
            });
        }
    }
    
    updatePlayerPosition() {
        this.player.style.left = this.playerX + 'px';
    }
    
    handlePlayerMovement() {
        if (!this.gameActive) return;
        
        let moved = false;
        
        // 키보드 입력
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.playerX -= this.playerSpeed;
            moved = true;
        }
        
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.playerX += this.playerSpeed;
            moved = true;
        }
        
        // 모바일 터치 입력
        if (this.leftPressed) {
            this.playerX -= this.playerSpeed;
            moved = true;
        }
        
        if (this.rightPressed) {
            this.playerX += this.playerSpeed;
            moved = true;
        }
        
        // 화면 경계 체크
        const playerWidth = window.innerWidth <= 480 ? 90 : window.innerWidth <= 768 ? 120 : 200;
        this.playerX = Math.max(0, Math.min(window.innerWidth - playerWidth, this.playerX));
        
        if (moved) {
            this.updatePlayerPosition();
        }
    }
    
    createFallingItem() {
        const item = document.createElement('img');
        item.classList.add('falling-item');
        
        const isTarget = Math.random() > 0.4;
        
        if (isTarget) {
            item.src = './img/face.png';
            item.dataset.type = 'target';
            item.style.width = '40px';
            item.style.height = '40px';
            const speedVariation = 0.5 + Math.random() * 0.3; 
            item.dataset.speed = (this.fallSpeed * speedVariation).toString();
        } else {
            item.src = './img/Dotty_face.png';
            item.dataset.type = 'dotty';
            item.style.width = '130px';
            item.style.height = '150px';
            const speedVariation = 1.0 + Math.random() * 0.5;
            item.dataset.speed = (this.fallSpeed * speedVariation).toString();
        }
        
        item.style.position = 'absolute';
        const x = Math.random() * (window.innerWidth - parseInt(item.style.width));
        item.style.left = x + 'px';
        item.style.top = '-50px';
        
        this.gameContainer.appendChild(item);
        this.fallingItems.push(item);
    }
    
    checkCollisions() {
        const playerWidth = window.innerWidth <= 480 ? 90 : window.innerWidth <= 768 ? 120 : 200;
        const playerHeight = window.innerWidth <= 480 ? 90 : window.innerWidth <= 768 ? 120 : 200;
        const bottomOffset = window.innerWidth <= 768 ? 10 : 20;
        
        const playerRect = {
            left: this.playerX,
            right: this.playerX + playerWidth,
            top: window.innerHeight - playerHeight - bottomOffset,
            bottom: window.innerHeight - bottomOffset
        };
        
        for (let i = this.fallingItems.length - 1; i >= 0; i--) {
            const item = this.fallingItems[i];
            const itemRect = item.getBoundingClientRect();
            
            if (itemRect.left < playerRect.right &&
                itemRect.right > playerRect.left &&
                itemRect.top < playerRect.bottom &&
                itemRect.bottom > playerRect.top) {
                
                this.handleCatch(item, itemRect);
            }
        }
    }

    handleCatch(item, itemRect) {
        const type = item.dataset.type;
        const centerX = itemRect.left + itemRect.width / 2;
        const centerY = itemRect.top + itemRect.height / 2;
        
        let audio;
        if (type === 'target') {
            audio = new Audio('./audio/hoitza.mp3');
        } else {
            audio = new Audio('./audio/zaitho.mp3');
        }
        audio.play().catch(() => {
            // 오디오 재생 실패시 무시 (모바일에서 자주 발생)
        });
        
        if (type === 'target') {
            this.targetCount++;
            this.score += 100;
            this.createScorePopup(centerX, centerY, '+100', 'positive');
            this.createCatchEffect(centerX, centerY, 'catch-effect');
            
            this.player.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.player.style.transform = 'scale(1)';
            }, 200);
            
            if (this.targetCount >= 5) {
                this.gameWin();
            }
        } else {
            this.lives--;
            this.score = Math.max(0, this.score - 30);
            this.createScorePopup(centerX, centerY, '-30', 'negative');
            this.createCatchEffect(centerX, centerY, 'miss-effect');
            
            this.player.style.transform = 'scale(0.8)';
            this.player.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                this.player.style.transform = 'scale(1)';
                this.player.style.filter = 'none';
            }, 300);
            
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
        
        this.removeItem(item);
        this.updateUI();
    }
    
    createCatchEffect(x, y, className) {
        const effect = document.createElement('div');
        effect.classList.add(className);
        effect.style.left = (x - 30) + 'px';
        effect.style.top = (y - 30) + 'px';
        this.gameContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 600);
    }
    
    createScorePopup(x, y, text, type) {
        const popup = document.createElement('div');
        popup.classList.add('score-popup', type);
        popup.textContent = text;
        popup.style.left = (x - 30) + 'px';
        popup.style.top = (y - 40) + 'px';
        this.gameContainer.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }
    
    removeItem(item) {
        const index = this.fallingItems.indexOf(item);
        if (index > -1) {
            this.fallingItems.splice(index, 1);
        }
        if (item.parentNode) {
            item.parentNode.removeChild(item);
        }
    }
    
    updateFallingItems() {
        for (let i = this.fallingItems.length - 1; i >= 0; i--) {
            const item = this.fallingItems[i];
            const currentTop = parseFloat(item.style.top);
            const speed = parseFloat(item.dataset.speed);
            const newTop = currentTop + speed;
            
            item.style.top = newTop + 'px';
            
            if (newTop > window.innerHeight) {
                this.removeItem(item);
            }
        }
    }
    
    startSpawning() {
        this.spawnInterval = setInterval(() => {
            if (this.gameActive) {
                this.createFallingItem();
                if (this.spawnRate > 400) {
                    this.spawnRate -= 8;
                }
                if (this.fallSpeed < 6) {
                    this.fallSpeed += 0.02;
                }
            }
        }, this.spawnRate);
    }
    
    gameLoop() {
        if (this.gameActive) {
            this.handlePlayerMovement();
            this.updateFallingItems();
            this.checkCollisions();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateUI() {
        document.getElementById('targetCount').textContent = this.targetCount;
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
    }
    
    gameWin() {
        this.gameActive = false;
        clearInterval(this.spawnInterval);
        this.clearGame();
        window.location.href = './victory.html';
    }
    
    gameOver() {
        this.gameActive = false;
        clearInterval(this.spawnInterval);
        this.clearGame();
        window.location.href = './fail.html';
    }
    
    clearGame() {
        this.fallingItems.forEach(item => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
        });
        this.fallingItems = [];
    }
    
    restart() {
        this.targetCount = 0;
        this.score = 0;
        this.lives = 3;
        this.gameActive = true;
        this.fallingItems = [];
        this.spawnRate = 1200;
        this.fallSpeed = 3;
        this.playerX = window.innerWidth / 2 - 40;
        this.leftPressed = false;
        this.rightPressed = false;
        this.keys = {};
        
        this.clearGame();
        document.getElementById('gameOver').style.display = 'none';
        this.updatePlayerPosition();
        this.updateUI();
        this.startSpawning();
    }
}

window.addEventListener('load', () => {
    new FallingFaceGame();
});

// 새 모션
const bird = document.getElementById("bird");
const birdFrames = ["./img/bird1.png", "./img/bird2.png"];
let currentFrame = 0;

setInterval(() => {
    currentFrame = (currentFrame + 1) % birdFrames.length;
    bird.src = birdFrames[currentFrame];
}, 200);

// 페이지가 로드될 때 터치 스크롤 방지
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });