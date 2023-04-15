const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs')
const app = express();
const router = express.Router();
var cookieParser = require('cookie-parser');

var cute_uid = require('./lib/uuid-cute')
var sql = require('./lib/dayi-mysql')
var path=require('path');

// console.log(cute_uid.uuid_cute())

var dayi_bot = require('./lib/dayi-bot')


const multer  = require('multer')
const upload = multer({
  dest: 'uploads/',
  fileFilter(req, file, callback) {
    // 解决中文名乱码的问题
    file.originalname =Buffer.from(file.originalname, 'latin1').toString('utf8');
    callback(null, true);
  },
})


var dayi_login = require('./lib/dayi-login')//登录，自动注册和登录
router.get('/api/wanna_login',cookieParser(),async function (req,res,next){//登录
  const res_raw = await dayi_login.dayi_login(req, res)
  res.setHeader("Content-Type", "application/json;charset=utf-8")
  res.write(JSON.stringify(res_raw))
  res.end()
  next()
});

var dayi_show_file = require('./lib/dayi-show-user-files')
var dayi_files = require('./lib/dayi-files')
var dayi_user = require('./lib/dayi-user')

router.get('/api/get_user_files',cookieParser(),async function(req,res,next){
  try {
    now_user_name = await dayi_user.dayi_get_now_user_name(req,res)
    files = await dayi_show_file.dayi_show_fetch_files(now_user_name)
    // files = await dayi_files.dayi_delete_file(now_user_name,uuid)

    //   files.push({'name':now_user_name,'size':114514})
    //   files.push({'name':now_user_name,'size':114514})
    res.end(JSON.stringify(files))
  } catch(err) {
    console.error(err)
    res.end(JSON.stringify(err))
  }
})

var gpt_lib = require('./lib/gpt-lib')
var dayi_config = require('./lib/dayi-config')

//删除文件
router.get('/api/delete_file',cookieParser(),upload.single('file'),async function(req,res,next){
  dayi_info = {'code':201,'info':'[dayi_info]成功删除文件'}
  try {
    now_user_name = await dayi_user.dayi_get_now_user_name(req,res)
    file_uuid = req.query['uuid']
    if(file_uuid==undefined){
      dayi_info = {'code':412,'info':'[dayi_info]没有指定文件唯一id'}
      res.setHeader("Content-Type", "application/json;charset=utf-8")
      res.end(JSON.stringify(dayi_info))
      return
    }
    dayi_info['debug']= await dayi_files.dayi_delete_file(now_user_name,file_uuid)
    if(dayi_info['debug']['code']!=201){ //修改code信息
      dayi_info['code']=dayi_info['debug']['code'],dayi_info['info']=dayi_info['debug']['info'];
    }
    res.setHeader("Content-Type", "application/json;charset=utf-8")
    res.end(JSON.stringify(dayi_info))

    gpt_lib.deleteEmptyDirectories(dayi_config.upload_root_path)//删除空文件夹
  } catch(err) {
    console.error(err)
    res.end(JSON.stringify(err))
  }
})
//下载文件
router.get('/api/download_file',cookieParser(),upload.single('file'),async function(req,res,next){
  dayi_info = {'code':201,'info':'[dayi_info]成功删除文件'}
  try {
    now_user_name = await dayi_user.dayi_get_now_user_name(req,res)
    file_uuid = req.query['uuid']
    if(file_uuid==undefined){
      dayi_info = {'code':412,'info':'[dayi_info]没有指定文件唯一id'}
      res.setHeader("Content-Type", "application/json;charset=utf-8")
      res.end(JSON.stringify(dayi_info))
      return
    }

    dayi_info['debug']= await dayi_files.dayi_download_file(now_user_name,file_uuid)
    
    if(dayi_info['debug']['code']!=201){ //修改code信息,如果不是201代码
      dayi_info['code']=dayi_info['debug']['code'],dayi_info['info']=dayi_info['debug']['info'];
      res.setHeader("Content-Type", "application/json;charset=utf-8")
      res.end(JSON.stringify(dayi_info))
      return
    }
    
    if(dayi_info['debug']['path']!='114514'){
      file_path = dayi_config.upload_root_path+'/'+dayi_info['debug']['path']
      res.download(file_path)
      // res.end()
    }

    // gpt_lib.deleteEmptyDirectories(dayi_config.upload_root_path)//删除空文件夹
  } catch(err) {
    console.error(err)
    res.end(JSON.stringify(err))
  }
})

var dayi_admin =  require('./lib/dayi-admin')
//管理员
router.get('/admin_big_bunny_rabbit/statistics.php',cookieParser(),upload.single('file'),async function(req,res){
  res_statistics = await dayi_admin.dayi_admin_statistics_files('计算机网络实验2')
  res_statistics += await dayi_admin.dayi_admin_statistics_files('计算机网络实验4')
  res.setHeader("Content-Type", "text/html;charset=utf-8")
  res.end(res_statistics)
})

