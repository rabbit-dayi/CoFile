
dayi_sql = require('./dayi-mysql')

async function dayi_fetch_user_files(user_name){
  dayi_res = {'code':201,'info':'[dayi-info]找到了xx个文件','logged_in_user_name':user_name}
  sql_res = await dayi_sql.dayi_user_files(user_name)
  if (sql_res.length == 0 ){
    dayi_res = {'code':211,'info':'[dayi-info]当前用户: 没有查询到任何文件，如果需要删除请联系dayi.',logged_in_user_name:user_name,data:{}}
  }else{
    dayi_res['data']=Array()
    dayi_res['info']='找到了'+sql_res.length+'条记录'
    for(i=0;i<sql_res.length;++i){
      dayi_res['data'].push(sql_res[i])
    }
  }
  return dayi_res
}


// async function main() {
//   res = await dayi_fetch_user_files('west-dolphin-invite-happy-shark-for-ask-happy-dog-2240')
//   console.log(JSON.stringify(res))
// }

// main()

exports.dayi_show_fetch_files=dayi_fetch_user_files