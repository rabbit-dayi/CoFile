var dayi_sql = require('./dayi-mysql')
var dayi_cfg = require('./dayi-config')
const fs = require('fs')

async function delete_file(user_name,file_uuid){
  dayi_res = {'code':201,'info':'[dayi-info]成功删除文件:'}
  sql_res = await dayi_sql.dayi_user_files(user_name,file_uuid)
  if(sql_res.length <= 0){
    dayi_res['code']=411
    dayi_res['info']='服务器上没有找到您用户下的此文件，操作被拒绝，如需删除请联系dayi'
    return dayi_res
  }
  for(i=0;i<sql_res.length;++i){
    try{
      now_user_file_path = sql_res[i]['file_path']
      now_user_file_path = ''+dayi_cfg.upload_root_path+'/'+now_user_file_path
      res_tmp = await dayi_sql.dayi_delete_file_sql(file_uuid)
      res_tmp = await fs.unlink(now_user_file_path,(err)=>{
        if(err != undefined)console.log(err);
        // throw err;
      })
      dayi_res['info']+='成功删除了:'+now_user_file_path+"<br>"
    }catch(err){
      dayi_res['info']+='删除失败:'+now_user_file_path+'错误原因:'+err
      console.log('删除失败:'+now_user_file_path+'错误原因:'+err)
    }
  }
  // console.log(dayi_res)
  return dayi_res
}


async function download_file(user_name,file_uuid){
  dayi_res = {'code':201,'info':'[dayi-info]成功删除文件:','path':'114514'}
  sql_res = await dayi_sql.dayi_user_files(user_name,file_uuid)
  if(sql_res.length <= 0){
    dayi_res['code']=411
    dayi_res['info']='服务器上没有找到您用户下的此文件，操作被拒绝，如需删除请联系dayi'
    return dayi_res
  }
  dayi_res['path'] = sql_res[0]['file_path']
  return dayi_res
}

exports.dayi_download_file = download_file
exports.dayi_delete_file = delete_file
// delete_file('south-frog-permit-small-ikun-from-break-small-crab-4661','small-chicken-get-east-crab-to-love-small-panda-1462')