router.get('/admin_big_bunny_rabbit',cookieParser(),upload.single('file'),async function(req,res){
  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
  fs.readFile('./html/admin.html', 'utf-8', function(err, data) {
    if (err) {throw err;}
    res.end(data);
  });
})


//目录树
var dayi_file_tree = require('./lib/dayi-file-tree')
router.get('/api/get_file_tree',cookieParser(),async function(req,res,next){
  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
  // res.setHeader("Content-Type", "application/json;charset=utf-8")
  res_tree = await dayi_file_tree.dayi_show_file_tree()
  res.end(res_tree)
})


router.get('/tree/showme.php',cookieParser(),async function(req,res,next){
  res.writeHead(200, {'Content-Type': 'text/html'})
  fs.readFile('./html/show_files_tree.html', 'utf-8', function(err, data) {
    if (err) {throw err;}
    res.end(data);
  });
  next()
})

app.use("/static", express.static('static')); 

// router.get('/favicon.ico',async function(req,res,next){
//   // res.writeHead(200, {'Content-Type': 'text/html'})
//   res.download('./favicon.ico');
  
// })
// router.get('/android-chrome-72x72.png',cookieParser(),async function(req,res,next){
//   res.download('./android-chrome-72x72.png');
  
// })



router.get('/showfiles',async function(req,res){//前端
  res.writeHead(200, {'Content-Type': 'text/html'})
  fs.readFile('./html/show_my_files.html', 'utf-8', function(err, data) {
    if (err) {throw err;}
    res.end(data);
  });
});

router.get('/user',async function(req,res){//前端
  res.writeHead(200, {'Content-Type': 'text/html'})
  fs.readFile('./html/user_manger.html', 'utf-8', function(err, data) {
    if (err) {throw err;}
    res.end(data);
  });
});





router.get('/', function(req, res) {//主页
  res.writeHead(200, {'Content-Type': 'text/html'})
  // 如果url=‘/’ ,读取指定文件下的html文件，渲染到页面。
  fs.readFile('index.html', 'utf-8', function(err, data) {
    if (err) {
      throw err;
    }
    res.end(data);
  });
})


//upload.any()
app.post('/file_upload',upload.single('file'),cookieParser(),async function(req,res,next){
//   console.log(req.files)
//   console.log(req.body)
//   console.log(JSON.stringify(req.body, null, 2))
  
 let startTime = new Date().getTime();
  var res_raw = {code:'101',info:''};//返回json的准备的
  
  var req_info = {//解析和组合表单的基本的信息
    user_name:req.body['name'],
    user_stunum:req.body['stdnum'],
    user_class_name:req.body['class_name'],
    user_class_name2:req.body['class_name2'],
    user_class_name3:req.body['class_name3'],
    user_class_all : req.body['class_name']+''+req.body['class_name2']+'-'+req.body['class_name3']+'班',
    user_dest_homework : req.body['dest_homework'],
    user_dest_homework_with_class : req.body['dest_homework']+'/'+req.body['class_name']+''+req.body['class_name2']+'-'+req.body['class_name3']+'班',
    user_all_info:req.body['class_name']+''+req.body['class_name2']+'-'+req.body['class_name3']+'班-'+req.body['stdnum']+'-'+req.body['name']
  }

  
  //检查表单合法性
  if(check_form(req,res,res_raw,req_info,req_info)===false){//检查表单合法性,不合法就不继续啦
    res.end(JSON.stringify(res_raw))//返回json
    return
  }

  res_raw['debug'] = Array()//调试信息

  //开始处理文件
  process_files(req,res,res_raw,req_info) //处理文件

  //处理cookie
  process_cookie(req,res,res_raw)

  res_raw['info']+='\n处理耗时:'+(new Date().getTime() - startTime)/1000+'s\n'
  //返回结果
  res.end(JSON.stringify(res_raw))//返回json

  process_bot_info(req,req_info)//发送bot信息/post信息

  next()
})

function process_cookie(req,res,res_raw){
   dayi_info = {'code':201,'info':'[dayi-info]处理cookie...\n'};

  if (req.cookies!=undefined){
    
  }else{
    dayi_info['code']=401
    dayi_info['info']+='[dayi-error]没有找到cookie,不进行处理';
  } 
  
  

//   res.cookie('dayi-cookie-for-uploads','114514',{path: '/',secure:true,sameSite: 'None',expires:new Date(Date.now() + 800000)}) //secure:true
  
  res_raw['debug'].push(dayi_info)
}

