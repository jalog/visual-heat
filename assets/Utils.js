function maxABS2w(t1, t2) {
  const Mx = t1.length, Ny = t1[1].length;
  let max = 0;
  for(let i = 0; i < Ny; i++) {
    for(let j = 0; j < Mx; j++) {
      max = Math.max(Math.abs(t1[j][i] - t2[j][i]), max);
    }
  }
  return max;
}

function deepclone(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  if (!obj) { // obj 是 null的情况
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (obj instanceof Function) {
    return obj;
  }
  let newObj;
  if (obj instanceof Array) {
    newObj = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      newObj.push(deepclone(obj[i])); //递归操作嵌套对象
    }
    return newObj;
  }
  newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] !== 'object') {
        newObj[key] = obj[key];
      } else {
        newObj[key] = deepclone(obj[key]); //递归操作嵌套对象
      }
    }
  }
  return newObj;
}
