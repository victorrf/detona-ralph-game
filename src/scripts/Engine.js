const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        curretTime: 60,
        life: 3,
    },
    actions: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    }
};

function countDown() {
    state.values.curretTime--;
    state.view.timeLeft.textContent = state.values.curretTime;

    if (state.values.curretTime <= 0) {
        clearInterval(state.actions.countDownTimerId)
        clearInterval(state.actions.timerId)
        playSound("timeout");

        setTimeout(() => {
            alert("Fim de jogo! O tempo acabou. \nPontuação final: " + state.values.result);

            const playerName = prompt("Digite seu nome para salvar no ranking: ");

            if (playerName) {
                saveScore(playerName, state.values.result);
            }

            showLeaderboard();

            window.location.reload();
        }, 500);
    }
}

function gameOver() {
        clearInterval(state.actions.countDownTimerId)
        clearInterval(state.actions.timerId)
        playSound("gameover");

        setTimeout(() => {
            alert("Fim de jogo! Suas vidas acabaram. \nPontuação final: " + state.values.result);

            const playerName = prompt("Digite seu nome para salvar no ranking: ");

            if (playerName) {
                saveScore(playerName, state.values.result);
            }

            showLeaderboard();

            window.location.reload();
        }, 500);
}

function saveScore(playerName, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({ name: playerName, score: score});
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    let message = "🏆 Top 5 Jogadores:\n\n";

    if (leaderboard.length === 0) {
        message += "Nenhuma pontuação ainda!";
    } else {
        leaderboard.forEach((entry, index) => {
            message += `${index + 1}. ${entry.name} - ${entry.score} pts\n`;
        });
    }

    alert(message);
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.mp3`);
    audio.volume = 0.5;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(square.id === state.values.hitPosition) {
                state.values.result++
                state.view.score.textContent = state.values.result;
                square.classList.add("hit")
                playSound("doh");

                setTimeout(() => {
                    square.classList.remove("hit");
                }, 300);
                state.values.hitPosition = null;
            } else if (state.values.hitPosition !== null) {
                state.values.life--
                state.view.lives.textContent = state.values.life;
                square.classList.add("miss");
                playSound("broken");

                setTimeout(() => {
                    square.classList.remove("miss");
                }, 300);

                if (state.values.life < 0) {
                    gameOver();
                }
            }
        });
    });
}

function initialize() {
    addListenerHitBox();
}

initialize();