import React from 'react';
import ReactDOM from 'react-dom';

class Test extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            text: 'aaa',
            arr: [{
                arrText: '',
            }],
        }
    }

    clickFunc() {
        const newArr = this.state.arr.concat({ arrText: this.state.text })
        this.setState({
            text: "bbb",
            arr: newArr
        })
    }

    render() {
        return (
            <div>
                <textarea value={this.state.text}></textarea>
                <button onClick={() => this.clickFunc()}>push</button>
            </div>
        )
    }
}

ReactDOM.render(
    <Test />,
    document.getElementById('root')
)