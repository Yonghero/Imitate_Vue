import getValue from "../../util/getValue.js";
import { getEnvAttr } from "../../util/ObjectUtil.js";
import { generateAnnoCode, isTrue } from "../../util/Code.js";

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
    let k = name.split(":")[1];
    if (/^{[\w\W]+}$/.test(attr)) {
        let str = attr.substring(1, attr.length - 1).trim();//解析出表达式的内容
        let expressionList = str.split(",");
        let result = analysisExpression(vm, vnode, expressionList);
        console.log(result);
        vnode.el.setAttribute(k, result);
    } else {
        let v = getValue(vm._data, attr);
        vnode.el.setAttribute(k, v);
    }
}

function analysisExpression(vm, vnode, expressionList) {
    let attr = getEnvAttr(vm, vnode);
    let code = generateAnnoCode(attr);
    
    let result = "";
    for (let i = 0; i < expressionList.length; i++) {
        let site = expressionList[i].indexOf(":");
        if (site > -1) {
            if (isTrue(expressionList[i].substring(site + 1, expressionList[i].length), code)) {
                result += expressionList[i].substring(0, site) + ",";
            }
        } else {
            result += expressionList[i] + ",";
        }
    }
    if (result.length > 0) {
        result = result.substring(0, result.length - 1);
    }
    return result;

}