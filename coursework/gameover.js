function gameover() {
    const ending = localStorage.getItem('ending');
    const score = localStorage.getItem('score');
    const clics = localStorage.getItem('clics');
    const name = localStorage.getItem('name');
    const time = localStorage.getItem('time');
    const leaders = JSON.parse(localStorage.getItem('leaders'));

    const restartButton = document.getElementById('restartButton');
    const leadersButton = document.getElementById('leadersButton');
    const gameoverWindow = document.getElementById('gameover');
    const leadersWindow = document.getElementById('leaders');
    const resetLeadersButton = document.getElementById('resetLeadersButton');

    if (ending === 'gameWon') {
        gameoverWindow.getElementsByTagName('p')[0].innerText = `Поздравляем ${name}, вы набрали ${score} очков за ${clics} кликов и за время ${time}.`;

    } else if (ending === 'gameLose') {
        gameoverWindow.getElementsByTagName('h1')[0].innerText = 'Вы проиграли!';
        gameoverWindow.getElementsByTagName('p')[0].innerText = `К сожалению, ${name}, вы набрали всего ${score} очков за ${clics} кликов и за время ${time}.`;
    }


    restartButton.addEventListener('click', () => {
        location.href = 'index.html';
    })

    leadersButton.addEventListener('click', () => {
        gameoverWindow.style.display = 'none';
        leadersWindow.style.display = 'flex';
        if (leaders === null) {
            leadersWindow.getElementsByTagName('ol')[0].innerHTML = 'Лидеры отсутствуют';
        }
        for (let i = 0; i < leaders.length; i++) {
            leadersWindow.getElementsByTagName('ol')[0].innerHTML += `<li><span>${leaders[i].name}</span> <span>очки: ${leaders[i].score}</span> <span>клики: ${leaders[i].clics}</span> <span>время: ${leaders[i].time}</span></li>`
        }
    })

    resetLeadersButton.addEventListener('click', () => {
        localStorage.removeItem('leaders');
        location.reload();
    })
}

gameover();