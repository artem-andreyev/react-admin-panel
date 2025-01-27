import "../../helpers/iframeLoader.js";
import axios from "axios";
import React, {Component} from "react";

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = "index.html";
        this.state = {
            pageList: [],
            newPageName: ""
        }
        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init(page) {
        this.iframe = document.querySelector('iframe');
        this.open(page);
        this.loadPageList();
    }

    open(page) {
        this.currentPage = `../../${page}?rnd=${Math.random()}`;

        axios
            .get(`../${page}`)
            .then(res => this.parseStrToDOM(res.data))
            .then(this.wrapTextNodes)
            .then(this.serializeDOMToString)
            .then(html => axios.post("./api/saveTempPage.php", {hmtl}))
        // this.iframe.load(this.currentPage, () => {
            

        // });
    }

    parseStrToDOM(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    }

    wrapTextNodes(dom) {
        const body = dom.body;
        let textNodes = [];

        function recursy(element) {
            element.childNodes.array.forEach(node => {
                
                if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0) {
                    textNodes.push(node);
                } else {
                    recursy(node);
                }
            })
        };

        recursy(body);

        textNodes.forEach(node => {
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.contentEditable = "true";
        });

        return dom;
    }

    serializeDOMToString(dom) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    loadPageList() {
        axios
            .get("./api")
            .then(res => this.setState({pageList: res.data}))
    }

    createNewPage() {
        axios
            .post("../../../api/createNewPage.php", {"name": this.state.newPageName})
            .then(this.loadPageList())
            .catch(() => alert("Page already exists!"));
    }

    deletePage(page) {
        axios
            .post("../../../api/deletePage.php", {"name": page})
            .then(this.loadPageList())
            .catch(() => alert("Page doesn't exist!"));
    }

    render() {
        // const {pageList} = this.state;
        // const pages = pageList.map((page, i) => {
        //     return (
        //         <h1 key={i}>{page}
        //             <a href="#"
        //             onClick={() =>this.deletePage(page)}>(x)</a>
        //         </h1>
        //     )
        // });

        return (
            <iframe src={this.currentPage} frameborder="0"></iframe>
            // <>
            //     <input
            //         onChange={(e) => {this.setState({newPageName: e.target.value})}} 
            //         type="text"/>
            //     <button onClick={this.createNewPage}>Create page</button>
            //     {pages}
            // </>
        )
    }
}