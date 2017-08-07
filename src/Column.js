import React from 'react';
import PropTypes from 'prop-types';
import {getKeyData} from './Func';
import {TABLE_SPACE_TD} from './Config';

const {Component} = React;

class Column extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.data !== this.props.data
            || nextProps.width !== this.props.width;
    }

    renderChildren = () => {
        const {render, data, columnKey} = this.props;
        if (typeof render === 'function') {
            return render(data);
        }
        if (columnKey === TABLE_SPACE_TD) {
            return '';
        }
        const keys = columnKey.split('.');
        return getKeyData(keys, data);
    };


    getSpace = (space = 'center') => {
        switch (space) {
            case 'left':
                return 'flex-start';
            case 'right':
                return 'flex-end';
            case 'center':
                return 'center';
        }
    };

    render() {
        const {className = '', height, tdSpace, width, style} = this.props;
        const css = {};
        if (width === 0) {
            css.display = 'none';
        }
        console.log(height);
        return (
            <td className={`rs-td ${className}`} style={css}>
                <div className='rs-td-content'
                     style={{
                         ...style,
                         width,
                         height,
                         justifyContent: this.getSpace(tdSpace),
                         lineHeight: `${height}px`
                     }}
                >
                    {this.renderChildren()}
                </div>
            </td>
        )
    }
}

export default Column;

Column.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    columnKey: PropTypes.string,
    render: PropTypes.func,
    data: PropTypes.object,
    height: PropTypes.number,
    tdSpace: PropTypes.oneOf(['left', 'center', 'right']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object
};
