const elCls = (cls) => document.getElementsByClassName(cls);
const elName = (name) => document.getElementsByName(name);
const elId = (id) => document.getElementById(id);
let interval, level, score = 0,
 re_render, scoreAdder, randNum;
 
const Tetris = (function() {
 const main_page = elCls('main-page')[0];
 const show_score = elId('score');

 const canvasElem = elCls('canvas')[0];
 const canvas_height = canvasElem.offsetHeight;
 const width = canvasElem.offsetWidth;
 const canvas = document.createElement('canvas');
 canvas.width = width;
 canvas.height = canvas_height;
 canvasElem.appendChild(canvas);

 let activeBox;

 const shapesArr = [
 'block', 'vertL', 'horizL', 'plusUp', 'plusRight', 'plusDown', 'plusLeft', 'blockRight', 'blockDownRight', 'blockLeft', 'blockDownLeft', 'blockUpRight', 'blockUpLeft', 'blockUpLeftDown', 'blockUpRightDown', 'zigZagUpLeft', 'zigZagUpLeftR', 'zigZagUpRight', 'zigZagUpRightL'
 ];
 const levels = ['', 600, 400, 200, 100];
 // Next shape canvas
 const new_box_block = elId('new-block');
 const new_box_canvas = document.createElement('canvas');

 new_box_canvas.width = new_box_block.offsetWidth;
 new_box_canvas.height = new_box_block.offsetHeight;

 new_box_block.append(new_box_canvas);

 let context = localStorage.getItem('context');

 if (!context) {
  level = levels[1], scoreAdder = 5;
  localStorage.setItem('context', JSON.stringify({ level, add: scoreAdder }));
 } else {
  context = JSON.parse(context);
  level = +context.level;
  scoreAdder = +context.add;
 }
 const utils = {
  randomNumber() {
   return Math.floor(Math.random() * shapesArr.length);
  },
  incrementScore() {
   score += scoreAdder;
   show_score.innerText = score;
  },
  addScore() {
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
      re_render.forEach(each => {
       if (each.box.y >= key) return;
       each.box.y++;
      });
      utils.incrementScore();
     }
    }
   } catch (e) {
    console.error(e.stack);
   }
  },
  boxOccupied(box) {
   for (let obj of box) {
    for (let key of re_render) {
     if (key.box.x == obj.box.x && key.box.y == obj.box.y) return true;
    }
   }
   return false;
  },
  hitBottom(mainObj) {
   return mainObj.boxes.find(obj => obj.box.y == 28) || false;
  },
  deepCopy(inObject) {
   let outObject, value, key;
   // Create an array or object to hold the values
   outObject = Array.isArray(inObject) ? [] : {};
   for (key in inObject) {
    value = inObject[key]
    // Recursively (deep) copy for nested objects, including arrays
    if (typeof value == 'object') {
     outObject[key] = utils.deepCopy(value);
    } else {
     outObject[key] = value;
    }
   }
   return outObject;
  }
 }

 const xAxis = [], yAxis = [];
 
 for (let i = 0; i < 14; i++) xAxis.push((width / 14) * i);
 for (let i = 0; i < 28; i++) yAxis.push((canvas_height / 28) * i);

 function newShape() {
  try {
   for (let obj of activeBox.boxes) {
    if (obj.box.y < 2) {
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
   }
   activeBox = {};
   clearInterval(interval);
   shapes[shapesArr[randNum]]();
   randNum = utils.randomNumber();
   showNextBox();
   interval = '';
   interval = setInterval(moveBox, level);
  } catch (e) {
   console.error(e.stack);
  }
 }
 let ctxNext = new_box_canvas.getContext('2d');
 let nXAxis = [0, 0, 0, 0, 0, 5, 20, 35, 50, 65];
 let nYAxis = [20, 35, 50, 65, 80];

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
  for (let obj of shapes[shapesArr[randNum]](true)) draw2(obj);
 }

 async function moveBox() {
  let boxes = activeBox.boxes;
  boxes.forEach(each => each.box.y++);
  if (utils.boxOccupied(boxes) || utils.hitBottom(activeBox)) {
   boxes.forEach(each => each.box.y--);
   re_render.push(...activeBox.boxes);
   utils.addScore();
   return newShape();
  }
  canvasBox(activeBox);
 }

 // individual boxes width and height
 // width is game canvas width
 
 let boxWidth = width / 14,
  boxHeight = canvas_height / 28;

 // draw shapes
 let ctx = canvas.getContext('2d');

 function canvasBox(mainObj) {
  ctx.clearRect(0, 0, width, canvas_height);
  for (let key of re_render) draw(key);
  for (let key of mainObj.boxes) draw(key);
  activeBox = mainObj;

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
 }
 
 function newShapeFormat(obj) {
  let color = { fill: obj.color };
  let boxes = [
   { box: { x: obj[0].x, y: obj[0].y }, ...color },
   { box: { x: obj[1].x, y: obj[1].y }, ...color },
   { box: { x: obj[2].x, y: obj[2].y }, ...color },
   { box: { x: obj[3].x, y: obj[3].y }, ...color }];
  if (obj.next) return boxes;
  canvasBox({ boxes, name: obj.name });
 }
 
 let shapes = {
  block(next) {
   return newShapeFormat({ color: 'darkred', 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 7, y: 1 }, 3: { x: 6, y: 1 }, next, name: 'Block' });
  },
  vertL(next) {
   return newShapeFormat({ color: 'blue', 0: { x: 6, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 6, y: 2 }, 3: { x: 6, y: 3 }, next, name: 'VertL' });
  },
  horizL(next) {
   return newShapeFormat({ color: 'blue', 0: { x: 5, y: 0 }, 1: { x: 6, y: 0 }, 2: { x: 7, y: 0 }, 3: { x: 8, y: 0 }, next, name: 'HorizL' });
  },
  plusUp(next) {
   return newShapeFormat({ color: '#c66311', 0: { x: 7, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 7, y: 1 }, 3: { x: 8, y: 1 }, next, name: 'PlusUp' });
  },
  plusRight(next) {
   return newShapeFormat({ color: '#c66311', 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 7, y: 2 }, 3: { x: 8, y: 1 }, next, name: 'PlusRight' });
  },
  plusDown(next) {
   return newShapeFormat({ color: '#c66311', 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 8, y: 0 }, 3: { x: 7, y: 1 }, next, name: 'PlusDown' });
  },
  plusLeft(next) {
   return newShapeFormat({ color: '#c66311', 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 7, y: 2 }, 3: { x: 6, y: 1 }, next, name: 'PlusLeft' });
  },
  blockRight(next) {
   return newShapeFormat({ color: '#c69811', 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 7, y: 2 }, 3: { x: 6, y: 2 }, next, name: 'BlockRight' });
  },
  blockUpRight(next) {
   return newShapeFormat({ color: '#c69811', 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 8, y: 0 }, 3: { x: 8, y: 1 }, next, name: 'BlockUpRight' });
  },
  blockDownRight(next) {
   return newShapeFormat({ color: '#c69811', 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 6, y: 1 }, 3: { x: 5, y: 1 }, next, name: 'BlockDownRight' });
  },
  blockUpLeftDown(next) {
   return newShapeFormat({ color: '#c69811', 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 7, y: 1 }, 3: { x: 7, y: 2 }, next, name: 'BlockUpLeftDown' });
  },
  blockLeft(next) {
   return newShapeFormat({ color: '#c69811', 0: { x: 6, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 6, y: 2 }, 3: { x: 7, y: 2 }, next, name: 'BlockLeft' });
  },
  blockUpLeft(next) {
   return newShapeFormat({ color: '#c69811', 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 8, y: 0 }, 3: { x: 6, y: 1 }, next, name: 'BlockUpLeft' });
  },
  blockDownLeft(next) {
   return newShapeFormat({ color: '#c69811', 0: { x: 6, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 7, y: 1 }, 3: { x: 8, y: 1 }, next, name: 'BlockDownLeft' });
  },
  blockUpRightDown(next) {
   return newShapeFormat({ color: '#c69811', 0: { x: 7, y: 0 }, 1: { x: 6, y: 0 }, 2: { x: 6, y: 1 }, 3: { x: 6, y: 2 }, next, name: 'BlockUpRightDown' });
  },
  zigZagUpLeft(next) {
   return newShapeFormat({ color: '#5A5F9B', 0: { x: 6, y: 0 }, 1: { x: 6, y: 1 }, 2: { x: 7, y: 1 }, 3: { x: 7, y: 2 }, next, name: 'ZigZagUpLeft' });
  },
  zigZagUpLeftR(next) {
   return newShapeFormat({ color: '#5A5F9B', 0: { x: 8, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 7, y: 1 }, 3: { x: 6, y: 1 }, next, name: 'ZigZagUpLeftR' });
  },
  zigZagUpRight(next) {
   return newShapeFormat({ color: '#5A5F9B', 0: { x: 7, y: 0 }, 1: { x: 7, y: 1 }, 2: { x: 6, y: 1 }, 3: { x: 6, y: 2 }, next, name: 'ZigZagUpRight' });
  },
  zigZagUpRightL(next) {
   return newShapeFormat({ color: '#5A5F9B', 0: { x: 6, y: 0 }, 1: { x: 7, y: 0 }, 2: { x: 7, y: 1 }, 3: { x: 8, y: 1 }, next, name: 'ZigZagUpRightL' });
  },
 };

 let changeShapes = {
  async changeBlock() {
   return;
  },
  async changeVertL() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let x = boxes[0].box.x;
   if (x > 12 || x < 2) return;
   boxes[0].box.x -= 2;
   boxes[1].box.x--;
   boxes[3].box.x += 1;
   let y = boxes[1].box.y;
   boxes.forEach(obj => obj.box.y = y);
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'HorizL';
   canvasBox(activeBox);
  },
  async changeHorizL() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   boxes[0].box.y -= 2;
   boxes[1].box.y -= 1;
   boxes[3].box.y += 1;
   boxes.forEach(obj => obj.box.x = boxes[2].box.x);
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'VertL';
   canvasBox(activeBox);
  },
  async changePlusUp() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   boxes[2].box.y += 1;
   boxes[1].box.x = boxes[0].box.x;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'PlusRight';
   canvasBox(activeBox);
  },
  async changePlusRight() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let y = boxes[1].box.y;
   if (boxes[0].box.x < 1 || boxes[0].box.x > 12) return;
   boxes[0].box.x -= 1;
   boxes[2].box.x += 1;
   boxes[3].box.x -= 1;
   boxes.forEach(obj => obj.box.y = y);
   boxes[3].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'PlusDown';
   canvasBox(activeBox);
  },
  async changePlusDown() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let x = boxes[1].box.x;
   boxes[0].box.y -= 1;
   boxes[2].box.y += 1;
   boxes[3].box.y -= 1;
   boxes.forEach(obj => obj.box.x = x);
   boxes[3].box.x -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'PlusLeft';
   canvasBox(activeBox);
  },
  async changePlusLeft() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let y = boxes[1].box.y;
   if (boxes[0].box.x < 0 || boxes[0].box.x > 12) return;
   boxes[1].box.x -= 1;
   boxes[3].box.x += 2;
   boxes.forEach(obj => obj.box.y = y);
   boxes[0].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'PlusUp';
   canvasBox(activeBox);
  },
  async changeBlockRight() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let y = boxes[1].box.y;
   if (boxes[0].box.x < 2) return;
   boxes[0].box.x -= 2;
   boxes[1].box.x -= 1;
   boxes[3].box.x += 1;
   boxes.forEach(obj => obj.box.y = y);
   boxes[3].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'BlockUpRight';
   canvasBox(activeBox);
  },
  async changeBlockUpRight() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let x = boxes[2].box.x;
   if (boxes[0].box.x < 2) return;
   boxes[0].box.y -= 1;
   boxes[2].box.y += 1;
   boxes.forEach(obj => obj.box.x = x);
   boxes[3].box.x -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'BlockRight';
   canvasBox(activeBox);
  },
  async changeBlockDownRight() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let x = boxes[0].box.x;
   boxes[0].box.y -= 1;
   boxes[1].box.y -= 2;
   boxes[2].box.y -= 1;
   boxes.forEach(obj => obj.box.x = x);
   boxes[0].box.x -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'BlockUpLeftDown';
   canvasBox(activeBox);
  },
  async changeBlockUpLeftDown() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let y = boxes[3].box.y;
   if (boxes[0].box.x < 1) return;
   boxes[0].box.x += 1;
   boxes[2].box.x -= 1;
   boxes[3].box.x -= 2;
   boxes.forEach(obj => obj.box.y = y);
   boxes[0].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'BlockDownRight';
   canvasBox(activeBox);
  },
  async changeBlockLeft() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let y = boxes[1].box.y;
   if (boxes[0].box.x > 12) return;
   boxes[0].box.x += 2;
   boxes[1].box.x += 1;
   boxes[3].box.x -= 1;
   boxes.forEach(obj => obj.box.y = y);
   boxes[3].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'BlockUpLeft';
   canvasBox(activeBox);
  },
  async changeBlockUpLeft() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let x = boxes[2].box.x;
   boxes[0].box.y -= 1;
   boxes[2].box.y += 1;
   boxes.forEach(obj => obj.box.x = x);
   boxes[3].box.x += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'BlockLeft';
   canvasBox(activeBox);
  },
  async changeBlockDownLeft() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let x = boxes[0].box.x;
   boxes[0].box.y -= 1;
   boxes[1].box.y -= 2;
   boxes[2].box.y -= 1;
   boxes.forEach(obj => obj.box.x = x);
   boxes[0].box.x += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'BlockUpRightDown';
   canvasBox(activeBox);
  },
  async changeBlockUpRightDown() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   let y = boxes[3].box.y;
   boxes[0].box.x -= 1;
   boxes[2].box.x += 1;
   boxes[3].box.x += 2;
   boxes.forEach(obj => obj.box.y = y);
   boxes[0].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'BlockDownLeft';
   canvasBox(activeBox);
  },
  async changeZigZagUpLeft() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   if (boxes[0].box.x > 11) return;
   boxes[0].box.x += 2;
   boxes[1].box.x += 1;
   boxes[3].box.x -= 1;
   boxes[0].box.y += 1;
   boxes[2].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'ZigZagUpLeftR';
   canvasBox(activeBox);
  },
  async changeZigZagUpLeftR() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   boxes[0].box.x -= 2;
   boxes[1].box.x -= 1;
   boxes[3].box.x += 1;
   boxes[0].box.y -= 1;
   boxes[2].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'ZigZagUpLeft';
   canvasBox(activeBox);
  },
  async changeZigZagUpRight() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   if (boxes[0].box.x < 2) return;
   boxes[0].box.x -= 2;
   boxes[1].box.x -= 1;
   boxes[3].box.x += 1;
   boxes[0].box.y += 1;
   boxes[2].box.y += 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'ZigZagUpRightL';
   canvasBox(activeBox);
  },
  async changeZigZagUpRightL() {
   let boxes = activeBox.boxes;
   let boxesClone = utils.deepCopy(activeBox.boxes);
   boxes[0].box.x += 2;
   boxes[1].box.x += 1;
   boxes[3].box.x -= 1;
   boxes[0].box.y -= 1;
   boxes[2].box.y -= 1;
   if (utils.boxOccupied(boxes)) {
    activeBox.boxes = boxesClone;
    return;
   }
   activeBox.name = 'ZigZagUpRight';
   canvasBox(activeBox);
  }
 };
 
 return {
  shapes,
  moveBox,
  levels,
  async controlBlockChange() {
   try {
    changeShapes[`change${activeBox.name}`]();
   } catch (e) { }
  },
  throwDown(mainObj) {
   let boxes = activeBox.boxes;
   function recall() {
    for (let obj of boxes) obj.box.y++;
    if (utils.boxOccupied(boxes) || boxes.find(obj => obj.box.y == 28)) {
     for (let key of boxes) key.box.y--;
     re_render.push(...boxes);
     utils.addScore();
     return newShape();
    }
    recall();
   }
   recall();
  },
  async moveRight() {
   for (let obj of activeBox.boxes) obj.box.x++;
   for (let obj of activeBox.boxes) {
    if (obj.box.x > 13) {
     for (let obj of activeBox.boxes) obj.box.x--;
     return;
    }
   }
   if (utils.boxOccupied(activeBox.boxes)) {
    for (let obj of activeBox.boxes) obj.box.x--;
   } else {
    canvasBox(activeBox);
   }
  },
  async moveLeft() {
   for (let obj of activeBox.boxes) obj.box.x--;
   for (let obj of activeBox.boxes) {
    if (obj.box.x < 0) {
     for (let obj of activeBox.boxes) obj.box.x++;
     return;
    }
   }
   if (utils.boxOccupied(activeBox.boxes)) {
    for (let obj of activeBox.boxes) obj.box.x++;
   } else {
    canvasBox(activeBox);
   }
  },
  showNextBox,
  randomNumber: utils.randomNumber
 }
})();