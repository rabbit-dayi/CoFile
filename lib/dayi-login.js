//成功201
//重复登录401
//非法登录411

cookie_key = 'dayi-cookie-for-uploads'
expires_time = 24*60*60*1000*150

var sql = require('./dayi-mysql')
var cute_uuid = require('./uuid-cute')

function create_new_user_set_cookie(req,res,new_user_name){
  
  sql.dayi_insert_user(new_user_name)
  console.log('new_user:'+new_user_name)
  res.cookie('dayi-cookie-for-uploads',new_user_name,{path: '/',secure:true,sameSite: 'None',expires:new Date(Date.now()+expires_time)}) //secure:true
  return res
}

async function dayi_login(req, res, next) {
  res_raw = { code: 201, info: 'ovo' }
  if (Object.keys(req.cookies).length !== 0) {
    if (req.cookies.hasOwnProperty(cookie_key)) {
      now_user_name = req.cookies[cookie_key]
      const result = await sql.dayi_query_user(now_user_name)
      if (result) {
        res_raw['code'] = '401'
        res_raw['info'] = '重复登录,你已经登录成功啦,拒绝本次登录请求.'
        res_raw['logged_in_user_name'] = now_user_name

        console.log('重复登录操作: 已经登录的cookie:' + req.cookies[cookie_key])
      } else {
        res_raw['code'] = '411'
        res_raw['info'] = '用户不存在，重新设置cookie.'
        new_user_name = cute_uuid.uuid_cute('')
        res_raw['logged_in_user_name'] =new_user_name
        res = await create_new_user_set_cookie(req, res,new_user_name)
      }
    }
  } else {
    new_user_name = cute_uuid.uuid_cute('')
    res = await create_new_user_set_cookie(req, res,new_user_name)
    res_raw['logged_in_user_name'] =new_user_name
    res_raw['info'] = '[dayi-info]登录成功'
  }
  return res_raw
}

exports.dayi_login = dayi_login