import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CarrosList.css';
import logoImg from '../Logo.png';
import { Autocomplete, TextField } from '@mui/material';


const CarrosList = () => {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar lista de marcas
    const fetchMarcas = async () => {
      try {
        const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
        setMarcas(response.data);
      } catch (error) {
        console.error('Erro ao obter dados da API de marcas', error);
      }
    };

    fetchMarcas();
  }, []);

  useEffect(() => {
    // Carregar lista de modelos com base na marca selecionada
    const fetchModelos = async () => {
      if (marcaSelecionada) {
        try {
    
          const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada.codigo}/modelos`);
          setModelos(response.data.modelos);
        } catch (error) {
          console.error('Erro ao obter dados da API de modelos', error);
        }
      }
    };

    fetchModelos();
  }, [marcaSelecionada]);

  useEffect(() => {
    // Carregar lista de anos com base no modelo selecionado
    const fetchAnos = async () => {
      if (modeloSelecionado) {
        try {
          const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada.codigo}/modelos/${modeloSelecionado.codigo}/anos`);
          //32000 Diesel
          const anosFiltrados = response.data.filter((ano) => !ano.nome.includes('32000'));
          setAnos(anosFiltrados);
        } catch (error) {
          console.error('Erro ao obter dados da API de anos', error);
        }
      }
    };

    fetchAnos();
  }, [modeloSelecionado, marcaSelecionada]);

  useEffect(() => {
    // Carregar resultados da API com base nos combobox's preenchidos
    const fetchResultados = async () => {
      if (marcaSelecionada && modeloSelecionado && anoSelecionado) {
        try {
          console.log(anoSelecionado)
          const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada.codigo}/modelos/${modeloSelecionado.codigo}/anos/${anoSelecionado.codigo}`);
          setResultados(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao obter dados da API de resultados', error);
        }
      }
    };

    fetchResultados();
  }, [marcaSelecionada, modeloSelecionado, anoSelecionado]);



  const handleMarcaChange = (event) => {
    console.log(event)
    setMarcaSelecionada(event.target.value);
    console.log(event.target.value)
    setModeloSelecionado('');
    setAnoSelecionado('');
  };

  const handleModeloChange = (event) => {
    setModeloSelecionado(event.target.value);
    setAnoSelecionado('');
  };

  const handleAnoChange = (event) => {
    setLoading(true);
    setAnoSelecionado(event.target.value);
  };

  return (
    <div>
      {/* Faixa superior */}
      <div className="header">
        <img src={logoImg} alt="Logo da Tabela FIPE" />
      </div>

      {/*Container Principal*/}
      <div className='container'>
        <h3>Lista de Carros</h3>
        <div className="combobox-container">
          <div className="combobox combobox-marca">
            <label htmlFor="marcas">Selecione a marca:</label>
            <Autocomplete
              id="marcas"
              options={marcas}
              getOptionLabel={(option) => option.nome}
              value={marcaSelecionada}
              onChange={(e, value) => {
                setMarcaSelecionada(value)
               
              }}
              renderInput={(params) => (
                <TextField {...params} label="Marca" variant="outlined" />
              )}
              
            />
          </div>

          {marcaSelecionada && (

            <div className="combobox combobox-modelo">
              <label htmlFor="modelos">Selecione o modelo:</label>
              <Autocomplete
              id="modelos"
              options={modelos}
              getOptionLabel={(option) => option.nome}
              value={modeloSelecionado}
              onChange={(e, value) => {
                setModeloSelecionado(value)
              }}
              renderInput={(params) => (
                <TextField {...params} label="Modelos" variant="outlined" />
              )}
              freeSolo
            />
              {/* <select id="modelos" onChange={handleModeloChange} value={modeloSelecionado}>
                <option value="">Selecione um modelo</option>
                {modelos.map((modelo) => (
                  <option key={modelo.codigo} value={modelo.codigo}>
                    {modelo.nome}
                  </option>
                ))}
              </select> */}
            </div>
          )}

          {modeloSelecionado && (
            <div className="combobox combobox-ano">
              <label htmlFor="anos">Selecione o ano:</label>
              <Autocomplete
              id="anos"
              options={anos}
              getOptionLabel={(option) => option.nome}
              value={anoSelecionado}
              onChange={(e, value) => {
                setAnoSelecionado(value)
                setLoading(true)
              }}
              renderInput={(params) => (
                <TextField {...params} label="Ano" variant="outlined" />
              )}
              freeSolo
            />
              {/* <select id="anos" onChange={handleAnoChange} value={anoSelecionado}>
                <option value="">Selecione um ano</option>
                {anos.map((ano) => (
                  <option key={ano.codigo} value={ano.codigo}>
                    {ano.nome}
                  </option>
                ))}
              </select> */}
              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {Object.keys(resultados).length > 0 && (
        <div className='result-container'>
          <h3>Resultados</h3>
          <table>
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Ano</th>
                <th>Valor</th>
                <th>Referência</th>
                <th>Código FIPE</th>

              </tr>
            </thead>
            <tbody>
              <tr key={resultados.CodigoFipe}>
                <td>{resultados.Marca}</td>
                <td>{resultados.Modelo}</td>
                <td>{resultados.AnoModelo}</td>
                <td>{resultados.Valor}</td>
                <td>{resultados.MesReferencia}</td>
                <td>{resultados.CodigoFipe}</td>
              </tr>
            </tbody>
          </table>
          <h6>Essa Ferramenta Fipe utiliza banco de dados próprio, onde todas as requisições acontecem internamente, sem sobrecarregar o Web Service da Fipe, evitando assim bloqueios por múltiplos acessos.</h6>
        </div>
      )}

      {/*Inicio da propriedade de conteudo*/}
      <div className='conteudo'>
        <h3>O que é a Tabela FIPE?</h3>
        <br />
        <p>
          A Tabela FIPE (Fundação Instituto de Pesquisas Econômicas) é uma referência essencial no cenário automotivo brasileiro,
          fornecendo dados atualizados sobre preços médios de veículos. Criada com o propósito de auxiliar consumidores, revendedores
          e profissionais do setor, a Tabela FIPE se consolidou como uma fonte confiável de informações para quem está envolvido na
          compra e venda de automóveis, motocicletas e caminhões.
        </p><br />

        <p>
          O principal objetivo da Tabela FIPE é oferecer uma base de dados consistente que reflita os valores praticados pelo mercado.
          Ela é alimentada por informações coletadas junto a concessionárias, revendedores, consumidores e outros agentes do setor,
          garantindo uma ampla representatividade nas médias de preços. Essa abrangência possibilita uma visão abrangente do panorama
          nacional, ajudando a estabelecer parâmetros realistas para a negociação de veículos usados.
        </p><br />

        <p>
          Os dados disponibilizados pela Tabela FIPE são segmentados por marca, modelo, ano de fabricação e tipo de combustível.
          Dessa forma, os usuários podem obter informações específicas para tomar decisões mais informadas na compra ou venda de um veículo,
          levando em consideração fatores como depreciação, características do mercado e demanda por determinados modelos.
        </p><br />

        <p>
          Além de ser uma ferramenta valiosa para quem está diretamente envolvido no comércio de veículos, a Tabela FIPE também se tornou
          uma referência para consumidores em busca de informações imparciais sobre os valores praticados no mercado automotivo. Com acesso
          gratuito e fácil, a Tabela FIPE contribui para a transparência nas transações, promovendo um ambiente mais equilibrado e justo
          para compradores e vendedores.
        </p>

      </div>


    </div>

  );
};

export default CarrosList;
