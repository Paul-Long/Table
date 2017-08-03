import React from 'react';
import PropTypes from 'prop-types';
import {SCROLL_SIZE, SCROLL_SIZE_HOVER} from './Config';
import {VVG} from './Func';

const {Component} = React;

class Scroll extends Component {
    constructor(props) {
        super(props);
        this.start = undefined;
        this.axis = undefined;
        this.timer = null;
        this.dragging = null;
        this.top = props.top || 0;
        this.state = {
            pointerEvents: 'none',
            width: 0,
            height: 0
        }
    }

    componentDidMount() {
        VVG.bindEvent(this.wrapper.ownerDocument, 'mousedown', this.drag);
        VVG.bindEvent(this.wrapper.ownerDocument, 'mousemove', this.drag);
        VVG.bindEvent(this.wrapper.ownerDocument, 'mouseup', this.drag);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.top !== this.props.top) {
            this.top = nextProps.top;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.height !== this.props.height
            || nextProps.sHeight !== this.props.sHeight
            || nextProps.width !== this.props.width
            || nextProps.sWidth !== this.props.sWidth
            || nextProps.top !== this.props.top;
    }

    xWidth = () => {
        const {width, sWidth} = this.props;
        return (width * width) / sWidth;
    };

    yHeight = () => {
        const {height, sHeight} = this.props;
        return (height * height) / sHeight;
    };

    onRefresh = (top) => {
        const {onRefresh, scrollEndSize} = this.props;
        if (top + this.yHeight() + scrollEndSize > this.wrapper.offsetHeight) {
            if (typeof onRefresh === 'function') {
                onRefresh();
            }
        }
    };

    setTop = (top) => {
        const {sHeight, height} = this.props;
        const yHeight = this.yHeight();
        top = top * (height - yHeight) / (sHeight - height);
        top = top + this.props.top;
        (top < this.props.top) && (top = this.props.top);
        this.top = top;
        this.onRefresh(top);
        this.scrollY.style.top = top + 'px';
    };

    drag = (event) => {
        event = VVG.getEvent(event);
        const {hTable = [], vTable = [], radio, top = 0, sHeight, height, sWidth, width} = this.props;
        switch (event.type) {
            case 'mousedown':
                const target = VVG.getTarget(event);
                const dataScroll = target.getAttribute('data-scroll');
                if (dataScroll) {
                    this.dragging = target;
                    this.wrapper.style.pointerEvents = 'auto';
                    if (dataScroll === 'scrollX') {
                        this.axis = 'X';
                        this.start = event.clientX;
                        this.scrollX.className = 'rs-scroll-x rs-scroll-move';
                        this.scrollX.style.height = SCROLL_SIZE_HOVER + 'px';
                        this.scrollX.style.borderRadius = SCROLL_SIZE_HOVER / 2 + 'px';
                    }
                    if (dataScroll === 'scrollY') {
                        this.axis = 'Y';
                        this.start = event.clientY;
                        this.scrollYTop = this.top;
                        this.scrollY.className = 'rs-scroll-y rs-scroll-move';
                        this.scrollY.style.width = SCROLL_SIZE_HOVER + 'px';
                        this.scrollY.style.borderRadius = SCROLL_SIZE_HOVER / 2 + 'px';
                    }
                    VVG.userSelectNone(this.wrapper);
                }
                break;
            case 'mousemove':
                if (this.dragging) {
                    const dragging = this.dragging;
                    if (this.axis === 'X') {
                        let left = event.clientX - this.start;
                        left = parseInt(left);
                        if (left < 0) left = 0;
                        const w = this.wrapper.offsetWidth - this.scrollX.offsetWidth;
                        if (left > w) left = w;
                        dragging.style.left = left + 'px';
                        const value = ((left + this.scrollX.offsetWidth) * sWidth * radio) / this.wrapper.offsetWidth - (width * radio);
                        hTable.forEach(t => t['scrollLeft'] = value);
                    }

                    if (this.axis === 'Y') {
                        let yTop = event.clientY - this.start + this.scrollYTop;
                        if (yTop < top) yTop = top;
                        const h = this.wrapper.offsetHeight - this.scrollY.offsetHeight;
                        if (yTop > h) yTop = h;
                        this.onRefresh(yTop);
                        dragging.style.top = yTop + 'px';
                        this.top = yTop;
                        const value = (yTop - top) * (sHeight - height) / (height - this.scrollY.offsetHeight);
                        vTable.forEach(t => t['scrollTop'] = value);
                    }
                }
                break;
            case 'mouseup':
                this.dragging = null;
                this.start = 0;
                this.wrapper.style.pointerEvents = 'none';
                if (this.axis === 'X') {
                    this.scrollX.className = 'rs-scroll-x';
                    this.scrollX.style.height = SCROLL_SIZE + 'px';
                    this.scrollX.style.borderRadius = SCROLL_SIZE / 2 + 'px';
                }
                if (this.axis === 'Y') {
                    this.scrollY.className = 'rs-scroll-y';
                    this.scrollY.style.width = SCROLL_SIZE + 'px';
                    this.scrollY.style.borderRadius = SCROLL_SIZE / 2 + 'px';
                }
                this.axis = null;
                VVG.userSelectNone(this.wrapper, '');
                break;
        }
        if (this.dragging) {
            event.preventDefault();
        }
    };

    render() {
        const {width, sWidth, height, sHeight, top, style} = this.props;
        const {pointerEvents} = this.state;
        const props = {
            className: 'rs-scroll-wrapper',
            style: {pointerEvents, ...style}
        };
        return (
            <div ref={r => this.wrapper = r} {...props}>
                <div
                    ref={r => this.scrollX = r}
                    data-scroll='scrollX'
                    className='rs-scroll-x'
                    style={{
                        width: this.xWidth() || 0,
                        height: SCROLL_SIZE,
                        borderRadius: SCROLL_SIZE / 2 + 'px',
                        display: (sWidth <= width ? 'none' : 'block')
                    }}
                />
                <div
                    ref={r => this.scrollY = r}
                    data-scroll='scrollY'
                    className='rs-scroll-y'
                    style={{
                        height: this.yHeight() || 0,
                        width: SCROLL_SIZE,
                        borderRadius: SCROLL_SIZE / 2 + 'px',
                        display: (sHeight <= height ? 'none' : 'block'),
                        top: top
                    }}
                />
            </div>
        )
    }
}

export default Scroll;

Scroll.propTypes = {
    width: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sWidth: PropTypes.number,
    sHeight: PropTypes.number,
    top: PropTypes.number,
    radio: PropTypes.number,
    hTable: PropTypes.array,
    vTable: PropTypes.array,
    onRefresh: PropTypes.func,
    scrollEndSize: PropTypes.number,
    style: PropTypes.object
};
