export default function getValue(obj, template) { // content.a
    if (!obj || !template) return undefined;
    let name = template.split('.');
    let tempObj = obj;
    for (let i = 0; i < name.length; i++) {
        if (tempObj[name[i]]) {
            tempObj = tempObj[name[i]];
        }else {
            return undefined;
        }
    }
    return tempObj;
}