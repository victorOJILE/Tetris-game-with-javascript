+(function() {
 const main_page = elCls('main-page')[0];
 const game_section = elId('game-section');
 const level_section = elId('level-section');
 const high_score_section = elId('high_score_section');
 const control = elCls('fuck-off')[0];
 const control_clWid = control.clientWidth;
 const control_clWid2 = control_clWid / 2;
 const resume = elId('resume');

 window.addEventListener('keydown', (e) => {
  if (!main_page.classList.contains('hide')) return;
  let key = e.key;
  if (key == 'ArrowRight') {
   Tetris.moveRight();
  } else if (key == 'ArrowLeft') {
   Tetris.moveLeft();
  } else if (key == 'ArrowUp') {
   Tetris.controlBlockChange();
  } else if (key == 'ArrowDown') {
   Tetris.throwDown();
  } else if (key == ' ') {
   clearInterval(interval);
   resume.classList.remove('hide');
   main_page.classList.remove('hide');
   resume.firstElementChild.focus();
  }
 });
 control.addEventListener('click', (e) => {
  if (e.clientY <= window.innerHeight / 5) return Tetris.controlBlockChange();
  if (e.clientY >= window.innerHeight - (window.innerHeight / 5)) return Tetris.throwDown();
  e.clientX >= control_clWid2 ? Tetris.moveRight() : Tetris.moveLeft();
 });
 Array.from(document.forms).forEach(each => {
  each.addEventListener('submit', function(e) {
   e.preventDefault();
   ui_controls[e.target.name](this);
  });
 });

 const ui_controls = {
  resume() {
   main_page.classList.add('hide');
   interval = setInterval(Tetris.moveBox, level);
   resume.classList.add('hide');
   elId('backArrowGame').focus();
  },
  new_game() {
   main_page.classList.add('hide');
   re_render = [];
   score = 0;
   Tetris.shapes.blockDownLeft();
   randNum = Tetris.randomNumber();
   interval = setInterval(Tetris.moveBox, level);
   Tetris.showNextBox();
   elId('uiLevel').innerText = Tetris.levels.findIndex(e => e == level);
   elId('backArrowGame').focus();
  },
  level() {
   level_section.classList.remove('hide');
   main_page.classList.add('hide');
   elId('backArrowLevel').focus();
  },
  level1(input) {
   levelsMod({ level: 600, add: 5 }, input);
  },
  level2(input) {
   levelsMod({ level: 400, add: 10 }, input);
  },
  level3(input) {
   levelsMod({ level: 200, add: 15 }, input);
  },
  level4(input) {
   levelsMod({ level: 100, add: 20 }, input);
  },
  high_score() {
   high_score_section.classList.remove('hide');
   let hsId = elId('HSList').children;
   try {
    let highScores = JSON.parse(localStorage.getItem('context')).score;
    for (let div of hsId) {
     let score = div.dataset.value;
     if (score in highScores) {
      div.lastElementChild.innerText = highScores[score];
     }
    }
   } catch (e) {}
   main_page.classList.add('hide');
   elId('backArrowHS').focus();
  },
  help() {
   elId('help_section').classList.remove('hide');
   main_page.classList.add('hide');
   elId('backArrowHelp').focus();
  }
 };

 function levelsMod(obj, input) {
  if (level == obj.level) return;
  for (let inp of input.parentElement.children) {
   if (inp.classList.contains('selected'))
    inp.classList.remove('selected');
  }
  input.classList.add('selected');
  level = obj.level;
  scoreAdder = obj.add;
  score = 0;
  re_render = [];
  let context = JSON.parse(localStorage.getItem('context'));
  localStorage.setItem('context', JSON.stringify({
   ...context,
   level: obj.level,
   add: obj.add
  }));
  resume.classList.add('hide');
  level_section.classList.add('hide');
  main_page.classList.remove('hide');
  elName('new_game')[0].firstElementChild.focus();
 }

 let backArrow = elCls('backArrow');

 function backArrowClose(arrow) {
  if (arrow.id != 'backArrowGame') {
   arrow.parentElement.classList.add('hide');
   main_page.classList.remove('hide');
   resume.classList.contains('hide') ? elName("new_game")[0].firstElementChild.focus() : resume.firstElementChild.focus();
  } else {
   clearInterval(interval);
   interval = '';
   resume.classList.remove('hide');
   main_page.classList.remove('hide');
   resume.firstElementChild.focus();
  }
 }
 for (let arrow of backArrow) {
  arrow.addEventListener('click', function() { backArrowClose(this) });
 }
 
 let levelList = elCls('levelList')[0].children;
 for (let form of levelList) {
  if (form.dataset.value == String(level)) form.classList.add('selected');
 }
 levelList = null;
})();