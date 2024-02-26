function menu() {
    const welcome = document.getElementById('welcome');
    welcome.style.display = 'none';
    const chooseDifficulty = document.getElementById('chooseDifficulty');
    chooseDifficulty.style.display = 'flex';
    const easyButton = document.getElementById('easy');
    const mediumButton = document.getElementById('medium');
    const hardButton = document.getElementById('hard');

    function clickHandler(difficulty) {
        chooseDifficulty.style.display = 'none';
        localStorage.setItem('difficulty', difficulty);
        location.href = 'game.html';
    }

    easyButton.addEventListener('click', () => clickHandler('easy'));

    mediumButton.addEventListener('click', () => clickHandler('medium'));

    hardButton.addEventListener('click', () => clickHandler('hard'));

    let name = prompt("Введите свое имя (пустая строка или отмена = Гость):");
    if (name === null || name === "") {
        name = 'Гость';
    } else if (name.length > 10) {
        name = name.slice(0, 10);
    }
    localStorage.setItem('name', name);
}