import getValue from "../../util/getValue.js";

export function checkBind(vm, vnode) {
    if (vnode.nodeType != 1) return;
    let attrs = vnode.el.getAttributeNames();
    // 说明这个节点绑定了v-bind
    for (let i = 0; i < attrs.length; i++) {
        if (attrs[i].indexOf('v-bind:') == 0 || attrs[i].indexOf(':') == 0) {
            let attr = vnode.el.getAttribute(attrs[i])
            vbind(vm, vnode, attrs[i], attr)
        }
    }


}
function vbind(vm, vnode, name, attr) {
    let bindArr = name.split(':');
    let key = bindArr[1];
    let value = getValue(vm._data, attr);
    if (value) {
        vnode.el.setAttribute(key, value);
    }
}