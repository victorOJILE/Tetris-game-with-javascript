// document.addEventListener('DOMContentLoaded', function () {
    let elCls = (cls) => document.getElementsByClassName(cls);
    let elName = (name) => document.getElementsByName(name);
    let elId = (id) => document.getElementById(id);
    let main_page = elCls('main-page')[0];
    let game_section = elId('game-section');
    let fuck_off = elCls('fuck-off')[0];
    let fuck_off_clWid = fuck_off.clientWidth;
    let fuck_off_clWid2 = fuck_off_clWid/2;
    let new_game = elId('new-game');
    let show_score = elId('score');
    let score = 0;
    let resume = elId('resume');
    let svg = elId('svg');
    let svg_height = svg.height.animVal.value;
    let multiplier, box1, box2, box3, box4, interval, interval2, active;
    let level = 1000;
    let newFlag = true;
    let shapesArrayInt = [
        'intervalVertL',
        'intervalHorizL',
        'intervalPlusUp',
        'intervalPlusRight',
        'intervalPlusDown',
        'intervalPlusLeft',
        'intervalBlockRight',
        'intervalBlockDownRight',
        'intervalBlockLeft',
        'intervalBlockDownLeft',
        'intervalBlockUpRight',
        'intervalBlockUpLeft'
    ];
    let shapesArr = [
        'vertL',
        'horizL',
        'plusUp',
        'plusRight',
        'plusDown',
        'plusLeft',
        'blockRight',
        'blockDownRight',
        'blockLeft',
        'blockDownLeft',
        'blockUpRight',
        'blockUpLeft'
    ];
    let moveShapesArr = [
        'moveVertL',
        'moveHorizL',
        'movePlusUp',
        'movePlusRight',
        'movePlusDown',
        'movePlusLeft',
        'moveBlockRight',
        'moveBlockDownRight',
        'moveBlockLeft',
        'moveBlockDownLeft',
        'moveBlockUpRight',
        'moveBlockUpLeft'
    ]
    // class GridClass {
    //     constructor() {
    //         this._x1 = 2.5; this._x2 = "10"; this._y1 = 0; this._y2 = svg.height.animVal.value; 
    //         this._gridcolor = "rgb(150, 150, 150)";
    //     }
    //     drawGrid() {
    //         for(let i = 0; i < 14; i++) {
    //             svg.innerHTML +=  `<g class="gridlines" stroke="rgb(134 139 175)"><path stroke-width="0.3" stroke-dasharray="3, 3" d="M${this._x1}% ${this._y1}% L${this._x2} ${this._y2}" /></g>`;
    //             if(this._x1 > svg.width.animVal.value || this._x2 > svg.width.animVal.value) { break; }
    //             this._x1 += 17; this._x2 += 17;
    //         }
    //         this._x1 = 0; this._x2 = svg.width.animVal.value; this._y1 = 10; this._y2 = 10;
    //         for(let i = 0; i < 40; i++) {
    //             svg.innerHTML += `<g class="gridlines" stroke="rgb(156 163 213)"><path stroke-width="0.3" stroke-dasharray="3, 3" d="M${this._x1} ${this._y1} L${this._x2} ${this._y2}" /></g>`;
    //             if(this._y1 > svg.height.animVal.value || this._y2 > svg.height.animVal.value) { break; }
    //             this._y1 += 17; this._y2 += 17;
    //         }
    //     }
    // }
    function randomNumber(){
        let randomNum = Math.floor(Math.random() * shapesArrayInt.length);
        return randomNum;
    }
    function incrementScore() {
        score += 5;
        show_score.innerText = score;
    }
    let observer;
    let setMoveInterval = (elem, callback, int) => {
        svg.innerHTML = shapes[elem]();
        box1 = elId("box1"), box2 = elId("box2"), box3 = elId("box3"), box4 = elId('box4');
        interval = setInterval(function() {shapes[callback]()}, int);
        active = elem;
        hitBottom();
    };
    let hitBottom = () => {
        let boxes = [box1, box2, box3, box4];
        function callback() {
            for(let box of boxes) {
                if(box.getAttribute('y') == '96.42857142857143%') {
                    boxes.map((bx) => bx.id = '');
                    newShape();
                    break;
                }
            }
        }
        observer = new MutationObserver(callback);
        boxes.map((box) => {
            observer.observe(box, {attributes: true});
        });
    }
    function newShape() {
        clearInterval(interval);
        observer.disconnect();
        svg.lastElementChild.dataset.active = 'false';
        multiplier = 0;
        let randNum = randomNumber();
        let shape = shapesArr[randNum];
        svg.innerHTML += shapes[shape]();
        box1 = elId("box1"), box2 = elId("box2"), box3 = elId("box3"), box4 = elId('box4');
        interval = '';
        interval = setInterval(function() {shapes[moveShapesArr[randNum]]()}, level);
        active = shapesArr[randNum];
        hitBottom();
    }
    function changeShape(name) {
        svg.lastElementChild.dataset.name = name;
        active = name;
        clearInterval(interval);
        interval = '';
        interval = setInterval(function(){shapes[`move${name[0].toUpperCase()}${name.slice(1)}`]()},level);
    }
    let shapes = {
        height: 3.5714285714285716,
        height2() { return this.height + this.height },
        vertL() {
            return `<g data-active="true" data-name="vertL">
                <rect id="box1" x="42.857%" y="0%" width="7.14286%" height="3.5714285714285716%" style="fill: blue; stroke: #1f293e; stroke-width:1;"/>
                <rect id="box2" x="42.857%" y="${this.height}%" width="7.14286%" height="3.5714285714285716%" style="fill: blue; stroke: #1f293e; stroke-width:1;"/>
                <rect id="box3" x="42.857%" y="${this.height2()}%" width="7.14286%" height="3.5714285714285716%" style="fill: blue; stroke: #1f293e; stroke-width:1;"/>
                <rect id="box4" x="42.857%" y="${this.height2()+this.height}%" width="7.14286%" height="3.5714285714285716%" style="fill: blue; stroke: #1f293e; stroke-width:1;"/>
            </g>`
        },
        moveVertL() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            multiplier -= 3;
        },
        moveVertLleft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            if(calc < -7.14286)return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+"%");
            box3.setAttribute('x', calc+"%");
            box4.setAttribute('x', calc+"%");
        },
        moveVertLright() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 100) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+"%");
            box3.setAttribute('x', calc+"%");
            box4.setAttribute('x', calc+"%");
        },
        changeVertL() {
            let xVal = parseFloat(box2.x.animVal.valueAsString);
            if(xVal > 92.85718 || xVal < 7.14286) { return }
            let y = parseFloat(box2.y.animVal.valueAsString);
            box1.setAttribute('x', xVal-14.28572+"%");
            box1.setAttribute('y', y+"%");
            box2.setAttribute('x', xVal-7.14286+"%");
            box3.setAttribute('y', y+"%");
            box4.setAttribute('x', xVal+7.14286+"%");
            box4.setAttribute('y', y+"%");
            changeShape('horizL');
        },
        horizL() {
            return `<g data-active="true" data-name="horizL">
                <rect id="box1" x="35.714%" y="0" width="7.14286%" height="3.57%" style="fill: blue; stroke: #1f293e; stroke-width:1;"/>
                <rect id="box2" x="42.857%" y="0" width="7.14286%" height="3.57%" style="fill: blue; stroke: #1f293e; stroke-width:1;"/>
                <rect id="box3" x="50%" y="0" width="7.14286%" height="3.57%" style="fill: blue; stroke: #1f293e; stroke-width:1;"/>
                <rect id="box4" x="57.1429%" y="0" width="7.14286%" height="3.57%" style="fill: blue; stroke: #1f293e; stroke-width:1;"/>
            </g>`
        },
        moveHorizL() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
        },
        moveHorizLleft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 0)? 0: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal + 7.14286+"%");
            box3.setAttribute('x', newXVal + 14.2857+"%");
            box4.setAttribute('x', newXVal + 21.42858+"%");
        },
        moveHorizLright() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            let newXVal = (calc > 71.4286)? 71.4286: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal + 7.14286+"%");
            box3.setAttribute('x', newXVal + 14.2857+"%");
            box4.setAttribute('x', newXVal + 21.42858+"%");
        },
        changeHorizL() {
            let xVal = parseFloat(box3.x.animVal.valueAsString);
            let y = parseFloat(box3.y.animVal.valueAsString);
            box1.setAttribute('x', xVal+"%");
            box1.setAttribute('y', y-3.5714285714285716+"%");
            box2.setAttribute('x', xVal+"%");
            box2.setAttribute('y', y+"%");
            box3.setAttribute('y', y+3.5714285714285716+"%");
            box4.setAttribute('x', xVal+"%");
            box4.setAttribute('y', y+7.142857142857143+"%");
            changeShape('vertL');
        },
        plusUp() {
            return `<g data-active="true" data-name="plusUp">
                <rect id="box1" x="50%" y="0" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box2" x="42.857%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box3" x="50%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box4" x="57.14288%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
            </g>`
        },
        movePlusUp() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
        },
        movePlusUpLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            if(calc < 0) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc- 7.14286+"%");
            box3.setAttribute('x', calc+"%");
            box4.setAttribute('x', calc+ 7.14286+"%");
        },
        movePlusUpRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 92.857) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc-7.14286+"%");
            box3.setAttribute('x', calc+"%");
            box4.setAttribute('x', calc+ 7.14286+"%");
        },
        changePlusUp() {
            let xVal = parseFloat(box3.x.animVal.valueAsString);
            let y = parseFloat(box3.y.animVal.valueAsString);
            box2.setAttribute('x', xVal+"%");
            box2.setAttribute('y', y+"%");
            box3.setAttribute('y', y+3.5714285714285716+"%");
            box4.setAttribute('x', xVal+7.142857142857143+"%");
            box4.setAttribute('y', y+"%");
            changeShape('plusRight');
        },
        plusRight() {
            return `<g data-active="true" data-name="plusRight">
                <rect id="box1" x="42.85716%" y="0" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box2" x="42.85716%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box3" x="42.85716%" y="${this.height*2}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box4" x="50%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
            </g>`
        },
        movePlusRight() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier--)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
        },
        movePlusRightLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 0)? 0: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal+"%");
            box3.setAttribute('x', newXVal+"%");
            box4.setAttribute('x', newXVal+7.14286+"%");
        },
        movePlusRightRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 92.857) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+"%");
            box3.setAttribute('x', calc+"%");
            box4.setAttribute('x', calc+7.14286+"%");
        },
        changePlusRight() {
            let xVal = parseFloat(box2.x.animVal.valueAsString);
            if(xVal < 7.142857142857143) return;
            let y = parseFloat(box2.y.animVal.valueAsString);
            box1.setAttribute('x', xVal-7.142857142857143+"%");
            box1.setAttribute('y', y+"%");
            box3.setAttribute('x', xVal+7.142857142857143+"%");
            box3.setAttribute('y', y+"%");
            box4.setAttribute('x', xVal+"%");
            box4.setAttribute('y', y+3.5714285714285716+"%");
            changeShape('plusDown');
        },
        plusDown() {
            return `<g data-active="true" data-name="plusDown">
                <rect id="box1" x="42.85716%" y="0" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box2" x="50%" y="0" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box3" x="57.14288%" y="0" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box4" x="50%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
            </g>`
        },
        movePlusDown() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
        },
        movePlusDownLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 0)? 0: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal+7.14286+"%");
            box3.setAttribute('x', newXVal+14.28572+"%");
            box4.setAttribute('x', newXVal+7.14286+"%");
        },
        movePlusDownRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 85.71432) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+7.14286+"%");
            box3.setAttribute('x', calc+14.28572+"%");
            box4.setAttribute('x', calc+7.14286+"%");
        },
        changePlusDown() {
            let xVal = parseFloat(box2.x.animVal.valueAsString);
            let y = parseFloat(box2.y.animVal.valueAsString);
            box1.setAttribute('x', xVal+"%");
            box1.setAttribute('y', y-3.5714285714285716+"%");
            box2.setAttribute('x', xVal-7.142857142857143+"%");
            box3.setAttribute('x', xVal+"%");
            box3.setAttribute('y', y+3.5714285714285716+"%");
            box4.setAttribute('x', xVal+"%");
            box4.setAttribute('y', y+"%");
            changeShape('plusLeft');
        },
        plusLeft() {
            return `<g data-active="true" data-name="plusLeft">
                <rect id="box1" x="50%" y="0" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box2" x="42.85716%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box3" x="50%" y="${this.height2()}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
                <rect id="box4" x="50%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c66311; stroke: #967102; stroke-width:1;"/>
            </g>`
        },
        movePlusLeft() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier--)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
        },
        movePlusLeftLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 7.14286)? 7.14286: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal-7.14286+"%");
            box3.setAttribute('x', newXVal+"%");
            box4.setAttribute('x', newXVal+"%");
        },
        movePlusLeftRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 100) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc-7.14286+"%");
            box3.setAttribute('x', calc+"%");
            box4.setAttribute('x', calc+"%");
        },
        changePlusLeft() {
            let xVal = parseFloat(box4.x.animVal.valueAsString);
            if(xVal > 92.85718) return;
            let y = parseFloat(box4.y.animVal.valueAsString);
            box3.setAttribute('x', xVal+"%");
            box3.setAttribute('y', y+"%");
            box4.setAttribute('x', xVal+7.142857142857143+"%");
            changeShape('plusUp');
            // Plus left to plus up allows plus up to go -7.142857142857143
        },
        blockRight() {
            return `<g data-active="true" data-name="blockRight">
                <rect id="box1" x="50%" y="0" width="7.14286%" height="3.57%" style="fill: #c61111; stroke: #7f4545; stroke-width:1;"/>
                <rect id="box2" x="50%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c61111; stroke: #7f4545; stroke-width:1;"/>
                <rect id="box3" x="50%" y="${this.height2()}%" width="7.14286%" height="3.57%" style="fill: #c61111; stroke: #7f4545; stroke-width:1;"/>
                <rect id="box4" x="42.85716%" y="${this.height2()}%" width="7.14286%" height="3.57%" style="fill: #c61111; stroke: #7f4545; stroke-width:1;"/>
            </g>`
        },
        moveBlockRight() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            multiplier -= 1;
        },
        moveblockRightLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 7.14286)? 7.14286: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal+"%");
            box3.setAttribute('x', newXVal+"%");
            box4.setAttribute('x', newXVal-7.14286+"%");
        },
        moveblockRightRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 100) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+"%");
            box3.setAttribute('x', calc+"%");
            box4.setAttribute('x', calc-7.14286+"%");
        },
        changeBlockRight() {
            let xVal = parseFloat(box4.x.animVal.valueAsString);
            if(xVal < 7.142857142857143) return;
            let y = parseFloat(box1.y.animVal.valueAsString);
            box1.setAttribute('y', y+3.5714285714285716+"%");
            box2.setAttribute('y', y+7.142857142857143+"%");
            box3.setAttribute('x', xVal+"%");
            box3.setAttribute('y', y+7.142857142857143+"%");
            box4.setAttribute('x', xVal-7.142857142857143+"%");
            changeShape('blockDownRight');
        },
        blockDownRight() {
            return `<g data-active="true" data-name="blockDownRight">
                <rect id="box1" x="57.14288%" y="0" width="7.14286%" height="3.57%" style="fill: #c61111; stroke: #7f4545; stroke-width:1;"/>
                <rect id="box2" x="57.14288%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c61111; stroke: #7f4545; stroke-width:1;"/>
                <rect id="box3" x="50%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c61111; stroke: #7f4545; stroke-width:1;"/>
                <rect id="box4" x="42.85716%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c61111; stroke: #7f4545; stroke-width:1;"/>
            </g>`
        },
        moveBlockDownRight() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
        },
        moveBlockDownRightLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 14.28572)? 14.28572: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal+"%");
            box3.setAttribute('x', newXVal-7.14286+"%");
            box4.setAttribute('x', newXVal-14.28572+"%");
        },
        moveBlockDownRightRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 100) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+"%");
            box3.setAttribute('x', calc-7.14286+"%");
            box4.setAttribute('x', calc-14.28572+"%");
        },
        changeBlockDownRight() {
            let xVal = parseFloat(box4.x.animVal.valueAsString);
            if(xVal > 92.85718) return;
            let y = parseFloat(box1.y.animVal.valueAsString);
            box1.setAttribute('y', y+3.5714285714285716+"%");
            box2.setAttribute('y', y+7.142857142857143+"%");
            box3.setAttribute('x', xVal+"%");
            box3.setAttribute('y', y+7.142857142857143+"%");
            box4.setAttribute('x', xVal-7.142857142857143+"%");
            changeShape('blockLeft');
        },
        blockLeft() {
            return `<g data-active="true" data-name="blockLeft">
                <rect id="box1" x="42.85716%" y="0" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box2" x="42.85716%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box3" x="42.85716%" y="${this.height2()}%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box4" x="50%" y="${this.height2()}%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
            </g>`
        },
        moveBlockLeft() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            multiplier -= 1;
        },
        moveBlockLeftLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 0)? 0: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal+"%");
            box3.setAttribute('x', newXVal+"%");
            box4.setAttribute('x', newXVal+7.14286+"%");
        },
        moveBlockLeftRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 92.85718) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+"%");
            box3.setAttribute('x', calc+"%");
            box4.setAttribute('x', calc+7.14286+"%");
        },
        blockDownLeft() {
            return `<g data-active="true" data-name="blockDownLeft">
                <rect id="box1" x="42.85716%" y="0" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box2" x="42.85716%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box3" x="50%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box4" x="57.14288%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
            </g>`
        },
        moveBlockDownLeft() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
        },
        moveBlockDownLeftLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 0)? 0: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal+"%");
            box3.setAttribute('x', newXVal+7.14286+"%");
            box4.setAttribute('x', newXVal+14.28572+"%");
        },
        moveBlockDownLeftRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 85.71432) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+"%");
            box3.setAttribute('x', calc+7.14286+"%");
            box4.setAttribute('x', calc+14.28572+"%");
        },
        blockUpRight() {
            return `<g data-active="true" data-name="blockUpRight">
                <rect id="box1" x="42.85716%" y="0" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box2" x="50%" y="0%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box3" x="57.14288%" y="0%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box4" x="57.14288%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
            </g>`
        },
        moveBlockUpRight() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
        },
        moveBlockUpRightLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 0)? 0: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal+7.14286+"%");
            box3.setAttribute('x', newXVal+14.28572+"%");
            box4.setAttribute('x', newXVal+14.28572+"%");
        },
        moveBlockUpRightRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 85.71432) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+7.14286+"%");
            box3.setAttribute('x', calc+14.28572+"%");
            box4.setAttribute('x', calc+14.28572+"%");
        },
        blockUpLeft() {
            return `<g data-active="true" data-name="blockUpLeft">
                <rect id="box1" x="42.85716%" y="0" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box2" x="50%" y="0%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box3" x="57.14288%" y="0%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
                <rect id="box4" x="42.85716%" y="${this.height}%" width="7.14286%" height="3.57%" style="fill: #c69811; stroke: #7f7245; stroke-width:1;"/>
            </g>`
        },
        moveBlockUpLeft() {
            box1.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box2.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
            box3.setAttribute('y', `${this.height+((this.height) * multiplier++)}%`);
            box4.setAttribute('y', `${this.height+((this.height) * multiplier)}%`);
        },
        moveBlockUpLeftLeft() {
            let calc = parseFloat(box1.x.animVal.valueAsString) - 7.14286;
            let newXVal = (calc < 0)? 0: calc;
            box1.setAttribute('x', newXVal+"%");
            box2.setAttribute('x', newXVal+7.14286+"%");
            box3.setAttribute('x', newXVal+14.28572+"%");
            box4.setAttribute('x', newXVal+"%");
        },
        moveBlockUpLeftRight() {
            let calc = parseFloat(box1.x.animVal.valueAsString) + 7.14286;
            if(calc > 85.71432) return;
            box1.setAttribute('x', calc+"%");
            box2.setAttribute('x', calc+7.14286+"%");
            box3.setAttribute('x', calc+14.28572+"%");
            box4.setAttribute('x', calc+"%");
        },
    }
    function controlRight() {
        switch (active) {
            case 'vertL':
                shapes.moveVertLright(); break;
            case 'horizL':
                shapes.moveHorizLright(); break;
            case 'plusUp':
                shapes.movePlusUpRight(); break;
            case 'plusRight':
                shapes.movePlusRightRight(); break;
            case 'plusDown':
                shapes.movePlusDownRight(); break;
            case 'plusLeft':
                shapes.movePlusLeftRight(); break;
            case 'blockRight':
                shapes.moveblockRightRight();  break;
            case 'blockDownRight':
                shapes.moveBlockDownRightRight(); break;
            case 'blockLeft':
                shapes.moveBlockLeftRight();  break;
            case 'blockDownLeft':
                shapes.moveBlockDownLeftRight();  break;
            case 'blockUpRight':
                shapes.moveBlockUpRightRight(); break;
            case 'blockUpLeft':
                shapes.moveBlockUpLeftRight(); break;
            default:
                return;
        }
    }
    function controlLeft() {
        switch (active) {
            case 'vertL':
                shapes.moveVertLleft(); break;
            case 'horizL':
                shapes.moveHorizLleft(); break;
            case 'plusUp':
                shapes.movePlusUpLeft(); break;
            case 'plusRight':
                shapes.movePlusRightLeft(); break;
            case 'plusDown':
                shapes.movePlusDownLeft(); break;
            case 'plusLeft':
                shapes.movePlusLeftLeft(); break;
            case 'blockRight':
                shapes.moveblockRightLeft();  break;
            case 'blockDownRight':
                shapes.moveBlockDownRightLeft(); break;
            case 'blockLeft':
                shapes.moveBlockLeftLeft();  break;
            case 'blockDownLeft':
                shapes.moveBlockDownLeftLeft();  break;
            case 'blockUpRight':
                shapes.moveBlockUpRightLeft(); break;
            case 'blockUpLeft':
                shapes.moveBlockUpLeftLeft(); break;
            default:
                return;
        }
    }
    function controlBlockChange() {
        switch (active) {
            case 'vertL':
                shapes.changeVertL(); break;
            case 'horizL':
                shapes.changeHorizL(); break;
            case 'plusUp':
                shapes.changePlusUp(); break;
            case 'plusRight':
                shapes.changePlusRight(); break;
            case 'plusDown':
                shapes.changePlusDown(); break;
            case 'plusLeft':
                shapes.changePlusLeft(); break;
            case 'blockRight':
                shapes.changeBlockRight(); break;
            default:
                return;
        }
    }
    window.addEventListener('keydown', (e) => {
        if(!main_page.classList.contains('hide')) {
            if(e.key == 'Enter') {
                console.log('enter clicked');
            }
            else {
                return;
            }
        };
        let key = e.key;
        if(key == 'ArrowRight') {
            controlRight();
        }else if(key == 'ArrowLeft') {
            controlLeft();
        }else if(key == ' ') {
            clearInterval(interval);
            resume.classList.remove('hide');
            main_page.classList.remove('hide');
        }else if(key == 'ArrowUp') {
            controlBlockChange();
        }
    });
    function startGame() {
        main_page.classList.add('hide');
        multiplier = 0;
        // let randNum = randomNumber();
        // setMoveInterval(shapesArr[randNum], moveShapesArr[randNum], level);
        setMoveInterval('blockRight', 'moveBlockRight', level);
    };
    new_game.addEventListener('click', (e) => {
        startGame();
    })
    fuck_off.addEventListener('click', (e) => {
        if(e.clientX >= fuck_off_clWid2) {
            controlRight(active);
        }else {
            controlLeft(active);
        }
    });
// });
