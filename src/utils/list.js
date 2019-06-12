export function trim (str) { // 删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function inputFilter (value, column, listQuery) {
  const josnStr = JSON.stringify(listQuery)
  var json = ''
  if (typeof (value) === 'string') {
    json = ',"' + column.columnKey + '":"' + trim(value) + '"}'
  } else {
    json = ',"' + column.columnKey + '":' + value + '}'
  }
  const newjosn = josnStr.replace(/\}/g, json)
  listQuery = JSON.parse(newjosn)
  return listQuery
}
