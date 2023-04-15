const http = require('http');

async function dayi_post_bot_info(info){
  const post_data = {
    "group_id":"12345678",
    "message":""+info
  }
  const req = http.request({
    hostname: '127.0.0.1',
    path: 'send_group_msg?access_token=12345678',
    port: 12345,
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    }
  }, res => {
    res.setEncoding('utf8');
    if (res.statusCode !== 200) console.log(res.statusCode);
    res.on('data', d => {
      console.log('[dayi-info]bot:'+d.toString())
    });
  });
  req.write(JSON.stringify(post_data));
  req.on('error', err => {
    console.log(err);
  });
  req.end();
}

// dayi_post_bot_info('ovo')

exports.dayi_bot_info = dayi_post_bot_info