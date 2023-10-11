+(function() {
 const main = document.getElementsByTagName('main')[0];
 const main_page = elCls('main-page')[0];

 const control = elCls('fuck-off')[0];
 const control_clWid = control.clientWidth;
 const control_clWid2 = control_clWid / 2;
 let backArrowGame = elId('backArrowGame'),
  uiLevel = elId('uiLevel'), appLoc, active_section;

 /**
  * Create html DOM elements
  * @param {string} elem - Type of element
  */
 function el(elem, props = {}, ...children) {
  let element = document.createElement(elem);
  if (props && typeof props == 'object') {
   for (let prop in props) {
    if (prop == 'class') {
     props[prop].split(' ').forEach(each => element.classList.add(each));
    } else if (prop == 'event') {
     for (let ev in props[prop]) {
      element.addEventListener(ev, props[prop][ev]);
     }
    } else if (prop == 'data') {
     for (let d in props[prop]) {
      element.dataset[d] = props[prop][d];
     }
    } else {
     element[prop] = props[prop];
    }
   }
  }

  if (children) {
   for (let child of children) element.append(child);
  }
  return element;
 }
 
 window.addEventListener("popstate", (event) => {
  if (new URL(appLoc).pathname == '/page') {
   active_section.remove();
   resume.classList.contains('hide') ? new_game.firstChild.focus() : resume.firstChild.focus();
  } else if(new URL(appLoc).pathname == '/game') {
   Tetris.pause();
  }
 });
 
 function formInput(name, value, data, add) {
  let form = el('form', {
    name,
    event: {
     submit(e) {
      e.preventDefault();
      ui_controls[name](this);
     }
    }
   },
   el('input', { type: 'submit', value })
  );

  if (data) { // Levels section
   form.dataset.value = data;
   form.dataset.add = add;
   String(data) == String(level) && form.classList.add('selected');
  }

  return form;
 }

 function backArrow(section) {
  return el('div', { class: 'backArrow', tabIndex: 0, innerHTML: `<svg style="width: 40;height: 40;background: #50505050" viewbox="-5 0 40 40"><g stroke="whitesmoke" stroke-width="2" stroke-linecap="round" fill="none"><path d="M5 20 L27 20" /><path d="M12 13 L4 20 L12 27" /></g></svg>`, event: { click() { history.back() } } });
 }

 function Navigation() {
  resume = formInput('resume', 'RESUME');
  resume.classList.add('hide');

  new_game = formInput('new_game', 'NEW GAME');

  return el('div', { class: 'navigation' },
   el('div', { class: 'heading' },
    el('h1', { textContent: 'TETRIS' })
   ),
   el('nav', { class: 'nav-main' },
    resume,
    new_game,
    formInput('level', 'LEVELS'),
    formInput('high_score', 'HIGH SCORE'),
    formInput('help', 'HELP')
   )
  );
 }

 function back() {
  history.back();
 }
 
 backArrowGame.addEventListener('click', back);

 function LevelSection() {
  let backarrow = backArrow();

  let section = el('section', { id: 'sections' },
   backarrow,
   el('div', { class: 'level' },
    el('h1', { textContent: 'Levels' })
   ),
   el('div', {},
    formInput('levels', 'Level 1', 600, 5),
    formInput('levels', 'Level 2', 400, 10),
    formInput('levels', 'Level 3', 200, 15),
    formInput('levels', 'Level 4', 100, 20)
   )
  );

  active_section = section;
  
  history.pushState({ page: 1 }, 'Levels page', "/page");
  appLoc = location.href;

  main.append(section);

  return backarrow;
 }

 function HighScoreSection() {
  let backarrow = backArrow();
  
  function createHScores(highScores, score, level) {
   if (highScores && score in highScores) value = highScores[score];

   return el('div', { data: { value: score } },
    el('h4', { textContent: level }),
    el('small', { textContent: value || '0' })
   );
  }

  let highScores = JSON.parse(localStorage.getItem('context')).score,
   value;

  let section = el('section', { id: 'sections' },
   backarrow,
   el('div', { class: 'level' },
    el('h1', { textContent: 'HIGH SCORE' })
   ),
   el('div', {},
    createHScores(highScores, 600, 'Level 1'),
    createHScores(highScores, 400, 'Level 2'),
    createHScores(highScores, 200, 'Level 3'),
    createHScores(highScores, 100, 'Level 4')
   )
  );
  
  history.pushState({ page: 1 }, 'High scores page', "/page");
	 appLoc = location.href;
	 
	 active_section = section;
	
  main.append(section);

  return backarrow;
 }

 function HelpSection() {
  let backarrow = backArrow();

  function createHelpOl(rules) {
   return el('ol', { type: '1' },
    ...rules.map(text => el('li', { textContent: text }))
   );
  }

  let section = el('section', { id: 'sections' },
   backarrow,
   el('div', { class: 'level' },
    el('h1', { textContent: 'HELP' })
   ),
   el('div', { class: 'details' },
    el('h3', { textContent: 'How to play?' }),
    el('p', { textContent: 'Try to arrange the tetrominoes to completely fill up a line or more(no empty slot in that line).' }),
    el('h3', { textContent: 'Controls 1:' }),
    createHelpOl(['Move to the left with the left arrow.', 'Move to the right with the right arrow.', 'Change shape with the up arrow.', 'Drop down with the down arrow.', 'Press the spacebar key or ESC to pause game.']),
    el('h3', { textContent: 'Controls 2:' }),
    createHelpOl(['Click the top of the screen to change shape.', 'Click the middle left of the screen to move to the left.', 'Click the middle right of the screen to move to the right.', 'Click the bottom of the screen to drop down.'])
   )
  );
  
  history.pushState({ page: 1 }, 'Help page', "/page");
  appLoc = location.href;
  
  active_section = section;

  main.append(section);

  return backarrow;
 }
 
 let welcome = document.getElementById('welcome-page');

 setTimeout(() => {
  main_page.append(Navigation());
  welcome.remove();
 }, 1000);

 window.addEventListener('keydown', function(e) {
  if (!main_page.classList.contains('hide')) return;
  let key = e.key;
  if (key == 'ArrowRight') {
   setTimeout(Tetris.moveRight, 0);
  } else if (key == 'ArrowLeft') {
   setTimeout(Tetris.moveLeft, 0);
  } else if (key == 'ArrowUp') {
   setTimeout(Tetris.controlBlockChange, 0);
  } else if (key == 'ArrowDown') {
   Tetris.throwDown();
  } else if (key == ' ') {
   Tetris.pause();
  }
 });

 control.addEventListener('click', function(e) {
  if (e.clientY <= window.innerHeight / 5) {
   setTimeout(Tetris.controlBlockChange, 0);
   return;
  }
  if (e.clientY >= window.innerHeight - (window.innerHeight / 5)) return Tetris.throwDown();
  e.clientX >= control_clWid2 ? setTimeout(Tetris.moveRight, 0) : setTimeout(Tetris.moveLeft, 0);
 });

 const ui_controls = {
  resume() {
   main_page.classList.add('hide');
   interval = setInterval(Tetris.moveBox, level);
   resume.classList.add('hide');
   backArrowGame.focus();
   history.pushState({ page: 1 }, 'Game', "/game");
   appLoc = location.href;
  },
  new_game() {
   main_page.classList.add('hide');
   Tetris.reset();
   //Tetris.shapes.blockUpLeft();
   randNum = Tetris.randomNumber();
   Tetris.shapes[Tetris.shapesArr[Tetris.randomNumber()]]();
   interval = setInterval(Tetris.moveBox, level);
   Tetris.showNextBox();
   uiLevel.textContent = Tetris.levels.findIndex(e => e == level);
   backArrowGame.focus();
   history.pushState({ page: 1 }, 'Game', "/game");
   appLoc = location.href;
  },
  level() {
   LevelSection().focus();
  },
  high_score() {
   HighScoreSection().focus();
  },
  help() {
   HelpSection().focus();
  },
  levels(input) {
   let newLevel = input.dataset.value;

   if (level == newLevel) return;

   let add = input.dataset.add;

   level = newLevel;
   scoreAdder = add;
   score = 0;
   re_render = [];

   let context = JSON.parse(localStorage.getItem('context')) || {};
   localStorage.setItem('context', JSON.stringify({
    ...context,
    level: newLevel,
    add
   }));

   resume.classList.add('hide');
   active_section.remove();
   new_game.firstChild.focus();
  }
 };
})();