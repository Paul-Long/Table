import {HEADER_DEFAULT_WIDTH, MIN_WIDTH, TABLE_SPACE_TD} from './Config';

export const getKeyData = (keys, obj, index = 0) => {
    const k = keys[index];
    if (!obj) {
        return '';
    }
    if (keys.length > index) {
        return getKeyData(keys, obj[k], index + 1);
    }
    return obj;
};

export const resetColumn = (columns = [], layer = 1) => {
    return columns.map(col => {
        let children = col.children || [];
        col.row = 1;
        col.layer = layer;
        if (children.length > 0) {
            children = resetColumn(children, layer + 1);
            let colSpan = 0;
            let row = col.row;
            let width = 0;
            children.forEach(c => {
                colSpan += c.colSpan;
                let r = row + c.row;
                col.row = Math.max(r, col.row);
                width += c.width;
            });
            col.colSpan = colSpan;
            col.width = width;
        } else {
            col.width = col.width || HEADER_DEFAULT_WIDTH;
            col.minWidth = col.minWidth || MIN_WIDTH;
            if (col.key === TABLE_SPACE_TD) {
                col.minWidth = 0;
            }
            col.colSpan = 1;
        }
        return col;
    })
};

export const maxBy = (array, iteratee) => {
    if (!array || !iteratee || array.length <= 0) {
        return undefined;
    }
    let max = 0;
    array.forEach(a => max = Math.max(a[iteratee], max));
    return max;
};

export const setRow = (columns = [], totalRow, ratio = 1, hasRow = 0) => {
    return columns.map(col => {
        const children = col.children || [];
        if (hasRow === 0) {
            ratio = Math.floor(totalRow / col.row);
            const remainder = totalRow % col.row;
            col.rowSpan = remainder === 0 ? ratio : ratio + remainder;
        } else {
            col.rowSpan = col.row === 1 ? totalRow - hasRow : ratio;
        }
        if (children.length > 0) {
            col.children = setRow(children, totalRow, ratio, col.rowSpan + hasRow);
        }
        return col;
    });
};

export const VVG = {
    $: function (id) {
        return typeof id === 'string' ? document.getElementById(id) : id;
    },
    bindEvent: function (node, type, func) {
        if (node.addEventListener) {
            node.addEventListener(type, func, false);
        } else if (node.attachEvent) {
            node.attachEvent('on' + type, func);
        } else {
            node['on' + type] = func;
        }
    },
    onWheel: function (node, func) {
        node.onmousewheel = func;
        if (node.addEventListener) {
            node.addEventListener('DOMMouseScroll', func);
        }
    },
    getEvent: function (event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    userSelectNone: function (node, className = 'user-select-none') {
        document.body.className = className;
        node.ownerDocument.body.className = className;
    }
};
