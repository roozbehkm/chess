const createBoard = () => {
    const board = document.querySelector('.board');
    for (let v = 1; v < 9; v++) {
        for (let h = 1; h < 9; h++) {
            const el = document.createElement('div');
            setD(el, 'type', 'white');

            let classNames = ['tile'];
            if ((h - v) % 2 !== 0) {
                classNames.push('tile--black');
                setD(el, 'type', 'black');
            }

            el.className = classNames.join(' ');
            setD(el, 'pos-y', v);
            setD(el, 'pos-x', h);
            setD(el, 'used-by', '');
            setD(el, 'can-use', false);

            board.append(el);
        }
    }
}
