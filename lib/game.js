const elCls = cls => document.getElementsByClassName(cls);

const elName = name => document.getElementsByName(name);

const elId = id => document.getElementById(id);

let interval, level, score = 0,
 re_render, scoreAdder, randNum;

const Tetris = (function() {
 const main_page = elCls('main-page')[0];
 const show_score = elId('score');

 const canvasElem = elCls('canvas')[0];
 const canvas_height = canvasElem.offsetHeight;
 const canvas_width = canvasElem.offsetWidth;
 const canvas = document.createElement('canvas');
 canvas.width = canvas_width;
 canvas.height = canvas_height;
 canvasElem.appendChild(canvas);

 const shapesArr = [
 'block', 'vertL', 'horizL', 'plusUp', 'plusRight', 'plusDown', 'plusLeft', 'blockRight', 'blockDownRight', 'blockLeft', 'blockDownLeft', 'blockUpRight', 'blockUpLeft', 'blockUpLeftDown', 'blockUpRightDown', 'zigZagUpLeft', 'zigZagUpLeftR', 'zigZagUpRight', 'zigZagUpRightL'
 ];
 const levels = ['', 600, 400, 200, 100];
 // Next shape canvas
 const new_box_block = elId('new-block');
 const new_box_canvas = document.createElement('canvas');
 const xAxis = [],
  yAxis = [];

 new_box_canvas.width = new_box_block.clientWidth;
 new_box_canvas.height = new_box_block.clientHeight;

 new_box_block.append(new_box_canvas);

 let context = localStorage.getItem('context'),
  activeBox, ctx;
 const gameState = document.createElement('canvas');
 gameState.width = canvas_width;
 gameState.height = canvas_height;
 const savedGame = gameState.getContext('2d');

 if (!context) {
  level = levels[1], scoreAdder = 5;
  localStorage.setItem('context', JSON.stringify({ level, add: scoreAdder }));
 } else {
  context = JSON.parse(context);
  level = +context.level;
  scoreAdder = +context.add;
 }
 
 function iterate(iterable, func) {
  let iterator = iterable[Symbol.iterator]();
  let i = 0;
  while (true) {
   let result = iterator.next();
   if (result.done) break;
   func(result.value, i++, iterable);
  }
 }

 function saveState() {
  savedGame.clearRect(0, 0, canvas_width, canvas_height);
  savedGame.drawImage(canvas, 0, 0);
 }

 function randomNumber() {
  return Math.floor(Math.random() * shapesArr.length);
 }

 function incrementScore() {
  score += scoreAdder;
  show_score.innerText = score;
 }

 function addScore() {
  try {
   // counts =  the number of times each y value is rendered
   // e.g, 27:14 means y: 27 line has 14 blocks(filled)

   let counts = re_render.reduce((obj, box) => {
     if (box.box.y in obj) { // if obj has y
      obj[box.box.y]++; // increment the y value
     } else {
      obj[box.box.y] = 1; // set obj.y to the current y axis value
     }
     return obj;
    }, {} // save the calculated values in an object
   );
   for (let key in counts) {
    if (counts[key] == 14) { // if the y (stored in key) line is filled
     re_render = re_render.filter(each => each.box.y != key); // clear out all boxes on that y line
     re_render.forEach(each => each.box.y >= key || each.box.y++ /* shift all boxes down if possible else return (continue) */ );
     ctx.clearRect(0, 0, canvas_width, canvas_height);
     iterate(re_render, obj => draw(obj));
     utils.saveState();
     utils.incrementScore();
    }
   }
  } catch (e) {
   console.error(e.stack);
  }
 }

 function boxOccupied(box) {
  for (let obj of box) {
   for (let key of re_render) {
    if (key.box.x == obj.box.x && key.box.y == obj.box.y) return true;
   }
  }
 }

 function hitBottom(mainObj) {
  return mainObj.boxes.find(obj => obj.box.y == 28);
 }

 function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
 }

 for (let i = 0; i < 14; i++) xAxis.push((canvas_width / 14) * i);
 for (let i = 0; i < 28; i++) yAxis.push((canvas_height / 28) * i);

 function newShape() {
  try {
   for (let obj of activeBox.boxes) {
    if (obj.box.y >= 2) continue;
    clearInterval(interval);
    let context = JSON.parse(localStorage.getItem('context'));
    let scr = show_score.innerText;
    if (context.score) {
     if (context.score[level]) {
      if (+scr > +context.score[level]) {
       localStorage.setItem('context', JSON.stringify({
        ...context,
        score: {
         ...context.score,
         [level]: scr
        }
       }));
      }
     } else {
      localStorage.setItem('context', JSON.stringify({
       ...context,
       score: {
        ...context.score,
        [level]: scr
       }
      }));
     }
    } else {
     localStorage.setItem('context', JSON.stringify({
      ...context,
      score: {
      [level]: scr
      }
     }));
    }
    alert('Score: ' + scr);
    main_page.classList.remove('hide');
    elName('new_game')[0].firstElementChild.focus();
    activeBox = null;
    return;
   }
   activeBox = {};
   clearInterval(interval);
   utils.saveState();
   shapes[shapesArr[randNum]]();
   randNum = utils.randomNumber();
   showNextBox();
   interval = '';
   interval = setInterval(moveBox, level);
  } catch (e) {
   console.error(e.stack);
  }
 }
 const ctxNext = new_box_canvas.getContext('2d');
 const nXAxis = [0, 0, 0, 0, 0, 5, 20, 35, 50, 65];
 const nYAxis = [20, 35, 50, 65, 80];

 async function moveBox() {
  let boxes = activeBox.boxes;
  iterate(boxes, e => e.box.y++);
  if (utils.boxOccupied(boxes) || utils.hitBottom(activeBox)) {
   iterate(boxes, e => e.box.y--);
   re_render = re_render.concat(activeBox.boxes);
   utils.addScore();
   return newShape();
  }
  rerenderGame(activeBox);
 }

 async function showNextBox() {
  ctxNext.clearRect(0, 0, new_box_canvas.width, new_box_canvas.height);

  function draw2(obj) {
   let { x, y } = obj.box;
   ctxNext.beginPath();
   ctxNext.lineWidth = '1';
   ctxNext.strokeStyle = '#3C3C3D';
   ctxNext.moveTo(nXAxis[x], nYAxis[y]);
   ctxNext.lineTo(nXAxis[x] + 15, nYAxis[y]);
   ctxNext.lineTo(nXAxis[x] + 15, nYAxis[y] + 15);
   ctxNext.lineTo(nXAxis[x], nYAxis[y] + 15);
   ctxNext.closePath();
   ctxNext.fillStyle = obj.fill;
   ctxNext.fill();
   ctxNext.stroke();
  }
  iterate(shapes[shapesArr[randNum]](true), obj => draw2(obj));
 }

 // individual boxes width and height
 // width is game canvas width

 let boxWidth = canvas_width / 14,
  boxHeight = canvas_height / 28;

 // draw shapes
 ctx = canvas.getContext('2d');
 savedGame.drawImage(canvas, 0, 0);

 function rerenderGame(shape) {
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  ctx.drawImage(gameState, 0, 0);
  iterate(shape.boxes, key => draw(key));
  activeBox = shape;
 }

 function draw(obj) {
  let { x, y } = obj.box;
  ctx.beginPath();
  ctx.lineWidth = '1';
  ctx.strokeStyle = '#3C3C3D';
  ctx.moveTo(xAxis[x], yAxis[y]);
  ctx.lineTo(xAxis[x] + boxWidth, yAxis[y]);
  ctx.lineTo(xAxis[x] + boxWidth, yAxis[y] + boxHeight);
  ctx.lineTo(xAxis[x], yAxis[y] + boxHeight);
  ctx.closePath();
  ctx.fillStyle = obj.fill;
  ctx.fill();
  ctx.stroke();
 }

 function newShapeFormat(obj) {
  let color = { fill: obj.color };
  let boxes = [
   { box: { x: obj[0].x, y: obj[0].y }, ...color },
   { box: { x: obj[1].x, y: obj[1].y }, ...color },
   { box: { x: obj[2].x, y: obj[2].y }, ...color },
   { box: { x: obj[3].x, y: obj[3].y }, ...color }];
  if (obj.next) return boxes;
  rerenderGame({ boxes, name: obj.name });
 }

 let colors = {
  block: 'darkred',
  vertL: 'blue',
  horizL: 'blue',
  plus: '#c66311',
  corner: '#c69811',
  zigzag: '#5A5F9B'
 }

 let shapes = {
  block(next) {
   return newShapeFormat({ color: colors.block, 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 7, y: 1 }, 3: { x: 6, y: 1 }, next, name: 'Block' });
  },
  vertL(next) {
   return newShapeFormat({ color: colors.vertL, 0: { x: 6, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 6, y: 2 }, 3: { x: 6, y: 3 }, next, name: 'VertL' });
  },
  horizL(next) {
   return newShapeFormat({ color: colors.horizL, 0: { x: 5, y: 0 }, 1: { x: 6, y: 0 }, 2: { x: 7, y: 0 }, 3: { x: 8, y: 0 }, next, name: 'HorizL' });
  },
  plusUp(next) {
   return newShapeFormat({ color: colors.plus, 0: { x: 7, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 7, y: 1 }, 3: { x: 8, y: 1 }, next, name: 'PlusUp' });
  },
  plusRight(next) {
   return newShapeFormat({ color: colors.plus, 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 7, y: 2 }, 3: { x: 8, y: 1 }, next, name: 'PlusRight' });
  },
  plusDown(next) {
   return newShapeFormat({ color: colors.plus, 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 8, y: 0 }, 3: { x: 7, y: 1 }, next, name: 'PlusDown' });
  },
  plusLeft(next) {
   return newShapeFormat({ color: colors.plus, 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 7, y: 2 }, 3: { x: 6, y: 1 }, next, name: 'PlusLeft' });
  },
  blockRight(next) {
   return newShapeFormat({ color: colors.corner, 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 7, y: 2 }, 3: { x: 6, y: 2 }, next, name: 'BlockRight' });
  },
  blockUpRight(next) {
   return newShapeFormat({ color: colors.corner, 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 8, y: 0 }, 3: { x: 8, y: 1 }, next, name: 'BlockUpRight' });
  },
  blockDownRight(next) {
   return newShapeFormat({ color: colors.corner, 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 6, y: 1 }, 3: { x: 5, y: 1 }, next, name: 'BlockDownRight' });
  },
  blockUpLeftDown(next) {
   return newShapeFormat({ color: colors.corner, 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 7, y: 1 }, 3: { x: 7, y: 2 }, next, name: 'BlockUpLeftDown' });
  },
  blockLeft(next) {
   return newShapeFormat({ color: colors.corner, 0: { x: 6, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 6, y: 2 }, 3: { x: 7, y: 2 }, next, name: 'BlockLeft' });
  },
  blockUpLeft(next) {
   return newShapeFormat({ color: colors.corner, 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 8, y: 0 }, 3: { x: 6, y: 1 }, next, name: 'BlockUpLeft' });
  },
  blockDownLeft(next) {
   return newShapeFormat({ color: colors.corner, 0: { x: 6, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 7, y: 1 }, 3: { x: 8, y: 1 }, next, name: 'BlockDownLeft' });
  },
  blockUpRightDown(next) {
   return newShapeFormat({ color: colors.corner, 0: { x: 7, y: 0 }, 1: { x: 6, y: 0 }, 2: { x: 6, y: 1 }, 3: { x: 6, y: 2 }, next, name: 'BlockUpRightDown' });
  },
  zigZagUpLeft(next) {
   return newShapeFormat({ color: colors.zigzag, 0: { x: 6, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 7, y: 1 }, 3: { x: 7, y: 2 }, next, name: 'ZigZagUpLeft' });
  },
  zigZagUpLeftR(next) {
   return newShapeFormat({ color: colors.zigzag, 0: { x: 8, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 7, y: 1 }, 3: { x: 6, y: 1 }, next, name: 'ZigZagUpLeftR' });
  },
  zigZagUpRight(next) {
   return newShapeFormat({ color: colors.zigzag, 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 6, y: 1 }, 3: { x: 6, y: 2 }, next, name: 'ZigZagUpRight' });
  },
  zigZagUpRightL(next) {
   return newShapeFormat({ color: colors.zigzag, 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 7, y: 1 }, 3: { x: 8, y: 1 }, next, name: 'ZigZagUpRightL' });
  },
 };

 let changeShapes = {
  changeBlock() {
   return;
  },
  changeVertL(oldShape) {
   let boxes = activeBox.boxes;
   if (boxes[0].box.x > 12 || boxes[0].box.x < 2) return;
   boxes[0].box.x -= 2;
   boxes[1].box.x--;
   boxes[3].box.x += 1;
   iterate(boxes, obj => obj.box.y = boxes[1].box.y);
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'HorizL';
   rerenderGame(activeBox);
  },
  changeHorizL(oldShape) {
   let boxes = activeBox.boxes;
   boxes[0].box.y -= 2;
   boxes[1].box.y -= 1;
   boxes[3].box.y += 1;
   iterate(boxes, obj => obj.box.x = boxes[2].box.x);
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'VertL';
   rerenderGame(activeBox);
  },
  changePlusUp(oldShape) {
   let boxes = activeBox.boxes;
   boxes[2].box.y += 1;
   boxes[1].box.x = boxes[0].box.x;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'PlusRight';
   rerenderGame(activeBox);
  },
  changePlusRight(oldShape) {
   let boxes = activeBox.boxes;
   if (boxes[0].box.x < 1 || boxes[0].box.x > 12) return;
   boxes[0].box.x -= 1;
   boxes[2].box.x += 1;
   boxes[3].box.x -= 1;
   iterate(boxes, obj => obj.box.y = boxes[1].box.y);
   boxes[3].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'PlusDown';
   rerenderGame(activeBox);
  },
  changePlusDown(oldShape) {
   let boxes = activeBox.boxes;
   boxes[0].box.y -= 1;
   boxes[2].box.y += 1;
   boxes[3].box.y -= 1;
   iterate(boxes, obj => obj.box.x = boxes[1].box.x);
   boxes[3].box.x -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'PlusLeft';
   rerenderGame(activeBox);
  },
  changePlusLeft(oldShape) {
   let boxes = activeBox.boxes;
   if (boxes[0].box.x < 0 || boxes[0].box.x > 12) return;
   boxes[1].box.x -= 1;
   boxes[3].box.x += 2;
   iterate(boxes, obj => obj.box.y = boxes[1].box.y);
   boxes[0].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'PlusUp';
   rerenderGame(activeBox);
  },
  changeBlockRight(oldShape) {
   let boxes = activeBox.boxes;
   if (boxes[0].box.x < 2) return;
   boxes[0].box.x -= 2;
   boxes[1].box.x -= 1;
   boxes[3].box.x += 1;
   iterate(boxes, obj => obj.box.y = boxes[1].box.y);
   boxes[3].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'BlockUpRight';
   rerenderGame(activeBox);
  },
  changeBlockUpRight(oldShape) {
   let boxes = activeBox.boxes;
   iterate(boxes, obj => obj.box.x = boxes[2].box.x);
   boxes[0].box.y -= 1;
   boxes[2].box.y += 1;
   boxes[3].box.x -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'BlockRight';
   rerenderGame(activeBox);
  },
  changeBlockDownRight(oldShape) {
   let boxes = activeBox.boxes;
   boxes[0].box.y -= 1;
   boxes[1].box.y -= 2;
   boxes[2].box.y -= 1;
   iterate(boxes, obj => obj.box.x = boxes[0].box.x);
   boxes[0].box.x -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'BlockUpLeftDown';
   rerenderGame(activeBox);
  },
  changeBlockUpLeftDown(oldShape) {
   let boxes = activeBox.boxes;
   if (boxes[0].box.x < 1) return;
   boxes[0].box.x += 1;
   boxes[2].box.x -= 1;
   boxes[3].box.x -= 2;
   iterate(boxes, obj => obj.box.y = boxes[3].box.y);
   boxes[0].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'BlockDownRight';
   rerenderGame(activeBox);
  },
  changeBlockLeft(oldShape) {
   // Error somewhere here
   let boxes = activeBox.boxes;
   if (boxes[0].box.x > 11) return;
   boxes[0].box.x += 2;
   boxes[1].box.x += 1;
   boxes[3].box.x -= 1;
   iterate(boxes, obj => obj.box.y = boxes[1].box.y);
   boxes[3].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'BlockUpLeft';
   rerenderGame(activeBox);
  },
  changeBlockUpLeft(oldShape) {
   let boxes = activeBox.boxes;
   boxes[0].box.y -= 1;
   boxes[2].box.y += 1;
   iterate(boxes, obj => obj.box.x = boxes[0].box.x);
   boxes[3].box.x += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'BlockLeft';
   rerenderGame(activeBox);
  },
  changeBlockDownLeft(oldShape) {
   let boxes = activeBox.boxes;
   boxes[0].box.y -= 1;
   boxes[1].box.y -= 2;
   boxes[2].box.y -= 1;
   iterate(boxes, obj => obj.box.x = boxes[0].box.x);
   boxes[0].box.x += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'BlockUpRightDown';
   rerenderGame(activeBox);
  },
  changeBlockUpRightDown(oldShape) {
   let boxes = activeBox.boxes;
   boxes[0].box.x -= 1;
   boxes[2].box.x += 1;
   boxes[3].box.x += 2;
   iterate(boxes, obj => obj.box.y = boxes[3].box.y);
   boxes[0].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'BlockDownLeft';
   rerenderGame(activeBox);
  },
  changeZigZagUpLeft(oldShape) {
   let boxes = activeBox.boxes;
   if (boxes[0].box.x > 11) return;
   boxes[0].box.x += 2;
   boxes[1].box.x += 1;
   boxes[3].box.x -= 1;
   boxes[0].box.y += 1;
   boxes[2].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'ZigZagUpLeftR';
   rerenderGame(activeBox);
  },
  changeZigZagUpLeftR(oldShape) {
   let boxes = activeBox.boxes;
   boxes[0].box.x -= 2;
   boxes[1].box.x -= 1;
   boxes[3].box.x += 1;
   boxes[0].box.y -= 1;
   boxes[2].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'ZigZagUpLeft';
   rerenderGame(activeBox);
  },
  changeZigZagUpRight(oldShape) {
   let boxes = activeBox.boxes;
   if (boxes[0].box.x < 2) return;
   boxes[0].box.x -= 2;
   boxes[1].box.x -= 1;
   boxes[3].box.x += 1;
   boxes[0].box.y += 1;
   boxes[2].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'ZigZagUpRightL';
   rerenderGame(activeBox);
  },
  changeZigZagUpRightL(oldShape) {
   let boxes = activeBox.boxes;
   boxes[0].box.x += 2;
   boxes[1].box.x += 1;
   boxes[3].box.x -= 1;
   boxes[0].box.y -= 1;
   boxes[2].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = oldShape;
    return;
   }
   activeBox.name = 'ZigZagUpRight';
   rerenderGame(activeBox);
  }
 };

 return {
  levels,
  shapes,
  shapesArr,
  moveBox,
  reset() {
   re_render = [];
   score = 0;
   ctx.clearRect(0, 0, canvas_width, canvas_height);
   savedGame.clearRect(0, 0, canvas_width, canvas_height);
  },
  pause() {
   clearInterval(interval);
   resume.classList.remove('hide');
   main_page.classList.remove('hide');
   resume.firstElementChild.focus();
  },
  controlBlockChange() {
   changeShapes[`change${activeBox.name}`](utils.deepCopy(activeBox.boxes));
  },
  throwDown(mainObj) {
   let boxes = activeBox.boxes;

   function recall() {
    iterate(boxes, obj => obj.box.y++);
    if (utils.boxOccupied(boxes) || boxes.find(obj => obj.box.y == 28)) {
     iterate(boxes, obj => obj.box.y--);
     re_render.push(...boxes);
     rerenderGame(activeBox);
     utils.addScore();
     return newShape();
    }
    recall();
   }
   recall();
  },
  moveRight() {
   iterate(activeBox.boxes, obj =>
    obj.box.x++);
   for (let obj of activeBox.boxes) {
    if (obj.box.x > 13) return iterate(activeBox.boxes, obj => obj.box.x--);
   }
   utils.boxOccupied(activeBox.boxes) && iterate(activeBox.boxes, obj => obj.box.x--) || rerenderGame(activeBox);
  },
  moveLeft() {
   iterate(activeBox.boxes, obj => obj.box.x--);
   for (let obj of activeBox.boxes) {
    if (obj.box.x < 0) return iterate(activeBox.boxes, obj => obj.box.x++);
   }
   utils.boxOccupied(activeBox.boxes) && iterate(activeBox.boxes, obj => obj.box.x++) || rerenderGame(activeBox);
  },
  showNextBox,
  randomNumber: utils.randomNumber
 }
})();