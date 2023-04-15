var dayi_config = require('./dayi-config')
const fs = require('fs')
const path = require('path');

async function dayi_admin_bot_info(lists) {

  dayi_info = `[反卷联盟_统计信息]\n`
  const fileContents = fs.readFileSync('./lib/names.txt', 'utf8');
  const lines = fileContents.split('\r\n');
  if (fileContents == undefined) {return '[dayi-error]没有找到列表内容'}
  if (lines == undefined) {return '[dayi-error]没有找到列表内容2'}

  for (list_type of lists) {
    var vis = Array()
    if (list_type == undefined) {
      list_type = '/'
    } else {
      dayi_info += `${list_type}的信息:\n`
    }
    const allFiles = getAllFiles('./upload/' + list_type);

    //----错误处理_start----
    if (allFiles == undefined) {
      return '[dayi-error]服务器上没有找到文件'
    }
    //----错误处理_end----

    //开始统计
    for (i of lines) {
      vis[i] = 233
    }
    for (i of allFiles) {
      file_name = path.parse(i).name
      if (vis[file_name] == 233) {
        vis[file_name] = 1
      }
    }
    //结束统计

    cnt_uploaded = 0
    cnt_unuploaded = 0

    for (i of lines) {
      if (vis[i] == 233) {//没有上传的
        cnt_unuploaded++
      }
    }
    for (i of lines) {//已经上传的同学
      if (vis[i] == 1) {
        cnt_uploaded++
      }
    }
    dayi_info+=`偷卷的:${cnt_uploaded} `
    dayi_info+=`好孩子:${cnt_unuploaded}\n`
  }
  return dayi_info.replace(/^\s+|\s+$/g,'');//去除首位换行符
}


async function dayi_admin_statistics_files(list_type) {
  var vis = Array()
  var dayi_info = ''
  if(list_type==undefined){
    list_type='/'
  }else{
    dayi_info = `${list_type}的统计信息<br>`
  }
  const fileContents = fs.readFileSync('./lib/names.txt', 'utf8');
  const lines = fileContents.split('\r\n');
  const allFiles = getAllFiles('./upload/'+list_type);

  if(fileContents == undefined){
    return '[dayi-error]没有找到列表内容'
  }
  if(lines == undefined){
    return '[dayi-error]没有找到列表内容2'
  }
  if(allFiles == undefined){
    return '[dayi-error]服务器上没有找到文件'
  }

  // console.log(lines);
  for(i of lines){
    vis[i] = 233
  }
  for (i of allFiles) {
    file_name = path.parse(i).name
    // console.log(file_name)
    if(vis[file_name]==233){
      vis[file_name]=1
    }
  }

  for(i of lines){
    if(vis[i]==233){
      dayi_info+=`${i} [×]\n`
    }
  }
  for(i of lines){//已经上传的同学
    if(vis[i]==1){
      dayi_info+=`${i} [√]\n`
    }
  }

  return dayi_info

  // console.log(vis)
}



function getAllFiles(dir) {//by gpt
  if(!fs.existsSync(dir)){
    return undefined
  }
  const files = [];
  const directoryContents = fs.readdirSync(dir);
  for (const item of directoryContents) {
    const itemPath = `${dir}/${item}`;
    const itemStats = fs.statSync(itemPath);
    if (itemStats.isFile()) {
      files.push(itemPath);
    } else if (itemStats.isDirectory()) {
      files.push(...getAllFiles(itemPath));
    }
  }
  // Return the list of files
  return files;
}

// dayi_admin_statistics_files()

exports.dayi_admin_statistics_files = dayi_admin_statistics_files
exports.dayi_admin_bot_info = dayi_admin_bot_info