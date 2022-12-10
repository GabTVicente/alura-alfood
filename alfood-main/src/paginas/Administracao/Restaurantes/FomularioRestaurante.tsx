import { Box, Button, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IRestaurante from "../../../interfaces/IRestaurante";

const FormularioRestaurante = () => {
  const [nomeRestaurante, setNomeRestaurante] = useState('')
  const parametros = useParams()

  useEffect(() => {
    if (parametros.id) {
      http.get<IRestaurante>(`restaurantes/${parametros.id}/`)
        .then(res => {
          setNomeRestaurante(res.data.nome)
        })
    }
  }, [parametros])


  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (parametros.id) {
      http.put(`restaurantes/${parametros.id}/`, {
        nome: nomeRestaurante,
      })
        .then(() => {
          alert('Restaurante atualizado com sucesso!')
        })
    } else {
      http.post('restaurantes/', {
        nome: nomeRestaurante,
      })
        .then(() => {
          alert(`Restaurante foi cadastrado com sucesso!`)
        })
      setNomeRestaurante('')
    }
  }

  return (
    <>
      {
        /*Conteudo da página*/
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
          <Typography component="h1" variant="h6">Formulário de Restaurantes</Typography>
          <Box sx={{ width: '100%' }} component='form' onSubmit={submitForm}>
            <TextField
              value={nomeRestaurante}
              onChange={e => setNomeRestaurante(e.target.value)}
              id="standard-basic" label="Nome do Restaurante"
              variant="standard"
              fullWidth
              required
            />
            <Button sx={{ marginTop: 1 }} variant='outlined' fullWidth type='submit'>Salvar</Button>
          </Box>
        </Box>
      }
    </>
  )
}
export default FormularioRestaurante