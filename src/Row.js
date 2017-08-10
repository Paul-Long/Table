import React from 'react';
import PropTypes from 'prop-types';
import Column from './Column';
import SelectColumn from './SelectColumn';
import {COL_KEY, SELECT_KEY, TABLE_SPACE_TD} from './Config';

const {Component} = React;

class Row extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.rowData !== this.props.rowData
            || nextProps.clicked !== this.props.clicked
            || nextProps.columns !== this.props.columns
            || nextProps.checked !== this.props.checked
            || nextProps.hovered !== this.props.hovered;
    }

    renderColumn = (columns, arr = []) => {
        columns.forEach(col => {
            const {tdSpace, children = [], width, render} = col;
            const col_key = col[COL_KEY];
            if (col_key === SELECT_KEY) {
                arr.push(
                    <SelectColumn
                        key={col_key}
                        height={this.props.rowHeight}
                        selectMulti={this.props.selectMulti}
                        onSelect={this.props.onSelect}
                        checked={this.props.checked}
                    />);
            } else {
                if (children.length > 0) {
                    arr = this.renderColumn(children, arr);
                } else {
                    arr.push(
                        <Column
                            key={col_key}
                            className={col_key === TABLE_SPACE_TD ? 'rs-table-space' : ''}
                            columnKey={col_key}
                            width={width}
                            data={this.props.rowData || {}}
                            height={this.props.rowHeight}
                            tdSpace={tdSpace}
                            render={render}
                        />);
                }
            }
        });
        return arr;
    };


    render() {
        const {onMouseOver, onMouseOut, hovered, clicked, columns = [], fixed} = this.props;
        let className = `rs-tr${hovered ? ' rs-tr-hover' : ''}${clicked ? ' rs-tr-clicked' : ''}`;
        const cols = columns.filter(col => col.fixed === fixed);
        return (
            <tr
                ref={r => this.tr = r}
                className={className}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={this.props.onClick}
                data-id={this.props.dataId}
            >
                {this.renderColumn(cols)}
            </tr>
        )
    }
}

export default Row;

Row.propTypes = {
    className: PropTypes.string,
    columns: PropTypes.array,
    rowData: PropTypes.object,
    currentIndex: PropTypes.number,
    rowHeight: PropTypes.number,
    fixed: PropTypes.oneOf(['left', 'right']),
    reCalcHeight: PropTypes.func,
    selectMulti: PropTypes.bool,
    onSelect: PropTypes.func,
    checked: PropTypes.bool,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    hovered: PropTypes.bool,
    clicked: PropTypes.bool,
    onClick: PropTypes.func,
    dataId: PropTypes.string
};
