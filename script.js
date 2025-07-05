
const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const music = document.getElementById('music');
const crashSound = document.getElementById('crash');
const toggleSoundBtn = document.getElementById('toggleSound');
const restartBtn = document.getElementById('restartBtn');
const countdownEl = document.getElementById('countdown');

let player = { speed: 5, score: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let isMuted = false;

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
startScreen.addEventListener('click', start);
restartBtn.addEventListener('click', start);
toggleSoundBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    music.muted = isMuted;
    crashSound.muted = isMuted;
    toggleSoundBtn.textContent = isMuted ? '🔇' : '🔊';
});

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}
function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}
function isCollides(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(aRect.bottom < bRect.top || aRect.top > bRect.bottom || aRect.right < bRect.left || aRect.left > bRect.right);
}
function moveLines() {
    let lines = document.querySelectorAll('.lines');
    lines.forEach(item => {
        if (item.y >= 700) item.y -= 750;
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}
function moveEnemy(car) {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(item => {
        if (isCollides(car, item)) {
            crashSound.play();
            endGame();
        }
        if (item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + 'px';
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}
function gamePlay() {
    let car = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();
    if (player.start) {
        moveLines();
        moveEnemy(car);

        if (keys.ArrowUp && player.y > road.top + 70) player.y -= player.speed;
        if (keys.ArrowDown && player.y < road.bottom - 70) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < road.width - 50) player.x += player.speed;

        car.style.top = player.y + 'px';
        car.style.left = player.x + 'px';

        window.requestAnimationFrame(gamePlay);

        player.score++;
        score.innerText = "Score : " + player.score + " | High Score : " + localStorage.getItem('highScore');

        if (player.score % 1000 === 0) {
            player.speed += 1;
            car.classList.add('speedBoost');
            setTimeout(() => car.classList.remove('speedBoost'), 1000);
        }

        if (player.score % 2000 === 0) {
            let index = (player.score / 2000) % 2;
            document.querySelector('.carGame').style.backgroundImage = `url('bg${index}.png')`;
        }
    }
}
function endGame() {
    player.start = false;
    music.pause();
    let highScore = localStorage.getItem('highScore') || 0;
    if (player.score > highScore) {
        localStorage.setItem('highScore', player.score);
    }
    startScreen.innerHTML = `<p>Game Over!<br>Final Score: ${player.score}</p>`;
    restartBtn.classList.remove('hide');
    startScreen.classList.remove('hide');
}
function start() {
    gameArea.innerHTML = '';
    startScreen.classList.add('hide');
    restartBtn.classList.add('hide');
    music.currentTime = 0;
    music.play();

    player.start = true;
    player.score = 0;
    player.speed = 5;

    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'lines');
        roadLine.y = x * 150;
        roadLine.style.top = roadLine.y + 'px';
        gameArea.appendChild(roadLine);
    }

    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);
    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    let enemyTypes = ['enemy1', 'enemy2', 'enemy3'];
    for (let x = 0; x < 3; x++) {
        let enemyCar = document.createElement('div');
        let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        enemyCar.setAttribute('class', 'enemy ' + type);
        enemyCar.y = (x + 1) * 350 * -1;
        enemyCar.style.top = enemyCar.y + 'px';
        enemyCar.style.left = Math.floor(Math.random() * 350) + 'px';
        gameArea.appendChild(enemyCar);
    }

    score.innerText = "Score : 0 | High Score : " + (localStorage.getItem('highScore') || 0);

    let count = 3;
    countdownEl.classList.remove('hide');
    countdownEl.innerText = count;
    let countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.innerText = count;
        } else {
            clearInterval(countdownInterval);
            countdownEl.classList.add('hide');
            window.requestAnimationFrame(gamePlay);
        }
    }, 1000);
}
