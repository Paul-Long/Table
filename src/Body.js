import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import Row from './Row';
import {getKeyData} from './Func';
import Sortable from 'sortablejs';
import {SORT_ANIMATION} from './Config';

const {Component} = React;

class Body extends Component {
    static defaultProps = {
        rowKey: 'id'
    };

    componentDidMount() {
        const {refFunc, fixedHeader} = this.props;
        if (typeof refFunc === 'function') {
            refFunc({
                body: fixedHeader ? this.body : this.content,
                content: this.content
            });
        }
        this.sortAble(this.props.sortEnable);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sortEnable !== this.props.sortEnable) {
            this.sortAble(nextProps.sortEnable);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.width !== this.props.width) {
            return true;
        }
        if (nextProps.fixed !== this.props.fixed) {
            return true;
        }
        if (nextProps.selectValues !== this.props.selectValues) return true;
        if (nextProps.hoverRow !== this.props.hoverRow) return true;
        return nextProps.data !== this.props.data
            || nextProps.clickRow !== this.props.clickRow
            || nextProps.height !== this.props.height
            || nextProps.columns !== this.props.columns;
    }

    sortAble = (sortEnable) => {
        if (this.sort) {
            this.sort.destroy();
            this.sort = null;
        }
        const el = findDOMNode(this.drag);
        if (sortEnable) {
            const {onSortEnd} = this.props;
            this.sort = Sortable.create(el, {
                animation: SORT_ANIMATION,
                onEnd: () => {
                    const arr = this.sort.toArray();
                    if (typeof onSortEnd === 'function') {
                        onSortEnd(arr);
                    }
                }
            });
        }
    };

    reCalcHeight = (prop) => {
        console.log(` reCalc height ${prop.key} : ${prop.value}`);
    };

    onSelect = (value, checked) => {
        const {onSelect} = this.props;
        if (typeof onSelect === 'function') {
            onSelect(value, checked);
        }
    };

    onClick = (value) => {
        const {onClick} = this.props;
        if (typeof onClick === 'function') {
            onClick(value);
        }
    };

    onMouseOver = (key) => {
        const {onMouseOver} = this.props;
        if (typeof onMouseOver === 'function') {
            onMouseOver(key);
        }
    };
    onMouseOut = (key) => {
        const {onMouseOut} = this.props;
        if (typeof onMouseOut === 'function') {
            onMouseOut(key);
        }
    };

    renderTrs = () => {
        const {rowKey, fixed, rowHeight, selectMulti, selectValues = [], hoverRow, clickRow} = this.props;
        const columns = this.props.columns || [];
        const data = this.props.data || [];
        return data.map((d, i) => {
            const k = getKeyData(rowKey.split('.'), d);
            return (
                <Row
                    key={k}
                    dataId={k}
                    columns={columns}
                    rowData={d}
                    hovered={k === hoverRow}
                    clicked={k === clickRow}
                    currentIndex={i}
                    rowHeight={rowHeight}
                    fixed={fixed}
                    selectMulti={selectMulti}
                    reCalcHeight={this.reCalcHeight}
                    checked={selectValues.indexOf(k) > -1}
                    onSelect={(checked) => this.onSelect(k, checked)}
                    onMouseOver={this.onMouseOver.bind(this, k)}
                    onMouseOut={this.onMouseOut.bind(this, k)}
                    onClick={() => this.onClick(k)}
                />
            )
        })
    };

    render() {
        const {fixedHeader, width} = this.props;
        const height = this.props.height || '100%';
        const table = (
            <table ref={r => this.content = r} style={{width: this.props.width}}>
                <tbody ref={r => this.drag = r}>
                {this.renderTrs()}
                </tbody>
            </table>
        );
        if (!fixedHeader) {
            return table;
        }
        return (
            <div
                ref={r => this.body = r}
                className='rs-tbody'
                style={{height, width}}
            >
                {table}
            </div>
        )
    }
}

export default Body;

Body.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
    rowKey: PropTypes.string,
    columns: PropTypes.array,
    rowHeight: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    refFunc: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fixed: PropTypes.oneOf(['left', 'right']),
    selectMulti: PropTypes.bool,
    selectValues: PropTypes.array,
    onSelect: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    hoverRow: PropTypes.string,
    onClick: PropTypes.func,
    clickRow: PropTypes.string,
    fixedHeader: PropTypes.bool,
    sortEnable: PropTypes.bool,
    onSortEnd: PropTypes.func
};
