// 判断用户是否存在
export function isHasUser (userid) {
  const userArry = ['265923264726140314', '15389814763017748', '101435341726256441', '050305515626428343', '013939643928605775', '013939500926349703']
  if (userArry.indexOf(userid) !== -1) {
    return true
  }
  return false
}
