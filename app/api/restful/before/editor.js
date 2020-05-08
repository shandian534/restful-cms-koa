const { rsa } = global.tool
const { getItem } = require(':query')

const checkParams = async (params, role, ctx) => {
  const { account, name, password, editor } = params
  // 校验必填参数
  if (!account) ctx.throw(400, '小编账号不能为空')
  if (!name) ctx.throw(400, '小编姓名不能为空')
  // 校验传入密码是否能 RSA 解密
  if (password) await rsa.decrypt(password).catch(e => ctx.throw(400, '小编登录密码有误，请检查客户端RSA配置'))
  // 校验编辑器参数
  if (editor && !['MARKDOWN', 'RICHEDITOR'].includes(editor)) ctx.throw(400, '个人编辑器参数有误')
}

module.exports = {
  async post (params, role, ctx) {
    const { password, account } = params
    // 校验必填参数
    if (!password) ctx.throw(400, '小编登录密码不能为空')

    // 公共校验方法
    await checkParams(params, role, ctx)

    // 校验账号是否唯一
    const hasAccount = await getItem('Editor', { account })
    if (hasAccount) ctx.throw(400, '小编账号已经存在')

    return params
  },
  async put (params, role, ctx, id) {
    const { account } = params
    // 公共校验方法
    await checkParams(params, role, ctx)

    // 校验账号是否唯一
    const hasAccount = await getItem('Editor', id)
    if (!hasAccount) ctx.throw(404, '您要更新信息的小编账号不存在')
    if (hasAccount.account !== account) ctx.throw(400, '小编账号不允许修改')

    return params
  }
}
