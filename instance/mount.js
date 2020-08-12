import vNode from '../vDom/vNode.js';
import { vmodel } from './garmmer/vmodel.js';
import { setTemplate2vnode, setVnode2template, getVNodebyTemp, prepareRender, renderTemplate,clearMap } from './render.js';
import { vfor } from './garmmer/vfor.js';
import { mergeAttr } from '../util/ObjectUtil.js'
import { checkBind } from './garmmer/vbind.js';
import { checkOn } from './garmmer/von.js';

export function mount(vm, el) {
    let elm = document.getElementById(el);
    let vnode = constructorVNode(vm, elm, '')
    return vnode;
}

export function constructorVNode(vm, el, parent) {
    let vnode = analysisAttr(vm, el, parent);
    if (vnode == null) {
        let tag = el.tagName;
        let children = [];
        let text = getNodeText(el);
        let data = null;
        let nodeType = el.nodeType;
        vnode = new vNode(tag, el, children, text, data, parent, nodeType, parent);
        if (el.nodeType == 1 && el.getAttribute("env")) {
            vnode.env = mergeAttr(vnode.env, JSON.parse(el.getAttribute("env")));
        } else {
            vnode.env = mergeAttr(vnode.env, parent ? parent.env : {});
        }
        checkBind(vm,vnode);
        checkOn(vm,vnode);
    }
    let childs = vnode.nodeType == 0 ? vnode.parent.el.childNodes : vnode.el.childNodes;
    // let childs = vnode.el.childNodes;
    for (let i = 0; i < childs.length; i++) {
        let childNode = constructorVNode(vm, childs[i], vnode);
        if (childNode instanceof vNode) vnode.children.push(childNode);
        else vnode.children = vnode.children.concat(childNode);
    }
    analysisVModel(vm, vnode);
    return vnode;
}

function getNodeText(el) {
    if (el.nodeType == 3) {
        return el.nodeValue;
    } else {
        return null;
    }
}
// 分析各种指令
function analysisAttr(vm, el, parent) {
    // 标签节点才有v-model 和 属性
    if (el.nodeType === 1) {
        let attrNames = el.getAttributeNames();
        if (attrNames.includes('v-model')) {
            return vmodel(vm, el, parent);
        }
        if (attrNames.includes('v-for')) {
            return vfor(vm, el, parent);
        }
    }

}
// 挂载节点时 处理分析v-model指令
function analysisVModel(vm, vnode) {
    if (vnode.nodeType != 1) return;
    let attrNames = vnode.el.getAttributeNames();
    if (attrNames.includes('v-model')) {
        let template = vnode.el.getAttribute('v-model');
        setTemplate2vnode(template, vnode);
        setVnode2template(template, vnode);
    }
}

export function rebuild(vm, template) {
    let virtualNode = getVNodebyTemp(template);
    for (let i = 0; i < virtualNode.length; i++) {
        virtualNode[i].parent.el.innerHTML = null;
        virtualNode[i].parent.el.appendChild(virtualNode[i].el)
        let result = constructorVNode(vm, virtualNode[i].el, virtualNode[i].parent);
        virtualNode[i].parent.children = [result];
        clearMap();
        prepareRender(vm,vm._vNode);
        renderTemplate(vm,vm._vNode);

    }

}
