const fs = require('fs')
const translate = require('@vitalets/google-translate-api');
const spt = '\n'
let enter = {
    lang: 'zh-CN',
    file: 'cn.json'
}
let out = ['ko', 'ja', 'ru', 'en', 'zh-TW']
fs.readFile(`./locales/${enter.file}`, 'utf8', (err, data) => {
    if (err) throw err;
    out.forEach(lang => {
        let obj = JSON.parse(data)
        let _arr = [0, 0]
        let arr = []
        // translation(objSerialization(obj).join('|'))
        objSerialization(obj, arr, _arr)
        segmentation(obj, arr, _arr, lang)
    })
})
function segmentation(obj, arr, _arr, lang) {
  let newArr = []
  let len
  while(arr.length) {
    newArr.push(arr.splice(0, 30).join(spt)) 
  }
  len = newArr.length
//   console.log(obj)
//   objDeserialization(obj, newArr)
//   console.log(obj)
  newArr.forEach((str, index) => {
    translation(str, newArr, index, len, obj,  _arr, lang)
  })
}
function objSerialization(obj, arr, _arr) {
    for (let key in obj) {
        i = _arr[0]
        if (obj[key] instanceof Object) {
            objSerialization(obj[key], arr, _arr)
        } else {
            arr[i] = obj[key]
            obj[key] = i
            _arr[0] = ++i
        }
    }
}
function translation(str ,newArr, index, len, obj,  _arr, lang) {
    console.log(lang)
    translate(str, {from: enter.lang, to: lang}).then(res => {
        console.log(2)
        newArr[index] = res.text
        _arr[1] = _arr[1] + 1
        if (len === _arr[1]) {
            objDeserialization(obj, newArr)
            fs.writeFile(`./locales/${lang}.json`, JSON.stringify(obj, null, 4), (err) => {
                if (err) throw err;
                console.log('文件已被保存');
            });
        }
    }).catch(err => {
        console.error(err);
    });
}
function objDeserialization(obj, arr) {
    let _arr = arr.join(spt).split(spt)
    for (let key in obj) {
        if (obj[key] instanceof Object) {
            objDeserialization(obj[key], arr)
        } else {
            obj[key] = _arr[obj[key]]
        }
    }
}

