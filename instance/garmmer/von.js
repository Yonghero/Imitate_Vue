import getValue from "../../util/getValue.js";

export function checkOn(vm, vnode) {
    if (vnode.nodeType != 1) return;
    let attrs = vnode.el.getAttributeNames();
    for (let i = 0; i < attrs.length; i++) {
        if (attrs[i].indexOf('v-on:') == 0 || attrs[i].indexOf('@') == 0) {
            von(vm, vnode, attrs[i].split(':')[1], vnode.el.getAttribute(attrs[i]));
        }
    }
}

function von(vm, vnode, event, name) {
    let method = getValue(vm._methods, name);
    if (!method) throw new Error('请传入事件函数！');
    vnode.el.addEventListener(event,proxyMethod(vm,method));

}
function proxyMethod(vm,method){    
    return function(){
        method.call(vm);
    }
}