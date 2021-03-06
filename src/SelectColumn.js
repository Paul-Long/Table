import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Radio} from 'antd';

const {Component} = React;

class SelectColumn extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.checked !== this.props.checked;
    }

    renderCheckbox = () => {
        return (
            <Checkbox
                checked={this.props.checked}
                onChange={this.onChange}
            />
        )
    };

    renderRadio = () => {
        return (
            <Radio
                checked={this.props.checked}
                onClick={this.onChange}
            />
        )
    };

    onChange = () => {
        const {onSelect} = this.props;
        if (typeof onSelect === 'function') {
            onSelect(!this.props.checked);
        }
    };

    render() {
        const {height, selectMulti} = this.props;
        return (
            <td className='rs-td'>
                <div
                    className='rs-td-content'
                    style={{
                        height,
                        lineHeight: `${height}px`,
                        textAlign: 'center',
                        justifyContent: 'center',
                        width: 50
                    }}
                >
                    {selectMulti ? this.renderCheckbox() : this.renderRadio()}
                </div>
            </td>
        )
    }
}

export default SelectColumn;

SelectColumn.propTypes = {
    height: PropTypes.number,
    style: PropTypes.object,
    selectMulti: PropTypes.bool,
    onSelect: PropTypes.func,
    checked: PropTypes.bool
};
