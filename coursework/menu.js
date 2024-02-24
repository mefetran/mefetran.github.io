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
}