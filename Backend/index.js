const connectToMogo = require ("./db") 
const express = require('express')
// const bodyParser = require('body-parser')

connectToMogo()
const port = 8000

const app = express();
app.use(express.json())

// app.use(express.json)
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))

app.get('/iNotebook/notes', (req, res) => {
  res.send('Hello kamal!')
})

app.use('/api/auth/', require('./routes/auth'))
app.use('/api/notes/', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})