var mysql = require('mysql')
var dayi_mysql_tables = require('./dayi-mysql-tables')

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'collect_node',
  password : '123456',
  database : 'collect_node'
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});


function dayi_create_tables(){
  connection.query(dayi_mysql_tables.sql_table_1, function (error,results,fields){
    if(error){console.log(error);return;}
    // console.log('The results is: ', results);
  });
  connection.query(dayi_mysql_tables.sql_table_2,function(error,results,fields){
    if(error){console.log(error);return;}
  })
}

function dayi_insert_file(file_path,user_name,file_uuid,file_size,file_name){
  sql = 'INSERT INTO files SET ?'
  sets = {'user_name':user_name,'file_path':file_path,'uuid':file_uuid,'file_size':file_size,'file_name':file_name};
  connection.query(sql,sets,function(error,result,fields){
    // console.log(result)
    if(error){console.log(error);return;}
  });
}

function dayi_insert_user(user_name){
  //(`id`, `user_name`, `passwd`, `permission`, `name`, `stu_number`, `json`) 
  //VALUES (NULL, ?, NULL, \'1\', NULL, NULL, NULL);
  sql = 'INSERT INTO `users` SET ?'
  sets = {
    'user_name':user_name,
    'permission':1
  }
  connection.query(sql,sets,function(error,result,fields){
    // console.log(result)
    if(error){console.log(error);return;}
  });
}

//查询用户是否存在于数据库中
async function dayi_query_user(user_name) {
  return new Promise((resolve, reject) => {
    sql = 'select * from `users` where ?'
    sets ={
      'user_name':user_name
    }
    connection.query(sql, sets, function(error, result, fields) {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(result.length >= 1)
    })
  })
}


async function dayi_user_files(user_name,file_uuid) {
  return new Promise((resolve, reject) => {
    sql = 'select * from `files` where ?'
    sets ={
      'user_name':user_name
    }
    if(file_uuid != undefined){
      sql = "select * from `files` where user_name = ? and uuid = ?"
      sets = [user_name,file_uuid]
    }
    connection.query(sql, sets, function(error, result, fields) {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(result)
    })
  })
}



async function dayi_delete_file_sql(file_uuid) {
  return new Promise((resolve, reject) => {
    sql = 'delete from `files` where ?'
    sets ={
      // 'user_name':user_name,
      'uuid':file_uuid
    }
    connection.query(sql, sets, function(error, result, fields) {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(result)
    })
  })
}


async function dayi_query_user_permisson(user_name){
  return new Promise((resolve, reject) => {
    sql = 'select * from `files` where user_name = ?'
    sets ={
      'user_name':user_name,
      // 'uuid':file_uuid
    }
    connection.query(sql, sets, function(error, result, fields) {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(result[0].permission)
    })
  })
}


dayi_create_tables()
// dayi_query_user('amazing-frog-ask-small-panda-by-kick-south-monkey-7457')
// dayi_query_user('south-monkey-get-sweet-shark-for-call-cute-whale-3005')
exports.dayi_query_user_permisson = dayi_query_user_permisson
exports.dayi_delete_file_sql = dayi_delete_file_sql
exports.dayi_user_files = dayi_user_files
exports.dayi_insert_file = dayi_insert_file
exports.dayi_insert_user = dayi_insert_user
exports.dayi_query_user = dayi_query_user



// console.log(dayi_mysql_tables.sql_table_2)

// var cute_uuid = require('./uuid-cute')

// dayi_create_tables()
// dayi_insert_file('./ovo/ovo.jpg','114514',cute_uuid.uuid_cute())
// dayi_insert_user(cute_uuid.uuid_cute())
