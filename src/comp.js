import {Component} from "preact";
import style from "./blue-style.scss";

export default class Comper extends Component {
    constructor() {
        super();
        this.state = {
            text: "blah bh"
        }
    }
    componentDidMount() {
        this.setState({text: "somethidle"});
    }
    render() {
        return <div className={`${style.blue} ${style.boy}`}>{this.state.text}</div>
    }
}