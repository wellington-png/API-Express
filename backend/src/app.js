const express = require('express')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors({ origin: ['http://localhost:5173'] }))

const arquivoJson = 'src/db/dados.json'
let dados = []

if (fs.existsSync(arquivoJson)) {
  const dadosRaw = fs.readFileSync(arquivoJson)
  dados = JSON.parse(dadosRaw)
} else {
  fs.writeFileSync(arquivoJson, '[]')
}

app.get('/', (req, res) => {
  res.status(200).send('Notas de Aula - IFPI')
})

app.get('/estudantes', (req, res) => {
  res.status(200).json(dados)
})

app.post('/estudantes', (req, res) => {
  const novoEstudante = {
    id: uuidv4(),
    nome: req.body.nome,
    dataNascimento: req.body.dataNascimento
  }

  dados.push(novoEstudante)
  fs.writeFileSync(arquivoJson, JSON.stringify(dados))
  res.status(201).json(novoEstudante)
})

app.get('/estudantes/:id', (req, res) => {
  const estudante = dados.find(p => p.id === req.params.id)
  if (estudante) {
    res.status(200).json(estudante)
  } else {
    res.status(404).send('Estudante não encontrado')
  }
})

app.delete('/estudantes/:id', (req, res) => {
  const index = dados.findIndex(p => p.id === req.params.id)
  if (index !== -1) {
    dados.splice(index, 1)
    fs.writeFileSync(arquivoJson, JSON.stringify(dados))
    res.status(200).send(`Estudante ${req.params.id} removido com
  sucesso`)
  } else {
    res.status(404).send('Estudante não encontrado')
  }
})

app.put('/estudantes/:id', (req, res) => {
  const estudante = dados.find(p => p.id === req.params.id)
  if (estudante) {
    estudante.nome = req.body.nome
    estudante.dataNascimento = req.body.dataNascimento
    fs.writeFileSync(arquivoJson, JSON.stringify(dados))
    res.status(200).send('Estudante alterado com sucesso')
  } else {
    res.status(404).send('Estudante não encontrado')
  }
})

module.exports = app
