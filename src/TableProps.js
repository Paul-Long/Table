import React from 'react';
import PropTypes from 'prop-types';

const {Component} = React;
export default class TableProps extends Component {
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
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        sortEnable: PropTypes.bool, // TODO 包含固定列的Table 排序不起作用
        onSortEnd: PropTypes.func
    };

    constructor(props) {
        super(props);
    }
}