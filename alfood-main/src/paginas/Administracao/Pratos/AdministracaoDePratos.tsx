import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import http from '../../../http'
import IPrato from '../../../interfaces/IPrato'
// import FormularioRestaurante from './FomularioRestaurante'

const AdministracaoPratos = () => {
    const [pratos, setPratos] = useState<IPrato[]>([])

    useEffect(() => {
        http.get<IPrato[]>('pratos/')
            .then(res => setPratos(res.data))
    }, [])

    const excluir = (pratoParaExcluir: IPrato) => {
        http.delete(`pratos/${pratoParaExcluir.id}/`)
            .then(() => {
                const listaPratos = pratos.filter(prato => prato.id !== pratoParaExcluir.id)
                setPratos([...listaPratos])
                alert('Prato excluído com sucesso!')
            })
    }
    return (
        <>
            {/* <form onSubmit={buscar}>
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
            </form> */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <Link to='/admin/Pratos/novo'>Adicionar Novo</Link>
                        <TableRow>
                            <TableCell>
                                Nome
                            </TableCell>
                            <TableCell>
                                Tag
                            </TableCell>
                            <TableCell>
                                Imagem
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
                        {pratos.map(prato => <TableRow key={prato.id}>
                            <TableCell>
                                {prato.nome}
                            </TableCell>
                            <TableCell>
                                {prato.tag}
                            </TableCell>
                            <TableCell>
                                [<a href={prato.imagem} target="_blank" rel="noreferrer">Ver Imagem</a>]
                            </TableCell>
                            <TableCell>
                                [<Link to={`/admin/pratos/${prato.id}`}>Editar</Link>]
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" color="error" onClick={() => excluir(prato)}>Excluir</Button>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default AdministracaoPratos
