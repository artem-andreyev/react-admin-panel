import axios from "axios";
import React, {Component} from "react";

export default class Editor extends Component {
    constructor() {
        super();

        this.state = {
            pageList: [],
            newPageName: ""
        }
    }

    componentDidMount() {
        this.loadPageList();
    }

    loadPageList() {
        axios
            .get("./api")
            .then(res => this.setState({pageList: res.data}))
    }

    render() {
        const {pageList} = this.state;
        const pages = pageList.map(page => {
            return (
                <h1>{page}</h1>
            )
        });

        return (
            <>
                <input type="text"/>
                <button>Create page</button>
                {pages}
            </>
        )
    }
}