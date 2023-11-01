import { useState, useEffect } from 'react'
import axios from 'axios'

import './App.css'

function App() {
  const apiURL = 'http://localhost:8080'
  const [estudantes, setEstudantes] = useState([])
  const [estudanteSelecionado, setEstudanteSelecionado] = useState(null)
  const [novoEstudante, setNovoEstudante] = useState({
    nome: '',
    dataNascimento: ''
  })
  const [erro, setErro] = useState(null)

  const AdicionarEstudante = async () => {
    try {
      const dataNascimentoFormatada = novoEstudante.dataNascimento
        .split('-')
        .reverse()
        .join('-')
      const novoEstudanteFormatado = {
        nome: novoEstudante.nome,
        dataNascimento: dataNascimentoFormatada
      }
      if (estudanteSelecionado) {
        await axios.put(
          `${apiURL}/estudantes/${estudanteSelecionado.id}`,

          novoEstudanteFormatado
        )
      } else {
        await axios.post(`${apiURL}/estudantes`, novoEstudanteFormatado)
      }
      setEstudanteSelecionado(null)
      setNovoEstudante({ nome: '', dataNascimento: '' })
      buscarRegistros()
      setErro('')
    } catch (error) {
      setErro(`Erro ao adicionar estudante: ${error.message}`)
    }
  }

  const CancelarAtualizacao = () => {
    setEstudanteSelecionado(null)
    setNovoEstudante({ nome: '', dataNascimento: '' })
  }
  const EditarEstudante = estudante => {
    setEstudanteSelecionado(estudante)
    const dataNascimentoFormatada = estudante.dataNascimento
      .split('-')
      .reverse()
      .join('-')
    setNovoEstudante({
      nome: estudante.nome,
      dataNascimento: dataNascimentoFormatada
    })
  }

  const buscarRegistros = async () => {
    try {
      const response = await axios.get(`${apiURL}/estudantes`)
      setEstudantes(response.data)
      setErro('')
    } catch (error) {
      setErro('Erro ao buscar estudantes: ' + error.message)
    }
  }

  const RemoverEstudante = async id => {
    try {
      await axios.delete(`${apiURL}/estudantes/${id}`)
      buscarRegistros()
      setErro('')
    } catch (error) {
      setErro(`Erro ao remover estudante: ${error.message}`)
    }
  }

  useEffect(() => {
    buscarRegistros()
  }, [])

  return (
    <div className="container">
      <h1>Gerenciamento de Estudantes</h1>
      {erro && <p className="error">{erro}</p>}
      <table>
        <tbody>
          {estudantes.map(estudante => (
            <tr key={estudante.id}>
              <td>{estudante.nome}</td>
              <td>{estudante.dataNascimento}</td>
              <td>
                <button
                  className="editButton"
                  onClick={() => EditarEstudante(estudante)}
                >
                  Editar
                </button>
                <button
                  className="removeButton"
                  onClick={() => RemoverEstudante(estudante.id)}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Adicionar/Atualizar Estudante</h2>
      <div className="form">
        <label>Nome: </label>
        <input
          type="text"
          value={novoEstudante.nome}
          onChange={e =>
            setNovoEstudante({ ...novoEstudante, nome: e.target.value })
          }
        />
        <label>Data de Nascimento: </label>
        <input
          type="date"
          value={novoEstudante.dataNascimento}
          onChange={e =>
            setNovoEstudante({
              ...novoEstudante,

              dataNascimento: e.target.value
            })
          }
        />
        <button className="addButton" onClick={AdicionarEstudante}>
          {estudanteSelecionado ? 'Atualizar' : 'Adicionar'}
        </button>
        <button className="cancelButton" onClick={CancelarAtualizacao}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default App
