const express = require(`express`)
const morgan = require(`morgan`)

const app = express()

app.use(morgan(`dev`))
app.use(express.json())
app.use(express.static(`./public`))

app.listen(3000, () => console.log(`Listening on 127.0.0.1:3000`))
