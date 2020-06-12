
import React from 'react';
import { SketchPicker } from 'react-color';
export class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.color,
            key: props.objKey,
            displayColorPicker: "none",
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = () => {
        let { displayColorPicker, key, color } = this.state;
        displayColorPicker = displayColorPicker == "none" ? "block" : "none";
        this.setState({ displayColorPicker })
        // if (displayColorPicker) {
        //     this.props.updateColor(key, color)
        // }
    }
    handleChange = (value) => {
        let color = value.hex;
        this.setState({ color })
        this.props.onChange(color)

    }
    render () {
        let { color, displayColorPicker } = this.state;
        return (
            <div style={{ position: "ralative" }}>
                <div
                    style={{
                        border: "1px solid #e8e8e8",
                        borderRadius: '4px',
                        padding: '2px',
                        height: 30,
                        width: 80
                    }}
                >
                    <button onClick={this.handleClick}
                        style={{
                            background: color,
                            borderRadius: '4px',
                            height: 24,
                            width: 74
                        }}></button>
                </div>
                {displayColorPicker == "block" ?
                    //选择器脱离标准流
                    <div style={{ position: "absolute", top: 40, zIndex: 66 }}>
                        <SketchPicker color={this.state.color} onChange={this.handleChange} />
                    </div>
                    : null
                }
            </div>
        );
    }
}