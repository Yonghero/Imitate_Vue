import getValue from "../util/getValue.js";

let template2vNode = new Map();
let vNode2template = new Map();

// 响应式渲染
export function renderData(vm, data) {
    let vnodes = template2vNode.get(data);
    // 找到使用该模板的节点们
    if (vnodes) {
        for (let i = 0; i < vnodes.length; i++) {
            renderTemplate(vm, vnodes[i]);
        }
    }
}

export function renderMixin(Due) {
    Due.prototype.render = function () {
        renderTemplate(this, this._vNode);
    }
}
export function renderTemplate(vm, vnode) {
    // 文本节点才有模板需要替换
    if (vnode.nodeType === 3) {
        // 通过文本节点找模板
        let template = vNode2template.get(vnode);
        // 如果文本节点中有模板
        if (template) {
            let result = vnode.text;
            for (let i = 0; i < template.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], template[i]);
                if (templateValue) {
                    result = result.replace(`{{${template[i]}}}`, templateValue);
                }
            }
            vnode.el.nodeValue = result;
        }
    }
    else if (vnode.nodeType === 1 && vnode.tag === 'INPUT') {
        let template = vNode2template.get(vnode);
        if (template) {
            for (let i = 0; i < template.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], template[i]);
                if (templateValue) {
                    vnode.el.value = templateValue;
                }
            }
        }
    }
    else {
        for (let i = 0; i < vnode.children.length; i++) {
            renderTemplate(vm, vnode.children[i]);
        }
    }

}
function getTemplateValue(objs, template) {
    if (!objs || objs.length === 0) return undefined;
    for (let i = 0; i < objs.length; i++) {
        let value = getValue(objs[i], template);
        if (value != null) {
            return value;
        }
    }
}

export function prepareRender(vm, vnode) {
    if (vnode === null) return;
    // 文本节点才有模板
    if (vnode.nodeType === 3) {
        analysisTemplate(vnode);
    }
    // 虚拟节点 建立索引
    if (vnode.nodeType == 0) {
        setTemplate2vnode("{{" + vnode.data + "}}", vnode);
        setVnode2template("{{" + vnode.data + "}}", vnode);
    }

    for (let i = 0; i < vnode.children.length; i++) {
        prepareRender(vm, vnode.children[i])
    }
}
function analysisTemplate(vnode) {
    let templateList = vnode.text && vnode.text.match(/{{[a-zA-Z0-9_.]+}}/g);
    for (let i = 0; templateList && i < templateList.length; i++) {
        setTemplate2vnode(templateList[i], vnode);
        setVnode2template(templateList[i], vnode);
    }
}

export function setTemplate2vnode(template, vnode) {
    let templateName = getTemplateName(template); // 去除花括号
    let vnodeSet = template2vNode.get(templateName);
    if (vnodeSet) {
        vnodeSet.push(vnode);
    } else {
        template2vNode.set(templateName, [vnode]);
    }
}
export function setVnode2template(template, vnode) {
    let templateSet = vNode2template.get(vnode);
    if (templateSet) {
        templateSet.push(getTemplateName(template));
    } else {
        vNode2template.set(vnode, [getTemplateName(template)]);
    }
}

// 解析模板 去除花括号
function getTemplateName(template) {
    if (template.substring(0, 2) === "{{" && template.substring(template.length - 2, template.length) === "}}") {
        return template.substring(2, template.length - 2);
    } else {
        return template;
    }
}
export function getTemplate2vNode() { return template2vNode }
export function getvNode2template() { return vNode2template; }

export function getVNodebyTemp(temp) {
    return template2vNode.get(temp);
}

export function clearMap(){
    template2vNode.clear();
    vNode2template.clear();
}