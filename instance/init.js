import { constructProxy } from './proxy.js';
import { mount } from './mount.js';
import { prepareRender } from './render.js';
let uid = 0;
export function initMixin(Due) {
    Due.prototype.init = function (options) {
        const vm = this;
        vm._uid = uid++
        vm._isDue = true;
        // 代理data
        if (!options || !options.data) return {};
        vm._data = constructProxy(vm, options.data, '');
        if (!options || !options.el) return null;
        vm._vNode = mount(vm, options.el);
        prepareRender(vm,vm._vNode);
    }
}