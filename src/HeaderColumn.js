import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from 'antd';
import {HEADER_HEIGHT, SELECT_KEY} from './Config';

const {Component} = React;

class HeaderColumn extends Component {
    constructor(props) {
        super(props);
        this.start = undefined;
        this.state = {
            checked: props.checkAll
        }
    }

    static defaultProps = {
        thSpace: 'left'
    };

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checkAll !== this.props.checkAll) {
            this.setState({checked: nextProps.checkAll});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.colData !== this.props.colData
            || nextState.checked !== this.state.checked;
    }

    onDown = (indexKey) => {
        const {onDown} = this.props;
        if (typeof onDown === 'function') {
            onDown(indexKey);
        }
    };

    handleChange = () => {
        const {onCheckAll} = this.props;
        const {checked} = this.state;
        this.setState({checked: !checked});
        if (typeof onCheckAll === 'function') {
            onCheckAll(!checked)
        }
    };

    renderTh = (colData = {}, isTopOne = true, isLeftOne = true) => {
        const {headerResizeEnable} = this.props;
        const style = {
            ...colData.style,
            height: HEADER_HEIGHT * colData.rowSpan,
            lineHeight: `${HEADER_HEIGHT * colData.rowSpan}px`,
            width: colData.width
        };
        if (isTopOne) {
            style.borderTop = '1px solid #FFF';
        }
        if (isLeftOne) {
            style.borderLeft = '1px solid #FFF';
        }
        if (colData.key === SELECT_KEY) {
            return this.props.selectMulti ? (
                <div className='rs-th-checkbox' style={style}>
                    <Checkbox onChange={this.handleChange} checked={this.state.checked} />
                </div>) : '';
        }
        const resizeEle = (<div className='rs-table-header-resize' data-id={colData.key}
                                onMouseDown={() => this.onDown(colData.key)} />);
        const children = colData.children || [];
        const ele = (
            <div
                key={colData.key}
                style={style}
                className='rs-th-item rs-th-content'
            >
                {colData.title}
                {children.length === 0 && headerResizeEnable ? resizeEle : ''}
            </div>
        );
        if (children.length > 0) {
            const arr = children.map((child, i) => this.renderTh(child, false, isLeftOne && i === 0));
            return (
                <div key={colData.key + '-wrapper'} className='rs-th-wrapper'
                     style={{width: colData.width, ...colData.style}}
                >
                    {ele}
                    {arr}
                </div>
            );
        }
        return ele;
    };

    render() {
        const {className = '', colData} = this.props;
        const space = colData.thSpace || 'center';
        const css = {
            textAlign: space
        };
        if (colData.width === 0) {
            css.display = 'none';
        }
        return (
            <th
                ref={r => this.th = r}
                className={`rs-th ${className}`}
                style={css}
                colSpan={colData.colSpan}
            >
                {this.renderTh(this.props.colData)}
            </th>
        )
    }
}

export default HeaderColumn;

HeaderColumn.propTypes = {
    className: PropTypes.string,
    onDown: PropTypes.func,
    style: PropTypes.object,
    thSpace: PropTypes.oneOf(['left', 'center', 'right']),
    selectMulti: PropTypes.bool,
    onCheckAll: PropTypes.func,
    checkAll: PropTypes.bool,
    colData: PropTypes.object,
    headerResizeEnable: PropTypes.bool
};
