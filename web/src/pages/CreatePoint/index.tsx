import React, {useEffect, useState, ChangeEvent} from 'react';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom'
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import api from '../../service/api'

import './style.css' ;

import logo from '../../assets/logo.svg'

// array ou obejeto: Manualmente infomrar o tipo da variavel

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface IBGEUFResponse {
  sigla: string,
}

interface IBGECityResponse {
  nome: string,
}


const CreatePoint = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  const [item, setItem] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [selectUf, setSelectUf] = useState('0');
  const [selectCity, setSelectCity] = useState('0');
  const [selectPosition, setSelectPosition] = useState<[number, number]>([0,0]);
  const [selectItems, setSelectItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

  useEffect(()=>{
    api.get('/items').then(
      response => {
        setItem(response.data)
      })
  }, []);

  useEffect(()=>{
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(
      response => {
        const ufInitials = response.data.map(uf => uf.sigla)

        setUfs(ufInitials);
      })
  }, []);

  useEffect(() => {
    if (selectUf === '0')
      return;
    
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`).then(
      response => {
        const cityInitials = response.data.map(city => city.nome)

        setCities(cityInitials);
      })

  }, [selectUf])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([
        latitude, 
        longitude
      ])
    })
  }, [initialPosition])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
    
  }

  function hadleInputChange(event:ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function hadleSelectItem(id: number) {
    const alreadySelected = selectItems.findIndex(item => item === id );

    if (alreadySelected >= 0) {
      const filteredItems = selectItems.filter( item => item !== id);
      setSelectItems(filteredItems)
    } else {
      setSelectItems([...selectItems, id])
    }
    
  }

  return(
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home 
        </Link>
      </header>

      <form>
        <h1>Cadastro do <br /> ponto de coleta</h1>
        
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name" 
              id="name"
              onChange={hadleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email" 
                id="email"
                onChange={hadleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp" 
                id="whatsapp"
                onChange={hadleInputChange}
              />
            </div>
          </div>
        </fieldset>
        
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecionar o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> 

            <Marker position={selectPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={selectUf} onChange={handleSelectUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map( uf => (
                <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.map( city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

          </div>
        </fieldset>
        
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
          </legend>

          <ul className="items-grid">
            {item.map( item => (
                <li 
                  key={item.id} 
                  onClick={()=>hadleSelectItem(item.id)} 
                  className={selectItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title}/>
                  <span>{item.title}</span>
                </li>      
            ))}
            
          </ul>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;