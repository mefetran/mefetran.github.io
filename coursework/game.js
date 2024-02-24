function game() {
    const welcome = document.getElementById('welcome');
    welcome.style.display = 'none';
    const chooseDifficulty = document.getElementById('chooseDifficulty');
    chooseDifficulty.style.display = 'flex';
    const easyButton = document.getElementById('easy');
    const mediumButton = document.getElementById('medium');
    const restart = document.getElementById('restart');
    const gameover = document.getElementById('gameover');
    const windowBlock = document.getElementById('window');
    const pyramidBlock = document.getElementById('pyramid');
    const returnButton = document.getElementById('return');
    const clicsBlock = document.getElementById('clics');
    const scoresBlock = document.getElementById('score');
    let clics = 0;
    let score = 0;

    const ringClasses = Object.freeze({
        0: 'ring-one',
        1: 'ring-two',
        2: 'ring-three',
        3: 'ring-four',
        4: 'ring-five',
        5: 'ring-six',
    });

    const rectClasses = Object.freeze({
        0: 'rect-one',
        1: 'rect-two',
        2: 'rect-three',
        3: 'rect-four',
        4: 'rect-five',
        5: 'rect-six',
    })

    const randomClass = () => {
        const keys = Object.keys(ringClasses);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return ringClasses[randomKey];
    }

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

    // setInterval(() => {
    //     newRing();
    // }, 1000)

    // setTimeout(() => {
    //     newRing();
    // }, i * 1000);
    // clearTimeout();

    const easy = () => {
        document.getElementById('difficulty').innerText = 'Сложность: легкая';
        const rings = [];
        for (let i = 0; i < 6; i++) {
            rings.push(newRing(ringClasses[i]));
        }
        let order = rings.length - 1;
        let game = true;
        for (let i = 0; i < rings.length; i++) {
            rings[i].addEventListener('click', () => {
                if (ringClasses[order] === rings[i].classList[0]) {
                    score += 10;
                    scoresBlock.innerText = `Очки: ${score}`;
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                    order--;
                    rings[i].remove();
                    let rectangle = document.createElement('div');
                    rectangle.classList.add(rectClasses[i]);
                    pyramidBlock.appendChild(rectangle);

                } else {
                    alert('Неправильно!');
                    if (score > 0) {
                        score -= 10;
                        scoresBlock.innerText = `Очки: ${score}`;
                    }
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                }
            })
        }

        setInterval(() => {
            if (game) {
                if (order === -1) {
                    game = false;
                    gameover.style.display = 'flex';
                    gameover.getElementsByTagName('p')[0].innerText = `Вы набрали ${score} очков за ${clics} кликов.`
                }
            }
        }, 10)
    }

    const medium = () => {
        document.getElementById('difficulty').innerText = 'Сложность: средняя';
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
            order = 0;
        })
        for (let i = 0; i < 6; i++) {
            rings.push(newRing(ringClasses[i]));
        }
        let order = rings.length - 1;
        let game = true;
        for (let i = 0; i < rings.length; i++) {
            rings[i].addEventListener('click', () => {
                removedRings.push(rings[i]);
                rings[i].style.display = 'none';
                let rectangle = document.createElement('div');
                rectangle.classList.add(rectClasses[i]);
                pyramidBlock.appendChild(rectangle);
                rectangles.push(rectangle);
                if (ringClasses[order] === rings[i].classList[0]) {
                    score += 15;
                    scoresBlock.innerText = `Очки: ${score}`;
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                    order--;
                } else {
                    if (score > 0) {
                        score -= 15;
                        scoresBlock.innerText = `Очки: ${score}`;
                    }
                    clics++;
                    clicsBlock.innerText = `Клики: ${clics}`;
                }
            })
        }

        setInterval(() => {
            if (game) {
                if (order === -1) {
                    game = false;
                    gameover.style.display = 'flex';
                    gameover.getElementsByTagName('p')[0].innerText = `Вы набрали ${score} очков за ${clics} кликов.`
                }
                if (order !== -1 && rectangles.length === 6) {
                    game = false;
                    gameover.style.display = 'flex';
                    gameover.getElementsByTagName('h1')[0].innerText = 'Вы проиграли!';
                    gameover.getElementsByTagName('p')[0].innerText = `Вы набрали ${score} очков за ${clics} кликов.`
                }
            }
        }, 10)
    }


    easyButton.addEventListener('click', () => {
        chooseDifficulty.style.display = 'none';
        easy();
    })

    mediumButton.addEventListener('click', () => {
        chooseDifficulty.style.display = 'none';
        medium();
    })

    restart.addEventListener('click', () => {
        location.reload();
    })

}