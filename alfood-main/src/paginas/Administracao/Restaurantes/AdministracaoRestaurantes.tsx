import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import axios, { AxiosRequestConfig } from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import http from '../../../http'
import { IPaginacao } from '../../../interfaces/IPaginacao'
import IRestaurante from '../../../interfaces/IRestaurante'
// import FormularioRestaurante from './FomularioRestaurante'

interface IParametrosBusca {
    ordering?: string
    search?: string
}

const AdministracaoRestaurantes = () => {
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
    const [busca, setBusca] = useState('')
    const [ordem, setOrdem] = useState('')

    useEffect(() => {
        http.get<IRestaurante[]>('restaurantes/')
            .then(res => setRestaurantes(res.data))
        axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/', {
            params: {
                ordering: 'nome',
                search: 'a'
            }
        })
    }, [])

    const buscar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const opcoes = {
            params: {} as IParametrosBusca
        }
        if (busca) {
            opcoes.params.search = busca
        }
        if (ordem) {
            opcoes.params.ordering = ordem
        }

       
        console.log(`Valor buscado--> ${busca}`)
        console.log(`Valor Recebido --> ${opcoes.params.search}`)
        console.log(`Tipo de ordenção enviado --> ${ordem}`)
        console.log(`Tipo de ordenção recebido --> ${opcoes.params.ordering}`)
        
        if(!busca && !ordem){
            setBusca('')
            setOrdem('')
            carregarDados('http://localhost:8000/api/v1/restaurantes/')
        }else{
            
            carregarDados(`http://localhost:8000/api/v1/restaurantes/?ordering=${opcoes.params.ordering}&search=${opcoes.params.search}`)
        }
    }

    const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
        http.get<IPaginacao<IRestaurante>>(url, opcoes)
            .then(res => {
                setRestaurantes(res.data.results)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const excluir = (restauranteParaExcluir: IRestaurante) => {
        http.delete(`restaurantes/${restauranteParaExcluir.id}/`)
            .then(() => {
                const listaRestaurantes = restaurantes.filter(restaurante => restaurante.id !== restauranteParaExcluir.id)
                setRestaurantes([...listaRestaurantes])
                alert('Restaurante excluído com sucesso!')
            })
    }
    return (
        <>
            <TableContainer component={Paper}>
            <form onSubmit={buscar} style={{margin: 10, padding: 10}}>
                <div>
                    <input type="text" value={busca} onChange={e => setBusca(e.target.value)} />
                    {console.log(busca)}
                </div>
                <div>
                    <label htmlFor="select-ordenacao">Ordenação</label>
                    <select
                        name="select-ordenacao"
                        id="select-ordenacao"
                        value={ordem}
                        onChange={e => setOrdem(e.target.value)}>
                        <option value="">Padrão</option>
                        <option value="id">Por ID</option>
                        <option value="nome">Por Nome</option>
                    </select>
                </div>
                <div>
                    <button type='submit'>Buscar</button>
                </div>
            </form>
                <Table>
                    <TableHead>
                        <Link style={{padding: 20, marginTop: 20}} to='/admin/restaurantes/novo'>Adicionar Novo</Link>
                        <TableRow>
                            <TableCell>
                                Nome
                            </TableCell>
                            <TableCell>
                                Editar
                            </TableCell>
                            <TableCell>
                                Excluir
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {restaurantes.map(restaurante => <TableRow key={restaurante.id}>
                            <TableCell>
                                {restaurante.nome}
                            </TableCell>
                            <TableCell>
                                [<Link to={`/admin/restaurantes/${restaurante.id}`}>Editar</Link>]
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" color="error" onClick={() => excluir(restaurante)}>Excluir</Button>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default AdministracaoRestaurantes
