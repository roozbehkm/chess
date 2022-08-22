let playerTurn = 'white';
const burntPiece = {
    white: [],
    black: [],
}

const timer = {
    white: {interval: null, time: 0},
    black: {interval: null, time: 0},
}

createBoard();

const changeTimer = () => {
    clearInterval(timer.white.interval);
    clearInterval(timer.black.interval);

    timer[playerTurn].interval = setInterval(() => {
        timer[playerTurn].time++;

        const t = timer[playerTurn].time;
        let s = Math.floor(t % 60);
        let m = Math.floor(t / 60);

        s = s < 10 ? `0${s}` : s;
        m = m < 10 ? `0${m}` : m;

        $(`[data-timer="${playerTurn}"]`).innerText = `${m}:${s}`;
    }, 1000);
}
changeTimer();

const createNewPawn = (type) => {
    for (let x = 1; x < 9; x++) {
        const y = type === 'black' ? 2 : 7;

        if (!getD(getTile(x, y), 'used-by')) {
            new Piece('pawn', type, x, y).create();
            return;
        }
    }
}

const createNewPiece = (type, positions, name) => {
    positions.forEach((p) => {
        const x = p[0];
        const y = p[1];

        if (!getD(getTile(x, y), 'used-by')) {
            new Piece(name, type, x, y).create();
            return;
        }
    });
}

const createNewRook = (type) => {
    const pos = {
        white: [
            [1,8],
            [8,8],
        ],
        black: [
            [1,1],
            [8,1],
        ],
    };
    createNewPiece(type, pos[type], 'rook');
}

const createNewKnight = (type) => {
    const pos = {
        white: [
            [2,8],
            [7,8],
        ],
        black: [
            [2,1],
            [7,1],
        ],
    };
    createNewPiece(type, pos[type], 'knight');
}

const createNewBishop = (type) => {
    const pos = {
        white: [
            [3,8],
            [6,8],
        ],
        black: [
            [3,1],
            [6,1],
        ],
    };
    createNewPiece(type, pos[type], 'bishop');
}

const createNewQueen = (type) => {
    const pos = {
        white: [
            [4,8],
        ],
        black: [
            [4,1],
        ],
    };
    createNewPiece(type, pos[type], 'queen');
}

const createNewKing = (type) => {
    const pos = {
        white: [
            [5,8],
        ],
        black: [
            [5,1],
        ],
    };
    createNewPiece(type, pos[type], 'king');
}

for (let i = 1; i < 9; i++) {
    createNewPawn('black');
    createNewPawn('white');
}
createNewRook('white');
createNewRook('black');
createNewKnight('white');
createNewKnight('black');
createNewBishop('white');
createNewBishop('black');
createNewQueen('white');
createNewQueen('black');
createNewKing('white');
createNewKing('black');

on(document, 'changedPlace', function (e) {
    const playedWith = e.detail.type;
    removeOpponentPiece(e.detail.x, e.detail.y);
    addNewPainForConquer(playedWith, e.detail.y);
    addLog(e.detail.name, e.detail.type, e.detail.from,e.detail.to);
    playerTurn = getOpponent(playedWith);

    changeTimer();
});

const getOpponent = (type) => {
    switch (type) {
        case 'white': 
            return 'black';
        case 'black':
            return 'white';
    }
}

const addNewPainForConquer = (type, y) => {
    switch (type) {
        case 'white':
            if (y == 1) {createNewPawn(type)}
            break;
        case 'black':
            if (y == 8) {createNewPawn(type)}
            break;
    }
}

let logRow = 0;
const addLog = (name, type, from, to) => {
    logRow ++;

    const alphabet = 'ABCDEFGH';
    const fromY = 8 - from.y + 1;
    const toY = 8 - to.y + 1;

    const msg = `${logRow}.${alphabet[from.x - 1]}${fromY} ${alphabet[to.x - 1]}${toY}`;

    const el = document.createElement('div');
    el.innerText = msg;
    $('#historyLogList').prepend(el); 
}

const removeOpponentPiece = (x, y) => {
    const tile = getTile(x, y);
    const opponentType = getOpponent(playerTurn);
    if (getD(tile, 'used-by') === opponentType) {
        const opponentPiece = getPiece(x,y,opponentType);
        const opponentName = getD(opponentPiece, 'name');

        getBoard().removeChild(opponentPiece);

        de('removedPiece', {
            type: opponentType,
            name: opponentName,
        })
    }
}

on(document, 'removedPiece', function (data) {
    if (data.detail.name === 'king') {
        console.log('>>>>****** ' + getOpponent(data.detail.type) + ' Win ******');
        alert(getOpponent(data.detail.type) + ' Win');
        
        de('win', {
            type: getOpponent(data.detail.type),
        })
    }
    burntPiece[data.detail.type].push(data.detail.name);
});