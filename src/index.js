import React from 'react';
import PropTypes from 'prop-types';
import Scroll from './Scroll';
import TableProps from './TableProps';
import Manager from './Manager';
import * as TableConfig from './Config';
import TablePagination from './TablePagination';
import './style/index.less';

class Table extends TableProps {
    constructor(props) {
        super(props);
        this.columns = props.columns || [];
        const hasSelect = this.columns.filter(c => c.key === TableConfig.SELECT_KEY);
        const hasSpaceTd = this.columns.filter(c => c.key === TableConfig.TABLE_SPACE_TD);
        const fixed = this.columns.filter(c => c.fixed === 'left' || c.fixed === 'right');
        if (props.selectEnable && hasSelect && hasSelect.length === 0) {
            this.columns.unshift({
                key: TableConfig.SELECT_KEY,
                title: '',
                width: 50,
                minWidth: 50,
                maxWidth: 50,
                fixed: fixed.length > 0 ? 'left' : undefined,
                thSpace: 'center'
            });
        }
        if (hasSpaceTd && hasSpaceTd.length === 0) {
            this.columns.push({key: TableConfig.TABLE_SPACE_TD, title: '', width: 0, minWidth: 0});
        }
        this.fixed = [];
        this.columns.forEach(c => {
            if (c.fixed && this.fixed.indexOf(c.fixed) < 0) {
                this.fixed.push(c.fixed);
            }
        });
        const pagination = props.pagination || {};
        const current = pagination.current || 1;
        this.state = {
            paginationHeight: 0,
            current: current,
            vScroll: {height: 0, sHeight: 0, top: 0},
            hScroll: {width: 0, sHeight: 0, radio: 1}
        };
    }

    componentDidMount() {
        const isScroll = this.props.isScroll;
        const paginationHeight = isScroll ? 0 : TableConfig.PAGINATION_HEIGHT;
        this.setState({paginationHeight});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.hScroll !== this.state.hScroll
            || nextState.vScroll !== this.state.vScroll
            || nextProps.data !== this.props.data
            || nextProps.pagination !== this.props.pagination;
    }

    onRefresh = () => {
        const {pagination = {}, isScroll} = this.props;
        if (!isScroll) return;
        const {current, pageSize, total, onChange} = pagination;
        if (current < Math.ceil(total / pageSize) && typeof onChange === 'function') {
            onChange(current + 1, pageSize);
        }
    };

    onWheel = (size) => {
        this.scrollY.setTop(size);
    };

    onResize = (scroll) => {
        this.setState(scroll);
    };

    renderPagination = () => {
        const {isPage, isScroll} = this.props;
        if (!isPage) return '';
        if (isScroll) return '';
        return (
            <TablePagination
                {...this.props.pagination}
                height={this.state.paginationHeight}
                isScroll={this.props.isScroll}
            />
        )
    };

    render() {
        let {...props} = this.props;
        const {vScroll, hScroll} = this.state;
        return (
            <div className='rs-table-wrapper'>
                <Manager
                    {...props}
                    fixed={this.fixed}
                    onWheel={this.onWheel}
                    onResize={this.onResize}
                />
                <Scroll
                    ref={r => this.scrollY = r}
                    {...vScroll}
                    {...hScroll}
                    scrollEndSize={this.props.scrollEndSize}
                    onRefresh={this.onRefresh}
                    style={{bottom: `${this.state.paginationHeight}px`}}
                />
                {this.renderPagination()}
            </div>
        )
    }
}

export default Table;

Table.propTypes = {
    isScrollEndRefresh: PropTypes.bool,
    scrollEndSize: PropTypes.number,
    pagination: PropTypes.object,
    isPage: PropTypes.bool,
    isScroll: PropTypes.bool
};
Table.defaultProps = {
    headerHeight: TableConfig.HEADER_HEIGHT,
    rowHeight: TableConfig.ROW_HEIGHT,
    fixedHeader: true,
    isScrollEndRefresh: true,
    scrollEndSize: TableConfig.SCROLL_END_SIZE,
    selectEnable: TableConfig.SELECT_ENABLE,
    selectMulti: TableConfig.SELECT_MULTI,
    selectValues: TableConfig.SELECT_VALUES,
    isPage: TableConfig.IS_PAGE,
    pagination: TableConfig.PAGINATION_OPTION,
    isScroll: TableConfig.PAGINATION_SCROLL,
    sortEnable: TableConfig.SORT_ENABLE
};