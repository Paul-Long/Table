import React from 'react';
import PropTypes from 'prop-types';

const {Component} = React;
export default class TableProps extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        className: PropTypes.string,
        rowKey: PropTypes.string,
        data: PropTypes.array,
        columns: PropTypes.array,
        style: PropTypes.object,
        headerHeight: PropTypes.number,
        rowHeight: PropTypes.number,
        fixedHeader: PropTypes.bool,
        selectEnable: PropTypes.bool,
        selectMulti: PropTypes.bool,
        selectValues: PropTypes.array,
        onSelected: PropTypes.func,
        headerResizeEnable: PropTypes.bool,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        sortEnable: PropTypes.bool, // TODO 包含固定列的Table 排序不起作用
        onSortEnd: PropTypes.func,
        getRowCount: PropTypes.func
    };
}
