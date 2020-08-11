import { renderData } from "./render.js";

export function constructProxy(vm, data, namespace) {
    let proxyObj = null;
    if (data instanceof Array) {
        // 新建代理数组
        proxyObj = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            proxyObj[i] = constructProxy(vm, data[i], getNameSpace(namespace, proxyObj));
        }
        proxyObj = proxyArr(vm, data, namespace);
        return proxyObj;
    }
    else if (data instanceof Object) {
        proxyObj = dataProxy(vm, data, namespace);
        return proxyObj;
    } else {
        throw new Error('please send a correct data');
    }
}
// 代理数组
function proxyArr(vm, arr, namespace) {
    let obj = {
        eleType: 'Array',
        toString() {
            let result ='';
            for (let i = 0; i < arr.length; i++) {
                result += arr[i] + ',';
            }
            return result.substr(0,arr.length-1);
        },
        push(){},
        shift(){},
        unshift(){}
    }
    defArrayAsObj.call(vm,obj,'push',namespace,vm);
    defArrayAsObj.call(vm,obj,'shift',namespace,vm);
    defArrayAsObj.call(vm,obj,'unshift',namespace,vm);
    arr.__proto__ = obj;
    return arr;
}
let arrProto = Array.prototype;
function defArrayAsObj(obj,func,namespace,vm){
    Object.defineProperty(obj,func,{
        configurable:true,
        enumerable:true,
        value(...args){
            let origin = arrProto[func];
            const result = origin.apply(this,args);
            renderData(vm,getNameSpace(namespace,value))
            return result;
        }
    })
}
// 代理属性和对象
function dataProxy(vm, data, namespace) {
    let proxyObj = {};
    for (let prop in data) {
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return data[prop];
            },
            set(value) {
                data[prop] = value;
                renderData(vm,getNameSpace(namespace,prop));
            }
        });
        // vm实例上再代理一次data
        Object.defineProperty(vm, prop, {
            configurable: true,
            get() {
                return data[prop];
            },
            set(value) {
                data[prop] = value;
                renderData(vm,getNameSpace(namespace,prop));
            }
        });
        // 代理对象里的对象的属性们
        if (data[prop] instanceof Object) {
            proxyObj[prop] = constructProxy(vm, data[prop], getNameSpace(namespace, prop));
        }
    }
    return proxyObj;
}
// 获取命名空间
function getNameSpace(namespace, nowProp) {
    if (namespace == null || namespace == '') {
        return nowProp;
    } else {
        return namespace + '.' + nowProp;
    }
}
