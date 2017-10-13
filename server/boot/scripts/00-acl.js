'use strict'

module.exports = (app) => {
  if (process.env.INITDB) {
    console.log('\n[ ACL ]')

    const ACL = app.models.ACL

    const allow = {
      principalType: ACL.USER,
      principalId: 'u001',
      model: 'User',
      property: ACL.ALL,
      accessType: ACL.ALL,
      permission: ACL.ALLOW
    }

    // Hack to enable all ACL
    return (
      ACL.create(allow).then(() => ACL.create(allow))
    )
  }

  return (Promise.resolve(true))
}
