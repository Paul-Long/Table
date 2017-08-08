import React from 'react';
import PropTypes from 'prop-types';
import TableProps from './TableProps';
import TableHeader from './Header';
import TableBody from './Body';

class TableSimple extends TableProps {
    constructor(props) {
        super(props);
        this.contens = {};
    }

    componentDidMount() {
        this.contens.table = this.table;
        this.refFunc({});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.columns !== this.props.columns
            || nextProps.data !== this.props.data
            || nextProps.selectEnable !== this.props.selectEnable
            || nextProps.selectMulti !== this.props.selectMulti
            || nextProps.height !== this.props.height
            || nextProps.width !== this.props.width
            || nextProps.fixed !== this.props.fixed
            || nextProps.hoverRow !== this.props.hoverRow
            || nextProps.selectValues !== this.props.selectValues;
    }

    calcWidth = (columns, width = 0) => {
        const {fixed} = this.props;
        columns.forEach(c => (c.fixed === fixed) && (width += c.width));
        return width;
    };

    getClassName = () => {
        const {fixed} = this.props;
        return fixed ? `rs-table-fixed-${fixed}` : '';
    };

    refFunc = (refs) => {
        const {refFunc} = this.props;
        if (typeof refFunc === 'function') {
            this.contens = Object.assign({}, this.contens, refs);
            refFunc(this.contens);
        }
    };

    render() {
        const {
            rowKey, data, columns, height, hoverRow, onMouseOver, onMouseOut,
            headerHeight, fixed, width, selectEnable, selectMulti, selectValues, onClick, clickRow,
            checkAll, fixedHeader, getRowCount, headerResizeEnable,
            sortEnable, onSortEnd
        } = this.props;
        const props = {
            columns, fixed, selectEnable, selectMulti, selectValues, fixedHeader,
            width: (fixed ? width : this.calcWidth(this.props.columns))
        };
        const style = {
            width: width,
            minWidth: width,
            maxWidth: width,
            height
        };
        return (
            <div className={`rs-table ${this.getClassName()}`} ref={r => this.table = r} style={style}>
                <TableHeader
                    {...props}
                    refFunc={this.refFunc}
                    onDown={this.props.onDown}
                    onCheckAll={this.props.onCheckAll}
                    checkAll={checkAll}
                    headerResizeEnable={headerResizeEnable}
                />
                <TableBody
                    {...props}
                    refFunc={this.refFunc}
                    data={data}
                    rowKey={rowKey}
                    height={`calc(~'100%' - ${headerHeight}px)`}
                    rowHeight={this.props.rowHeight}
                    onSelect={this.props.onSelect}
                    hoverRow={hoverRow}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    onClick={onClick}
                    clickRow={clickRow}
                    sortEnable={sortEnable}
                    onSortEnd={onSortEnd}
                    getRowCount={getRowCount}
                />
            </div>
        )
    }
}

export default TableSimple;

TableSimple.propTypes = {
    onDown: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fixed: PropTypes.oneOf(['left', 'right']),
    rowHeight: PropTypes.number,
    onSelect: PropTypes.func,
    onCheckAll: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    hoverRow: PropTypes.string,
    onClick: PropTypes.func,
    clickRow: PropTypes.string,
    checkAll: PropTypes.bool,
    refFunc: PropTypes.func
};
