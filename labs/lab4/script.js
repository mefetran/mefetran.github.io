function start() {
  const array1 = [
    'Consuetudo est altera natura',
    'Nota bene',
    'Nulla calamitas sola',
    'Per aspera ad astra',
  ];

  const array2 = [
    'Привычка - вторая натура',
    'Заметьте хорошо!',
    'Беда не приходит одна',
    'Через тернии к звёздам',
  ];

  const usedNumbers = [];

  const list = document.getElementById('list');
  const add = document.getElementById('add');
  const repaint = document.getElementById('repaint');

  const getNumberOfNextElement = () => {
    if (usedNumbers.length === array1.length) return null;

    const number = Math.floor(Math.random() * array1.length);

    if (usedNumbers.includes(number)) return getNumberOfNextElement();

    usedNumbers.push(number);
    return number;
  };

  add.addEventListener('click', () => {
    const number = getNumberOfNextElement();
    if (number === null) return alert('Фразы закончились');
    list.innerHTML += `
    <li class="class${usedNumbers.length % 2 ? '2' : '1'}">
        ${array1[number]}
        <ul><li>${array2[number]}</li></ul>
    </li>`;
  });

  repaint.addEventListener('click', () => {
      list.classList.toggle('repaint');
  })
}

start();
