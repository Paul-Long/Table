import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import TableProps from './TableProps';
import TableSimple from './TableSimple';
import {TABLE_SPACE_TD} from './Config';
import {getKeyData, maxBy, resetColumn, setRow, VVG} from './Func';

class Manager extends TableProps {
    static defaultProps = {
        fixed: []
    };
    onWindowResize = () => {
        const self = findDOMNode(this.dom);
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            if (self) {
                const rect = self.getBoundingClientRect();
                this.width = rect.width;
                this.height = rect.height - rect.bottom;
                this.left = rect.left;
                this.setState({columns: this.resetTableSize(this.state.columns)});
            }
            this.timer = null;
        }, 200);
    };
    setColumns = (columns = [], indexKey, width) => {
        return columns.map(col => {
            let children = col.children || [];
            if (col.key === indexKey) {
                col.width = Math.max(col.minWidth, width + col.width);
                if (col.maxWidth && typeof col.maxWidth === 'number') {
                    col.width = Math.min(col.width, col.maxWidth);
                }
            } else if (children.length > 0) {
                children = this.setColumns(children, indexKey, width);
                let w = 0;
                children.forEach(c => w += c.width);
                col.width = w;
                col.children = children;
            }
            return Object.assign({}, col);
        });
    };
    handleColumnReady = (prop) => {
        if (!prop.width) return;
        const columns = this.setColumns(this.state.columns, prop.indexKey, prop.width);
        this.setState({columns: this.resetTableSize(columns)});
    };
    resetTableSize = (columns = []) => {
        let center = 0, left = 0, right = 0, lastWidth = 0;
        columns.forEach(col => {
            if (col.fixed === 'left') {
                left += col.width;
            } else if (col.fixed === 'right') {
                right += col.width;
            } else if (col.key === TABLE_SPACE_TD) {
                lastWidth = col.width;
            } else {
                center += col.width;
            }
        });
        if (center + left + right < this.width) {
            lastWidth = this.width - center - left - right;
            center = center + lastWidth;
        } else {
            lastWidth = 0;
        }
        columns = columns.map(col => {
            if (col.key === TABLE_SPACE_TD) {
                col.width = lastWidth;
                col = Object.assign({}, col);
            }
            return col;
        });
        this.tableSize.left.width = left;
        this.tableSize.right.width = right;
        this.tableSize.center.width = this.width - left - right;
        this.calcScroll(center);
        return columns;
    };
    calcScroll = (center) => {
        const cTable = this.tables.center;
        const {onResize, fixedHeader} = this.props;
        if (typeof onResize === 'function' && cTable && this.dom) {
            let width = this.dom.clientWidth;
            let height = this.dom.clientHeight;
            let cTableWidth = this.tableSize.center.width;
            let cHeaderHeight = cTable.header.clientHeight;
            let cContentWidth = center;
            let cContentHeight = cTable.content.clientHeight;
            const vScroll = {};
            if (fixedHeader) {
                vScroll.height = height - cHeaderHeight;
                vScroll.sHeight = cContentHeight;
                vScroll.top = cHeaderHeight;
                vScroll.vTable = Object.values(this.tables).map(o => o.body);
            } else {
                vScroll.height = height;
                vScroll.sHeight = cHeaderHeight + cContentHeight;
                vScroll.top = 0;
                vScroll.vTable = Object.values(this.tables).map(o => o.table);
            }
            const hScroll = {
                width: width,
                sWidth: (width * cContentWidth) / cTableWidth,
                radio: cTableWidth / width,
                hTable: [cTable.table]
            };
            onResize({vScroll, hScroll});
        }
    };
    drag = (event) => {
        event = VVG.getEvent(event);
        switch (event.type) {
            case 'mousedown':
                const target = VVG.getTarget(event);
                this.dragKey = target.getAttribute('data-id');
                const self = findDOMNode(this.dom);
                const rect = self.getBoundingClientRect();
                if (this.dragKey) {
                    this.dragging = this.widthLine;
                    this.widthLine.style.display = 'block';
                    this.widthLine.style.left = event.clientX - rect.left + 'px';
                    this.dragStart = event.clientX;
                    VVG.userSelectNone(this.dom);
                    this.dom.style.cursor = 'col-resize';
                }
                break;
            case 'mousemove':
                if (this.dragging && this.dragKey) {
                    const self = findDOMNode(this.dom);
                    const rect = self.getBoundingClientRect();
                    this.widthLine.style.left = event.clientX - rect.left + 'px';
                }
                break;
            case 'mouseup':
                if (this.dragging && this.dragKey) {
                    this.dragging = null;
                    VVG.userSelectNone(this.dom, '');
                    const moveSize = event.clientX - this.dragStart;
                    this.handleColumnReady({indexKey: this.dragKey, width: moveSize});
                    this.dragKey = null;
                    this.widthLine.style.display = 'none';
                    this.dom.style.cursor = 'auto';
                }
                break;
        }
        if (this.dragging) {
            event.preventDefault();
        }
    };
    onWheel = (e) => {
        const {fixedHeader, onWheel} = this.props;
        const scrollMoveSize = 20;
        const current = findDOMNode(fixedHeader ? this.tables.center.body : this.tables.center.table);
        let moveSize = 0;
        e = e || window.event;
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                moveSize = moveSize + scrollMoveSize;
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                moveSize = moveSize - scrollMoveSize;
            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail > 0) { //当滑轮向上滚动时
                moveSize = moveSize + scrollMoveSize;
            }
            if (e.detail < 0) { //当滑轮向下滚动时
                moveSize = moveSize - scrollMoveSize;
            }
        }
        moveSize = current.scrollTop + moveSize;
        if (current.scrollHeight - current.clientHeight <= moveSize) {
            moveSize = current.scrollHeight - current.clientHeight;
        }
        Object.values(this.tables).forEach(t => {
            const current = fixedHeader ? t.body : t.table;
            current.scrollTop = moveSize;
        });
        if (typeof onWheel === 'function') {
            onWheel(moveSize);
        }
    };
    onSelect = (value, checked) => {
        const isMove = (this.dragging && this.dragKey);
        if (isMove) return;
        let selectValues = this.state.selectValues || [];
        const {selectMulti} = this.props;
        if (selectMulti) {
            if (checked) {
                selectValues.push(value);
            } else {
                selectValues = selectValues.filter(s => s !== value);
            }
        } else {
            selectValues = checked ? [value] : [];
        }
        const filter = this.keyAll.filter(k => selectValues.indexOf(k) < 0);
        let checkAll = filter.length === 0;
        this.setState({selectValues: [].concat(selectValues), checkAll: checkAll});
    };
    onSelectAll = (checked) => {
        this.setState({selectValues: checked ? this.keyAll : [], checkAll: checked});
    };
    onMouseOver = (key) => {
        const isMove = (this.dragging && this.dragKey);
        if (isMove) return;
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
        this.setState({hoverRow: key});
    };
    onMouseOut = () => {
        const isMove = (this.dragging && this.dragKey);
        if (isMove) return;
        this.hoverTimer = setTimeout(() => {
            if (this.hoverTimer) {
                this.setState({hoverRow: undefined});
                clearTimeout(this.hoverTimer);
                this.hoverTimer = null;
            }
        }, 200);
    };
    onClick = (value) => {
        const isMove = (this.dragging && this.dragKey);
        if (isMove) return;
        const {clickRow} = this.state;
        if (value !== clickRow) {
            this.setState({clickRow: value});
        } else {
            this.setState({clickRow: undefined});
        }
    };
    getTableProps = () => {
        const {
            rowKey, data, fixedHeader, rowHeight, selectMulti, selectEnable, headerHeight,
            sortEnable, onSortEnd
        } = this.props;
        const {selectValues, hoverRow, clickRow, checkAll, columns} = this.state;
        const tableBaseProps = {
            columns, data, rowKey, fixedHeader, rowHeight,
            selectMulti, selectValues, selectEnable,
            checkAll, hoverRow, clickRow,
            sortEnable: this.props.fixed.length === 0 && sortEnable, onSortEnd,
            headerHeight: headerHeight * this.rowSpan,
            height: this.height
        };
        return {
            ...tableBaseProps,
            onSelect: this.onSelect,
            onMouseOver: this.onMouseOver,
            onMouseOut: this.onMouseOut,
            onClick: this.onClick
        }
    };
    renderLeftFixed = () => {
        const fixed = this.props.fixed || [];
        if (fixed.indexOf('left') > -1) {
            const tableProps = this.getTableProps();
            tableProps.width = this.tableSize.left.width || 'auto';
            return (
                <TableSimple
                    refFunc={refs => this.refFunc('left', refs)}
                    fixed='left'
                    {...tableProps}
                    onCheckAll={this.onSelectAll}
                />
            )
        }
    };
    renderRightFixed = () => {
        const fixed = this.props.fixed || [];
        if (fixed.indexOf('right') > -1) {
            const tableProps = this.getTableProps();
            tableProps.width = this.tableSize.right.width || 'auto';
            return (
                <TableSimple
                    refFunc={refs => this.refFunc('right', refs)}
                    fixed='right'
                    {...tableProps}
                />
            )
        }
    };
    refFunc = (key, refs) => {
        this.tables[key] = refs;
    };

    constructor(props) {
        super(props);
        let selectValues = [];
        let columns = resetColumn(props.columns || []);
        this.rowSpan = maxBy(columns, 'row');
        columns = setRow(columns, this.rowSpan);
        if (props.selectEnable) {
            selectValues = props.selectValues || [];
        }
        this.hoverTimer = null;
        const data = props.data || [];
        this.keyAll = data.map(d => getKeyData(props.rowKey.split('.'), d));

        this.tables = {};
        this.tableSize = {
            left: {width: 0, height: 0},
            center: {width: 0, height: 0},
            right: {width: 0, height: 0}
        };

        this.dragging = null;
        this.dragKey = null;
        this.dragStart = null;

        this.state = {
            selectValues,
            hoverRow: undefined,
            clickRow: undefined,
            checkAll: false,
            columns: this.resetTableSize(columns)
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.data !== this.props.data
            || nextState.clickRow !== this.state.clickRow
            || nextState.checkAll !== this.state.checkAll
            || nextState.hoverRow !== this.state.hoverRow
            || nextState.selectValues !== this.state.selectValues
            || nextState.columns !== this.state.columns;
    }

    componentDidMount() {
        this.onWindowResize();
        const ownerDocument = this.dom.ownerDocument;
        VVG.onWheel(ownerDocument, this.onWheel);
        VVG.bindEvent(ownerDocument, 'mousedown', this.drag);
        VVG.bindEvent(ownerDocument, 'mousemove', this.drag);
        VVG.bindEvent(ownerDocument, 'mouseup', this.drag);
        VVG.bindEvent(window, 'resize', this.onWindowResize);
    }

    render() {
        let props = {
            className: 'rs-table-manager',
            ref: r => this.dom = r
        };
        if (!this.props.isScroll) {
            props.className += ' rs-has-pagination';
        }
        const tableProps = this.getTableProps();
        tableProps.width = this.tableSize.center.width || 'auto';
        return (
            <div {...props}>
                {this.renderLeftFixed()}
                <TableSimple
                    refFunc={refs => this.refFunc('center', refs)}
                    {...tableProps}
                />
                {this.renderRightFixed()}
                <div className='rs-width-move-line' ref={r => this.widthLine = r} />
            </div>
        )
    }
}

export default Manager;

Manager.propTypes = {
    fixed: PropTypes.array,
    onWheel: PropTypes.func,
    onResize: PropTypes.func,
    style: PropTypes.object
};
