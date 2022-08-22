const $ = (query) => document.querySelector(query);
const $$ = (query) => document.querySelectorAll(query);
const getBoard = () => $('.board');
const getTile = (x,y) => $(`.tile[data-pos-y="${y}"][data-pos-x="${x}"]`);
const getPiece = (x,y, type) => $(`.piece[data-pos-y="${y}"][data-pos-x="${x}"][data-type="${type}"]`);
const on = (el, eventName, closure) => el.addEventListener(eventName, closure);
const de = (eventName, data) => document.dispatchEvent(
    new CustomEvent(eventName, { detail: data})
)
const setD = (el, attrName, val) => el.setAttribute(`data-${attrName}`, val);
const getD = (el, attrName) => el.getAttribute(`data-${attrName}`);