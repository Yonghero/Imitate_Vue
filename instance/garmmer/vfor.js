import vNode from '../../vDom/vNode.js';
import getValue from '../../util/getValue.js';

export function vfor(vm, el, parent) {
    let instructions = el.getAttribute('v-for');
    let virtualNode = new vNode(el.nodeName, el, [], '', getVirtualNodeData(instructions)[2], parent, 0);
    virtualNode.instructions = instructions;
    parent.el.removeChild(el);
    parent.el.appendChild(document.createTextNode(''));
    let resultSet = analysisInstructions(vm, instructions, el, parent);
    return virtualNode;
}

function analysisInstructions(vm, instructions, el, parent) {
    let insSet = getVirtualNodeData(instructions);
    let dataSet = getValue(vm._data, insSet[2]);
    if (!dataSet) {
        throw new Error("error");
    }
    let resultSet = [];
    for (let i = 0 ; i < dataSet.length ; i ++) {
        let tempDom = document.createElement(el.nodeName);
        tempDom.innerHTML = el.innerHTML;
        let env = analysisKV(insSet[0], dataSet[i], i);
        tempDom.setAttribute("env", JSON.stringify(env));
        parent.el.appendChild(tempDom);
        resultSet.push(tempDom);
    }
    return resultSet;
}

// 分析data 返回局部变量
function analysisKV(instructions, value, index) {
    // (key,index) ===> key,index
    if (/([a-zA-z0-9-_$]+)/.test(instructions)) {
        instructions = instructions.trim();
        instructions = instructions.substring(1, instructions.length - 1);
    }
    let keys = instructions.split(",");
    if (keys.length == 0) {
        throw new Error("error");
    }
    let obj = {};
    if (keys.length == 1) {
        // obj.key = {}
        obj[keys[0].trim()] = value;
    }
    if (keys.length == 2) {
        obj[keys[1].trim()] = index;
    }
    return obj;
}


function getVirtualNodeData(instructions) {
    let insSet = instructions.trim().split(' ');
    if (insSet.length != 3 || insSet[1] != 'in' && insSet != 'of') throw new Error('v-for 参数不合法');
    return insSet;

}