var dayi_cfg = require('./dayi-config')

cookie_key = dayi_cfg.dayi_cookie_key

async function dayi_get_now_user_name(req,res){//获得当前用户名
  return new Promise((resolve, reject) =>{
    if (Object.keys(req.cookies).length !== 0) {
      if (req.cookies.hasOwnProperty(cookie_key)) {
        now_user_name = req.cookies[cookie_key]
        resolve(now_user_name)
      }
    }
    reject({'code':401,'info':'没有找到登录的用户cookie'})
  })
}

exports.dayi_get_now_user_name=dayi_get_now_user_name