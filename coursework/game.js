function game() {
    const difficulty = localStorage.getItem('difficulty') || 'easy';
    const name = localStorage.getItem('name');
    const nameBlock = document.getElementById('name');
    const windowBlock = document.getElementById('window');
    const pyramidBlock = document.getElementById('pyramid');
    const returnButton = document.getElementById('return');
    const changeColorButton = document.getElementById('changeColor');
    const clicsBlock = document.getElementById('clics');
    const scoresBlock = document.getElementById('score');
    const remainsBlock = document.getElementById('remains');
    const stick = document.getElementById('stick');
    const timerBlock = document.getElementById('timer');
    let seconds = 0;
    let minutes = 0;

    function startTimer() {
        setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        timerBlock.innerHTML = `Текущее время: ${formatTime(minutes)}:${formatTime(seconds)}`;
    }

    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    let clics = 0;
    let score = 0;
    let difficultyCoefficient = 1;
    nameBlock.innerText = 'Игрок: ' + name;

    const ringClasses = Object.freeze({
        0: 'ring-one',
        1: 'ring-two',
        2: 'ring-three',
        3: 'ring-four',
        4: 'ring-five',
        5: 'ring-six',
        6: 'ring-seven',
        7: 'ring-eight',
        8: 'ring-nine',
        9: 'ring-ten',
    });

    const rectClasses = Object.freeze({
        0: 'rect-one',
        1: 'rect-two',
        2: 'rect-three',
        3: 'rect-four',
        4: 'rect-five',
        5: 'rect-six',
        6: 'rect-seven',
        7: 'rect-eight',
        8: 'rect-nine',
        9: 'rect-ten',
    })

    const colors = [
        'rgb(165, 87, 42)',
        'rgb(0, 0, 255)',
        'rgb(128, 0, 128)',
        'rgb(165, 42, 42)',
        'rgb(255, 0, 0)',
        'rgb(255, 255, 0)',
        'rgb(255, 165, 0)',
        'rgb(255, 192, 203)',
        'rgb(0, 255, 255)',
        'rgb(0, 0, 0)',
        'rgb(128, 128, 128)',
        'rgb(0, 128, 128)'];

    const gameoverEndings = Object.freeze({
        'won': 'gameWon',
        'lose': 'gameLose',
    })

    const newRing = (className) => {
        let ring = document.createElement('div');
        ring.classList.add(className);
        ring.classList.add('moveable');
        windowBlock.appendChild(ring);
        moveRing(ring);
        return ring;
    }

    const moveRing = (ring) => {
        const maxY = windowBlock.clientHeight - ring.offsetHeight;
        const maxX = windowBlock.clientWidth - ring.offsetWidth;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        ring.style.top = randomY + 'px';
        ring.style.left = randomX + 'px';
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function gameover(ending) {
        localStorage.setItem('ending', ending);
        localStorage.setItem('score', score);
        localStorage.setItem('clics', clics);
        let time = `${formatTime(minutes)}:${formatTime(seconds)}`;
        localStorage.setItem('time', time);
        const leaders = JSON.parse(localStorage.getItem('leaders'));
        if (leaders === null) {
            localStorage.setItem('leaders', JSON.stringify([{ 'name': name, 'score': score, 'clics': clics, 'time': time }]));
        } else {
            leaders.push({ 'name': name, 'score': score, 'clics': clics, 'time': time });
            leaders.sort((a, b) => {
                if (a.score === b.score) {
                    if (a.clics === b.clics) {
                        if (a.time > b.time) {
                            return 1;
                        }
                    }
                }
                return b.score - a.score;
            });
            if (leaders.length > 10) {
                leaders.length = 10;
            }
            localStorage.setItem('leaders', JSON.stringify(leaders));
        }
        location.href = 'gameover.html';
    }

    function changeColor(rings, rectangles, removedRings) {
        for (let i = colors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]];
        }
        rings.forEach((element, index) => {
            element.style.borderColor = colors[index % colors.length];
        });
        rectangles.forEach((element, index) => {
            element.style.backgroundColor = colors[index % colors.length];
        })
        removedRings.forEach((element, index) => {
            element.style.borderColor = colors[index % colors.length];
        })
    }

    switch (difficulty) {
        case 'easy':
            easy();
            break;
        case 'medium':
            medium();
            break;
        case 'hard':
            hard();
            break;
        default:
            easy();
            break;
    }
    function easy() {
        document.getElementById('difficulty').innerText = 'Сложность: легкая';
        const rings = [];
        const rectangles = [];
        const removedRings = [];
        for (let i = 0; i < getRandomInt(4, 10); i++) {
            rings.push(newRing(ringClasses[i]));
        }
        changeColor(rings, rectangles, removedRings);
        stick.style.height = (rings.length * 4.16) + '%';
        let remainingRings = rings.length;
        remainsBlock.innerText = `Осталось: ${remainingRings}`;
        let order = rings.length - 1;
        let game = true;
        for (let i = 0; i < rings.length; i++) {
            rings[i].addEventListener('click', () => {
                if (ringClasses[order] === rings[i].classList[0]) {
                    score += 10 * difficultyCoefficient;
                    scoresBlock.innerText = `Очки: ${score}`;
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                    order--;
                    remainingRings--;
                    remainsBlock.innerText = `Осталось: ${remainingRings}`;
                    rings[i].remove();
                    let rectangle = document.createElement('div');
                    rectangle.classList.add(rectClasses[i]);
                    rectangle.style.backgroundColor = rings[i].style.borderColor;
                    pyramidBlock.appendChild(rectangle);
                    rectangles.push(rectangle);
                } else {
                    alert('Неправильно!');
                    score -= 10;
                    scoresBlock.innerText = `Очки: ${score}`;
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                }
            })
        }

        changeColorButton.addEventListener('click', () => {
            changeColor(rings, rectangles, removedRings);
        })

        let gameProcess = setInterval(() => {
            if (game) {
                if (order === -1) {
                    game = false;
                    // gameover(gameoverEndings.won);
                    // clearInterval(gameProcess);
                    rectangles.forEach(rectangle => {
                        rectangle.style.display = 'none';
                    })
                    medium();
                }
            }
        }, 10)
    }

    function medium() {
        function collision(ring, pyramidBlock) {
            const { left: ringLeft, top: ringTop } = ring.getBoundingClientRect();
            const { left: blockLeft, top: blockTop } = pyramidBlock.getBoundingClientRect();

            return ringLeft >= blockLeft && ringLeft <= blockLeft + pyramidBlock.offsetWidth && ringTop >= blockTop && ringTop <= blockTop + pyramidBlock.offsetHeight;
        }

        function checkCollisions(ring, pyramidBlock) {
            if (collision(ring, pyramidBlock)) {
                removedRings.push(ring);
                ring.style.display = 'none';
                let rectangle = document.createElement('div');
                rectangle.classList.add(rectClasses[rings.indexOf(ring)]);
                rectangle.style.backgroundColor = ring.style.borderColor;
                pyramidBlock.appendChild(rectangle);
                rectangles.push(rectangle);
                if (ringClasses[order] === ring.classList[0]) {
                    score += 15 * difficultyCoefficient;
                    scoresBlock.innerText = `Очки: ${score}`;
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                    order--;
                    remainingRings--;
                    remainsBlock.innerText = `Осталось: ${remainingRings}`;
                } else {

                    score -= 30 * difficultyCoefficient;
                    scoresBlock.innerText = `Очки: ${score}`;

                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                }
            }
        }

        function mouseDown(e) {
            const ring = e.target;
            const ringArea = ring.parentElement;

            const { clientX: mouseLeft, clientY: mouseTop } = e;
            const { left: ringLeft, top: ringTop } = ring.getBoundingClientRect();
            const { left: areaLeft, top: areaTop } = ringArea.getBoundingClientRect();

            const shiftX = mouseLeft - ringLeft + areaLeft;
            const shiftY = mouseTop - ringTop + areaTop;

            previusZIndex = ring.style.zIndex;
            ring.style.zIndex = 20;
            ring.style.cursor = 'grabbing';

            function moveAt(x, y) {
                ring.style.left = x + 'px';
                ring.style.top = y + 'px';
            }

            function mouseMove(e) {
                moveAt(e.pageX - shiftX, e.pageY - shiftY);
            }

            function mouseUp() {
                ring.style.zIndex = previusZIndex;
                ring.style.cursor = 'grab';
                ring.removeEventListener('mouseup', mouseUp);
                document.removeEventListener('mousemove', mouseMove);
                checkCollisions(ring, pyramidBlock);
            }

            ring.addEventListener('mouseup', mouseUp);
            document.addEventListener('mousemove', mouseMove);
        }
        document.getElementById('difficulty').innerText = 'Сложность: средняя';
        difficultyCoefficient = 2;
        const rings = [];
        const rectangles = [];
        const removedRings = [];
        returnButton.style.display = 'flex';
        returnButton.addEventListener('click', () => {
            for (let i = 0; i < rectangles.length; i++) {
                pyramidBlock.removeChild(rectangles[i]);
            }
            rectangles.length = 0;
            for (let i = 0; i < removedRings.length; i++) {
                windowBlock.appendChild(removedRings[i]);
                removedRings[i].style.display = 'block';
                removedRings[i].classList.add('moveable');
                removedRings[i].removeEventListener('mousedown', mouseDown);
                moveRing(removedRings[i]);
            }
            setTimeout(() => {
                for (let i = 0; i < removedRings.length; i++) {
                    removedRings[i].classList.remove('moveable');
                    removedRings[i].addEventListener('mousedown', mouseDown)
                }
                removedRings.length = 0;
            }, 2000)
            order = rings.length - 1;
            remainingRings = rings.length;
            remainsBlock.innerText = `Осталось: ${remainingRings}`;
            clics++;
            score -= 50;
            scoresBlock.innerText = `Очки: ${score}`;

        })
        for (let i = 0; i < getRandomInt(6, 10); i++) {
            rings.push(newRing(ringClasses[i]));
        }
        changeColor(rings, rectangles, removedRings);
        stick.style.height = (rings.length * 4.16) + '%';
        let remainingRings = rings.length;
        remainsBlock.innerText = `Осталось: ${remainingRings}`;
        changeColorButton.addEventListener('click', () => {
            changeColor(rings, rectangles, removedRings);
        })
        setTimeout(() => {
            rings.forEach((element) => {
                element.classList.remove('moveable');
                element.addEventListener('mousedown', mouseDown)
                element.ondragstart = () => false;
                element.onselectstart = () => false;
                element.style.cursor = 'grab';
            })
            windowBlock.style.overflow = 'visible';
        }, 50)

        let order = rings.length - 1;

        let gameProcess = setInterval(() => {
            if (game) {
                if (order === -1) {
                    game = false;
                    rectangles.forEach(rectangle => {
                        rectangle.style.display = 'none';
                    })
                    removedRings.length = 0;
                    hard();
                    clearInterval(gameProcess);
                }
                if (order !== -1 && rectangles.length === rings.length) {
                    game = false;
                    gameover(gameoverEndings.lose);
                    clearInterval(gameProcess);
                }
            }
        }, 10)
    }

    function hard() {
        windowBlock.style.overflow = 'hidden';
        document.getElementById('difficulty').innerText = 'Сложность: сложная';
        difficultyCoefficient = 3;
        const rings = [];
        const rectangles = [];
        const removedRings = [];
        returnButton.style.display = 'flex';
        returnButton.addEventListener('click', () => {
            for (let i = 0; i < rectangles.length; i++) {
                pyramidBlock.removeChild(rectangles[i]);
            }
            rectangles.length = 0;
            for (let i = 0; i < removedRings.length; i++) {
                windowBlock.appendChild(removedRings[i]);
                removedRings[i].style.display = 'block';
                moveRing(removedRings[i]);
            }
            removedRings.length = 0;
            order = rings.length - 1;
            remainingRings = rings.length;
            remainsBlock.innerText = `Осталось: ${remainingRings}`;
            clics++;
            if (score > 0) {
                score -= 15;
                scoresBlock.innerText = `Очки: ${score}`;
            }
        })
        for (let i = 0; i < getRandomInt(7, 10); i++) {
            rings.push(newRing(ringClasses[i]));
        }
        changeColor(rings, rectangles, removedRings);
        stick.style.height = (rings.length * 4.16) + '%';
        let remainingRings = rings.length;
        remainsBlock.innerText = `Осталось: ${remainingRings}`;
        changeColorButton.addEventListener('click', () => {
            changeColor(rings, rectangles, removedRings);
        })
        let order = rings.length - 1;
        let game = true;
        for (let i = 0; i < rings.length; i++) {
            rings[i].addEventListener('dblclick', () => {
                removedRings.push(rings[i]);
                rings[i].style.display = 'none';
                let rectangle = document.createElement('div');
                rectangle.classList.add(rectClasses[i]);
                rectangle.style.backgroundColor = rings[i].style.borderColor;
                pyramidBlock.appendChild(rectangle);
                rectangles.push(rectangle);
                if (ringClasses[order] === rings[i].classList[0]) {
                    score += 15 * difficultyCoefficient;
                    scoresBlock.innerText = `Очки: ${score}`;
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                    order--;
                    remainingRings--;
                    remainsBlock.innerText = `Осталось: ${remainingRings}`;
                } else {
                    score -= 30 * difficultyCoefficient;
                    scoresBlock.innerText = `Очки: ${score}`;
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                }
            })
        }

        let disappear = setInterval(() => {
            rings[Math.floor(Math.random() * rings.length)].style.display = 'none';
        }, getRandomInt(4000, 6000));
        let appear = setInterval(() => {
            const random = Math.floor(Math.random() * rings.length);
            let isInRemovedRings = false;
            for (let i = 0; i < removedRings.length; i++) {
                if (removedRings[i].classList[0] === rings[random].classList[0]) {
                    isInRemovedRings = true;
                }
            }
            if (!isInRemovedRings) {
                moveRing(rings[random]);
                rings[random].style.display = 'block';
            }
        }, getRandomInt(1000, 5000));
        let gameProcess = setInterval(() => {
            if (game) {
                if (order === -1) {
                    game = false;
                    gameover(gameoverEndings.won);
                    clearInterval(disappear);
                    clearInterval(appear);
                    clearInterval(gameProcess);
                }
                if (order !== -1 && rectangles.length === rings.length) {
                    game = false;
                    gameover(gameoverEndings.lose);
                    clearInterval(disappear);
                    clearInterval(appear);
                    clearInterval(gameProcess);
                }
            }
        }, 10)
    }

    startTimer();
}

window.onload = () => {
    game();
}