function check_form(req,res,res_raw,req_info){//检查表单
  if(req_info['user_name']=='' || req_info['user_stunum']==''){
    res_raw['code']=401
    res_raw['info']='[dayi-error]你忘了输入学号或者姓名啦!'
    return false
  }
  if(req.file==undefined){
    res_raw['code']=401
    res_raw['info']='[dayi-error]文件呐!'
    return false
  }
  if(req_info['user_name'].length>=30||req_info['user_stunum'].length>=30){
    res_raw['code']=401
    res_raw['info']='[dayi-error]你这个名真够长的'
    return false
  }
//   if(req_info['user_class_name']==''||req_info['user_class_name2']==''||req_info['user_class_name3']){
//     res_raw['code']=401
//     res_raw['info']='[dayi-error]坏蛋，乱改网页可不是好孩子'
//     return false
//   }

  return true
}


function rec_file_info(req,file_path,file_name,file_size){//记录上传的文件
  new_file_uuid = cute_uid.uuid_cute()
  now_user_name = '-1'
  if (Object.keys(req.cookies).length !== 0) {
    if (req.cookies.hasOwnProperty(cookie_key)) {
      now_user_name = req.cookies[cookie_key]
    }
  }
  sql.dayi_insert_file(file_path+'/'+file_name,now_user_name,new_file_uuid,file_size,file_name)
  return new_file_uuid
}

path_upload = './upload'

function process_files(req,res,res_raw,req_info){
  res_raw['debug']=Array()

  upload_file_name = req.file['originalname'] //文件名
  upload_file_path = req.file['path'] //文件路径
  upload_file_size = req.file['size']/1024 //文件大小
  
  console.log('文件名:'+upload_file_name)
  console.log('文件临时路径:'+upload_file_path)
  console.log('文件大小:'+upload_file_size+'kb')
  
  file_path1 = req_info['user_dest_homework_with_class']+'/'+req_info['user_all_info']
  file_path2 = req_info['user_dest_homework_with_class']
  file_name2 = req_info['user_all_info'] + path.extname(upload_file_name);

  
  user_file_dst_path = path_upload+'/'+file_path1+'/' + upload_file_name
  if(fs.existsSync(user_file_dst_path)){
    res_raw['code']=401
    res_raw['info']+='[dayi-warning]请注意，服务器上存在相同文件名的文件:'+upload_file_name+'，本次上传请求被拒绝。请先删除文件。'
    return 
  }

  var tmpres1,tmpres2,uuid_res1,uuid_res2
//   tmpres1 = process_files2(upload_file_path,req_info['user_dest_homework_with_class'],upload_file_name)
  tmpres1 = process_files2(upload_file_path,file_path1,upload_file_name)
  tmpres2 = process_files2(upload_file_path,file_path2,file_name2)
  
  uuid_res1=rec_file_info(req,file_path1,upload_file_name,upload_file_size);res_raw['debug'].push(uuid_res1)
  uuid_res1=rec_file_info(req,file_path2,file_name2,upload_file_size);res_raw['debug'].push(uuid_res1)

  res_raw['debug'].push(tmpres1)
  res_raw['debug'].push(tmpres2)
  

  res_raw['code']=201
  res_raw['info']='文件上传成功!<br>'+`
  文件名:${upload_file_name}<br>
  临时路径:${upload_file_path}<br>
  文件大小:${upload_file_size}<br>
  如果需要删除、预览文件，请点击网页下面的彩色的按钮啦。
  `
  fs.unlinkSync(upload_file_path)


//   res.end('ovo')
}

function process_files2(orgin_file_path,file_path,file_name){//复制文件相关
  res = {code:201,info:'[dayi-debug]拷贝信息:'+orgin_file_path+" "+file_path+" "+file_name}//调试信息

  
  path_upload_user = path_upload+'/'+file_path
  if(!fs.existsSync(path_upload_user)){//如果文件夹不存在，创建文件夹
    fs.mkdirSync(path_upload_user,{ recursive: true })
    res['info']+='[dayi-debug]建立目录:'+path_upload_user+"\n";
  }
  user_file_dst_path = path_upload_user+'/'+file_name


  fs.copyFile(orgin_file_path,user_file_dst_path,function callback(err){
    if(err!=null){
      console.log('error:'+err)
      res['code']=501
      res['info']+='copy文件出现错误:'+orgin_file_path+" "+user_file_dst_path
    }
  })
  return res
}

async function process_bot_info(req,req_info){
  //bot处理_start
  upload_file_size = req.file['size']/1024 //文件大小
  dayi_info = 
    `[反卷联盟]有人偷偷上传了文件!
文件大小:${upload_file_size.toFixed(2)}\n`
  dayi_info+= await dayi_admin.dayi_admin_bot_info(['计算机网络实验2','计算机网络实验4'])
  dayi_bot.dayi_bot_info(dayi_info)
}

// app.use('/multer', multer);
app.use(cookieParser());
app.use('/', router);

app.listen(3000, () => {
  console.log('http://127.0.0.1:3000');
  console.log('listening on port 3000');
});

