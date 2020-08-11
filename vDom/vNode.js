export default class vNode{
    constructor(tag,el,children,text,data,parent,nodeType){
        this.tag = tag;
        this.el = el;
        this.children = children;
        this.text = text;
        this.parent = parent;
        this.nodeType = nodeType;
        this.data = data;
        this.env = {};
        this.instructions = null;
        this.template = [];
    }
}