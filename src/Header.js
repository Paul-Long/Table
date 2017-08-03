import React from 'react';
import PropTypes from 'prop-types';
import HeaderColumn from './HeaderColumn';

const {Component} = React;

class Header extends Component {
    componentDidMount() {
        const {refFunc} = this.props;
        if (typeof refFunc === 'function') {
            refFunc({header: this.header});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.columns !== this.props.columns
            || nextProps.checkAll !== this.props.checkAll;
    }

    renderCol = () => {
        const {columns, selectMulti} = this.props;
        const cols = columns.filter(col => col.fixed === this.props.fixed);
        return cols.map(col => (
            <HeaderColumn
                key={col.key}
                colData={col}
                selectMulti={selectMulti}
                onCheckAll={this.props.onCheckAll}
                checkAll={this.props.checkAll}
                onDown={this.props.onDown}
            />
        ));
    };

    render() {
        const {width} = this.props;
        return (
            <table ref={r => this.header = r} style={{width}}>
                <thead className='rs-table-header'>
                <tr>{this.renderCol()}</tr>
                </thead>
            </table>
        )
    }
}

export default Header;

Header.propTypes = {
    columns: PropTypes.array,
    className: PropTypes.string,
    onWidthChange: PropTypes.func,
    onDown: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    refFunc: PropTypes.func,
    fixed: PropTypes.oneOf(['left', 'right']),
    selectEnable: PropTypes.bool,
    selectMulti: PropTypes.bool,
    onCheckAll: PropTypes.func,
    checkAll: PropTypes.bool
};
