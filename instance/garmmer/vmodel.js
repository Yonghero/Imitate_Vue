import setValue from "../../util/setValue.js"

export function vmodel(vm, el, parent) {
    el.onchange = function (e) {
        let prop = el.getAttribute('v-model');
        setValue(vm._data,prop,el.value); // vm的data数据，绑定的属性，修改后的新值
    }
}