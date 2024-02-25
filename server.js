const http = require('http')
const errHandle = require('./errHandle');
const {
  v4: uuidv4
} = require('uuid')

const todos = []

const requestListener = (req, res) => {
  console.log('connect')
  const headers = {
    'Access-Control-Allow-Methods': 'PATCH , GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Content-Type': 'application/json',
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, headers)
    res.write(
      JSON.stringify({
        status: 'success',
        data: []
      })
    )
    res.end()
  } else if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers)
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos
      })
    )
    res.end()
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const {
          title
        } = JSON.parse(body)
        if (!title) throw new Error()
        const todo = {
          id: uuidv4(),
          title
        }
        todos.push(todo);
        res.writeHead(200, headers)
        res.write(
          JSON.stringify({
            status: 'success',
            data: todos
          })
        )
        res.end()
      } catch (error) {
        errHandle(res);
      }
    })
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0
    res.writeHead(200, headers)
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos
      })
    )
    res.end()
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop()
    const index = todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.splice(index, 1)
      res.writeHead(200, headers)
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos
        })
      )
      res.end()
    } else {
      errHandle(res);
    }
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const {
          title
        } = JSON.parse(body)
        const id = req.url.split('/').pop()
        const index = todos.findIndex(todo => todo.id === id)
        if (!title || index === -1) throw new Error()
        todos[index].title = title
        res.writeHead(200, headers)
        res.write(
          JSON.stringify({
            status: 'success',
            data: todos
          })
        )
        res.end()
      } catch (error) {
        errHandle(res);
      }
    })
  } else if (req.method === "OPTION") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers)
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此路由'
      })
    )
    res.end()
  }
}

const server = http.createServer(requestListener);
server.listen(3005);