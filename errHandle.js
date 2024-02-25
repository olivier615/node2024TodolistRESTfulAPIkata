const http = require('http')

const errHandle = (res) => {
  const headers = {
    'Access-Control-Allow-Methods': 'PATCH , GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Content-Type': 'application/json',
  };
  res.writeHead(400, headers)
  res.write(
    JSON.stringify({
      status: 'false',
      message: '欄位填寫錯誤，或查無此 id'
    })
  )
  res.end()
}

module.exports = errHandle;