import React, { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios,{AxiosRequestConfig} from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

interface IParametrosBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPag, setProximaPag] = useState('');
  const [pagAnterior, setPaginaAnterior] = useState('');
  const [busca, setBusca] = useState('');
  
  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) =>{
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(res => {
        setRestaurantes(res.data.results);
        setProximaPag(res.data.next);
        setPaginaAnterior(res.data.previous);
      })
      .catch(e => {
        console.log(e)
      })
  }

  const buscar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const opcoes = {
      params:{

      }as IParametrosBusca
    }
    if(busca){
      opcoes.params.search = busca
      
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes)  
  }
  
  const verMais = () => {
    axios.get<IPaginacao<IRestaurante>>(proximaPag)
    setProximaPag(proximaPag)
    console.log(restaurantes)
  }

  useEffect(() => {
    //Obter restaurantes
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, [])

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <form onSubmit={buscar}>
      <input type="text" value={busca} onChange={e => setBusca(e.target.value)} />
      <button type='submit'>buscar</button>
    </form>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {<button onClick={() => carregarDados(pagAnterior)} disabled={!pagAnterior}>
      Página Anterior
    </button>}
    {<button onClick={() => carregarDados(proximaPag)} disabled={!proximaPag}>
      Próxima página
    </button>}
  </section>)
}

export default ListaRestaurantes