function start() {
  const tolerance = 10;
  const rotateDeg = 5;

  const keyElem = document.getElementById('ball');

  const puzzles = new Map([
    [keyElem, { x: 0, y: 0 }],
    [document.getElementById('head'), { x: -23, y: -48 }],
    [document.getElementById('collar'), { x: -10, y: -28 }],
    [document.getElementById('leash'), { x: 21, y: -70 }],
    [document.getElementById('chest'), { x: -24, y: -25 }],
    [document.getElementById('croup'), { x: 34, y: -25 }],
    [document.getElementById('tail'), { x: 73, y: -21 }],
  ]);

  for (const puzzle of puzzles.keys()) {
    puzzle.firstElementChild.style.rotate = `${Math.floor(Math.random() * 360)}deg`;
    puzzle.addEventListener('mousedown', mouseDown);
    puzzle.ondragstart = () => false;
    puzzle.onselectstart = () => false;
  }

  function check() {
    const { left: keyLeft, top: keyTop } = keyElem.getBoundingClientRect();

    for (const [puzzle, { x, y }] of puzzles) {
      const puzzleImage = puzzle.firstElementChild;
      const computedStyles = window.getComputedStyle(puzzleImage);
      let rotate =
        computedStyles.rotate !== 'none'
          ? Number(computedStyles.rotate.slice(0, -3))
          : 0;

      rotate = Math.abs(rotate) % 360;

      if (rotate > 0 + tolerance && rotate < 360 - tolerance) return;

      const { left: puzzleLeft, top: puzzleTop } =
        puzzle.getBoundingClientRect();

      if (
        Math.abs(puzzleLeft - keyLeft - x) > tolerance ||
        Math.abs(puzzleTop - keyTop - y) > tolerance
      )
        return;
    }

    alert('Пазл успешно собран!');

    // simple animation
    keyElem.classList.add('anim');
  }

  function mouseDown(e) {
    const puzzle = e.target;
    const puzzleImage = puzzle.firstElementChild;
    const puzzleArea = puzzle.parentElement;

    const { clientX: mouseLeft, clientY: mouseTop } = e;
    const { left: puzzleLeft, top: puzzleTop } = puzzle.getBoundingClientRect();
    const { left: areaLeft, top: areaTop } = puzzleArea.getBoundingClientRect();

    const shiftX = mouseLeft - puzzleLeft + areaLeft;
    const shiftY = mouseTop - puzzleTop + areaTop;

    puzzle.style.zIndex = 10;
    puzzle.style.cursor = 'grabbing';

    function moveAt(x, y) {
      puzzle.style.left = x + 'px';
      puzzle.style.top = y + 'px';
    }

    function mouseMove(e) {
      moveAt(e.pageX - shiftX, e.pageY - shiftY);
    }

    function wheel(e) {
      const computedStyles = window.getComputedStyle(puzzleImage);
      const currentRotate =
        computedStyles.rotate !== 'none'
          ? Number(computedStyles.rotate.slice(0, -3))
          : 0;
      puzzleImage.style.rotate = `${currentRotate + (e.deltaY < 0 ? -rotateDeg : rotateDeg)
        }deg`;
    }

    function mouseUp() {
      puzzle.style.zIndex = 5;
      puzzle.style.cursor = 'grab';
      puzzle.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('wheel', wheel);
      document.removeEventListener('mousemove', mouseMove);
      check();
    }

    puzzle.addEventListener('mouseup', mouseUp);
    document.addEventListener('wheel', wheel);
    document.addEventListener('mousemove', mouseMove);
  }
}

start();
