import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IRestaurante from "../../../interfaces/IRestaurante";
import ITag from '../../../interfaces/ITag'
import IPrato from '../../../interfaces/IPrato'


const FormularioPrato = () => {
    const [nomePrato, setNomePrato] = useState('')
    const [descricaoPrato, setDescricaoPrato] = useState('')

    const [tags, setTags] = useState<ITag[]>([])
    const [tag, setTag] = useState('')

    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
    const [restaurante, setRestaurante] = useState(0)

    const [imagem, setImagem] = useState<File | null>(null)

    const parametros = useParams()

    useEffect(() => {
        http.get<{ tags: ITag[] }>('tags/')
            .then(res => setTags(res.data.tags))
        http.get<IRestaurante[]>('restaurantes/')
            .then(res => setRestaurantes(res.data))
    }, [])

    useEffect(() => {
            if(parametros.id){
            http.get<IPrato>(`pratos/${parametros.id}/`)
                .then(res => {
                    setNomePrato(res.data.nome)
                    setDescricaoPrato(res.data.descricao)
                    setTag(res.data.tag)
                    setRestaurante(res.data.restaurante)
            })
        }
    }, [parametros])

    //Pegar conteúdo da Imagem
    const selecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setImagem(e.target.files[0])
        } else {
            setImagem(null)
        }
    }

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('nome', nomePrato)
        formData.append('descricao', descricaoPrato)
        formData.append('tag', tag)
        formData.append('restaurante', restaurante.toString())

        //checa se existe imagem

        if (!parametros.id && imagem) {
            formData.append('imagem', imagem)
        }

        const url = parametros.id ? `/pratos/${parametros.id}/` : '/pratos/'
        const method = parametros.id ? 'PUT' : 'POST'
        //Editar pratos

        //POST PARA ADICIONAR PRATOS

        http.request({
            url,
            method,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(() => {
                if (parametros.id) {
                    alert('Prato atualizado com sucesso!')
                } else {
                    setDescricaoPrato('')
                    setNomePrato('')
                    setTag('')
                    setRestaurante(0)
                    alert('Prato cadastrado com sucesso!')
                }
            })
            .catch(e => console.log(e))
    }



    return (
        <>
            {
                /*Conteudo da página*/
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <Typography component="h1" variant="h6">Formulário de Pratos</Typography>
                    <Box sx={{ width: '100%' }} component='form' onSubmit={submitForm}>
                        <TextField
                            value={nomePrato}
                            onChange={e => setNomePrato(e.target.value)}
                            id="standard-basic" label="Nome do Prato"
                            variant="standard"
                            fullWidth
                            required
                            margin="dense"
                        />
                        <TextField
                            value={descricaoPrato}
                            onChange={e => setDescricaoPrato(e.target.value)}
                            id="standard-basic" label="Descrição do Prato"
                            variant="standard"
                            fullWidth
                            required
                            margin="dense"
                        />
                        <FormControl margin='dense' fullWidth>
                            <InputLabel id="select-tag">Tag</InputLabel>
                            <Select label="outlined" variant="outlined" labelId="select-tag" value={tag} onChange={e => setTag(e.target.value)}>
                                {tags.map(tag =>
                                    <MenuItem key={tag.id} value={tag.value}>
                                        {tag.value}
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl margin='dense' fullWidth>
                            <InputLabel variant="outlined" id="select-restaurante">Restaurante</InputLabel>
                            <Select label="outlined"  variant="outlined" labelId="select-restaurante" value={restaurante} onChange={e => setRestaurante(Number(e.target.value))}>
                                {restaurantes.map(restaurante =>
                                    <MenuItem key={restaurante.id} value={restaurante.id}>
                                        {restaurante.nome}
                                    </MenuItem>)}
                            </Select>
                        </FormControl>

                        <input type="file" onChange={selecionarArquivo} />
                        <Button sx={{ marginTop: 1 }} variant='outlined' fullWidth type='submit'>Salvar</Button>
                    </Box>
                </Box>
            }
        </>
    )
}
export default FormularioPrato