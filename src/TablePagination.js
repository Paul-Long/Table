import React from 'react';
import PropTypes from 'prop-types';
import {Pagination} from 'antd';

const {Component} = React;

class TablePagination extends Component {
    static defaultProps = {
        isScroll: true
    };

    onChange = (page, pageSize) => {
        const {onChange} = this.props;
        if (typeof onChange === 'function') {
            onChange(page, pageSize);
        }
    };

    render() {
        const height = this.props.height || 0;
        return (
            <div className='rs-table-pagination' style={{height, lineHeight: `${height}px`}}>
                <Pagination
                    current={this.props.current}
                    pageSize={this.props.pageSize}
                    total={this.props.total}
                    onChange={this.onChange}
                />
            </div>
        )
    }
}

export default TablePagination;

TablePagination.propTypes = {
    current: PropTypes.number,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    onChange: PropTypes.func,
    height: PropTypes.number
};
