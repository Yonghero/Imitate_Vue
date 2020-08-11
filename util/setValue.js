export default function setValue(obj, data, value) {
    console.log(obj,data,value);
    
    if (!obj) return null;
    let dataList = data.split('.');
    let temp = obj;
    // 循环到倒数第二轮 拿到要改变的值的对象 而不是值
    for (let i = 0; i < dataList.length ; i++) {
        if (temp[dataList[i]]) {
            temp = temp[dataList[i]];
        } else {
            return undefined;
        }
    } 
    // 判断取得的对象是否有该属性
    if (temp[dataList[dataList.length - 1]]) {
        temp[dataList[dataList.length - 1]] = value;
    }
}