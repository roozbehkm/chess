class Piece {
    element = null;
    name = '';
    type = '';
    posX = '';
    posY = '';
    newPosX = 0;
    newPosY = 0;
    changedPosition = false;

    constructor(name, type, posX, posY) {
        this.name = name;
        this.type = type;
        this.posX = posX;
        this.posY = posY;

        return this;
    }

    create() {
        const pieces = {
            pawn: {
                white: '♙',
                black: '♟',
            },
            knight: {
                white: '♘',
                black: '♞',
            },
            bishop: {
                white: '♗',
                black: '♝',
            },
            rook: {
                white: '♖',
                black: '♜',
            },
            king: {
                white: '♕',
                black: '♛',
            },
            queen: {
                white: '♔',
                black: '♚',
            },
        }

        const board = $('.board');

        ///////////////////////
        const parentEl = getTile(this.posX,this.posY);
        const parentX = parentEl.offsetLeft;
        const parentY = parentEl.offsetTop;
        setD(parentEl, 'used-by', this.type);

        const el = document.createElement('div');
        el.className = ['piece', `piece--${this.type}`].join(' ');
        setD(el, 'pos-x', this.posX);

        setD(el, 'pos-y', this.posY);

        setD(el, 'type', this.type);

        setD(el, 'name', this.name);
        el.setAttribute('draggable', true);

        el.style.top = `${parentY}px`;
        el.style.left = `${parentX}px`;
        el.innerText = pieces[this.name][this.type];
        ///////////////////////
        
        on(el, 'click', function () {
            this.showMovingPositions();
        }.bind(this));

        on(el, 'dragstart', function () {
            this.showMovingPositions();
        }.bind(this));

        this.element = el;

        board.append(el);
    }

    moveTo(posX, posY) {
        if (!this.element) {
            return;
        }

        const oldPosX = this.posX;
        const oldPosY = this.posY;
        // change used by attr old tile
        const oldTile = getTile(this.posX,this.posY);
        setD(oldTile, 'used-by', '');
        setD(oldTile, 'can-use', true);


        this.posX = posX;
        this.posY = posY;
        this.changedPosition = true;

        const parentEl = getTile(this.posX,this.posY);
        
        if (getD(parentEl, 'can-use') == 'false') {
            return;
        }

        de('changedPlace', {
                name: this.name,
                type: this.type,
                x: this.posX,
                y: this.posY,
                from: {
                    x: oldPosX,
                    y: oldPosY,
                },
                to: {
                    x: this.posX,
                    y: this.posY,
                },
            }
        );
        
        const parentX = parentEl.offsetLeft;
        const parentY = parentEl.offsetTop;
        setD(parentEl, 'used-by', this.type);

        setD(this.element, 'pos-x', this.posX);
        setD(this.element, 'pos-y', this.posY);

        this.element.style.top = `${parentY}px`;
        this.element.style.left = `${parentX}px`; 
        
        this.clearCanUseClass();   
    }

    pawnPositions() {
        const defPos = {
            white: [
                [0, -1],
            ],
            black: [
                [0, 1],
            ],
        }
        if (!this.changedPosition) {
            defPos.white.push([0, -2]);
            defPos.black.push([0, 2]);
        }

        const extraPos = {
            white: [
                [-1, -1],
                [1, -1],
            ],
            black: [
                [1, 1],
                [-1 , 1],
            ]
        };

        const pos = [];
        defPos[this.type].forEach((p) => {
            const x = p[0];
            const y = p[1];
            
            const tile = getTile(this.posX + x, this.posY + y);
            if (tile && !getD(tile, 'used-by')) {
                pos.push([this.posX + x, this.posY + y]);
            }
        });

        extraPos[this.type].forEach((p) => {
            const x = p[0];
            const y = p[1];
            
            const tile = getTile(this.posX + x, this.posY + y);
            if (tile) {
                const usedBy = getD(tile, 'used-by');
                if (usedBy && usedBy !== this.type) {
                    pos.push([this.posX + x, this.posY + y]);
                }
            }
        })

        return pos;

    }

    knightPositions() {
        const defPos = [
            [-1, 2],
            [1, 2],
            [-1, -2],
            [1, -2],
            [-2, 1],
            [-2, -1],
            [2, 1],
            [2, -1],
        ];

        const pos = [];
        defPos.forEach((p) => {
            const x = p[0];
            const y = p[1];
            
            const tile = getTile(this.posX + x, this.posY + y);
            if (tile && getD(tile, 'used-by') !== this.type) {
                pos.push([this.posX + x, this.posY + y]);
            }
        });

        return pos;
    }

    bishopPositions() {
        const pos = [];
        let leftTop = true;
        let rightTop = true;
        let leftBottom = true;
        let rightBottom = true;
        let tile;

        for(let i = 1; i < 9; i++) {
            for (let y = 1; y < 9; y++) {
                if (i == y) {
                    tile = getTile(this.posX - i , this.posY - y);
                    if (leftTop && tile && getD(tile, 'used-by') !== this.type)
                        pos.push([this.posX - i , this.posY - y]);
                    if (tile && getD(tile, 'used-by')) {leftTop = false}

                    tile = getTile(this.posX + i , this.posY + y);
                    if (rightBottom && tile && getD(tile, 'used-by') !== this.type)
                        pos.push([this.posX + i , this.posY + y]);
                    if (tile && getD(tile, 'used-by')) {rightBottom = false}

                    tile = getTile(this.posX + (i * -1) , this.posY + y);
                    if (leftBottom && tile && getD(tile, 'used-by') !== this.type)
                        pos.push([this.posX + (i * -1) , this.posY + y]);
                    if (tile && getD(tile, 'used-by')) {leftBottom = false}

                    tile = getTile(this.posX + i , this.posY + (y * -1));
                    if (rightTop && tile && getD(tile, 'used-by') !== this.type)
                        pos.push([this.posX + i , this.posY + (y * -1)]);
                    if (tile && getD(tile, 'used-by')) {rightTop = false}
                }
            }
        }

        return pos;
    }
    
    rookPositions() {
        const p = [];
        // for X
        for (let i = this.posX + 1; i < 9; i ++) {
            const tile = getTile(i, this.posY);
            if (getD(tile, 'used-by') === getOpponent(this.type)) {
                p.push([i, this.posY]);
            }

            if (!getD(tile, 'used-by')) {
                p.push([i, this.posY]);
            } else { break; }
            
        }
        for (let i = this.posX - 1; i > 0; i --) {
            const tile = getTile(i, this.posY);
            if (getD(tile, 'used-by') === getOpponent(this.type)) {
                p.push([i, this.posY]);
            }

            if (!getD(tile, 'used-by')) {
                p.push([i, this.posY]);
            } else { break; }
        }

        // for Y
        for (let i = this.posY + 1; i < 9; i ++) {
            const tile = getTile(this.posX, i);
            if (getD(tile, 'used-by') === getOpponent(this.type)) {
                p.push([this.posX, i]);
            }

            if (!getD(tile, 'used-by')) {
                p.push([this.posX, i]);
            } else { break; }
        }
        for (let i = this.posY - 1; i > 0; i --) {
            const tile = getTile(this.posX, i);
            if (getD(tile, 'used-by') === getOpponent(this.type)) {
                p.push([this.posX, i]);
            }

            if (!getD(tile, 'used-by')) {
                p.push([this.posX, i]);
            } else { break; }
        }
        return p;
    }

    kingPositions() {
        const defPos = [
            [-1, 0],
            [1, 0],
            [-1, -1],
            [1, 1],
            [1, -1],
            [-1, 1],
            [0, 1],
            [0, -1],
        ];

        const pos = [];
        defPos.forEach((p) => {
            const x = p[0];
            const y = p[1];
            
            const tile = getTile(this.posX + x, this.posY + y);
            if (tile && getD(tile, 'used-by') !== this.type) {
                pos.push([this.posX + x, this.posY + y]);
            }
        });
        return pos;
    }

    queenPositions() {
        return [...this.rookPositions() , ...this.bishopPositions()];
    }

    showMovingPositions() {
        this.clearCanUseClass();

        if (this.type !== playerTurn) {
            return;
        }

        let posList = this[`${this.name}Positions`]();

        posList.forEach((p) => {
            const x = p[0];
            const y = p[1];
            const parentEl = getTile(x,y);
            if (!parentEl) {
                return;
            }

            parentEl.className += ' tile--canUse';
            setD(parentEl, 'can-use', true);

            this.newPosX = x;
            this.newPosY = y;

            on(parentEl, 'click', function() {
                this.moveTo(x, y);
            }.bind(this));

            on(parentEl, 'dragover', function(e) {
                e.preventDefault();
            }.bind(this));

            on(parentEl, 'drop', function(e) {
                e.preventDefault();
                this.moveTo(x, y);
            }.bind(this));
        })
        return posList;
    }

    clearCanUseClass() {
        $$(`.tile--canUse`).forEach((el) => {
            setD(el, 'can-use', false);
            el.className = el.className.replace(' tile--canUse', '');

            // remove listenners
            el.replaceWith(el.cloneNode(true));
        })
    }
}