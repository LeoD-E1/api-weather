const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
const cards = document.getElementById('cards')
const search = document.getElementById('Buscador')
const templateList = document.getElementById('template-list').content
const resultados = document.querySelector('.resultados')

let resultado = {}

document.addEventListener('DOMContentLoaded', () => {
  fetchData()
})

// Obtener datos desde la URL
const fetchData = async () => {
  try {
    const resp = await fetch('http://api.openweathermap.org/data/2.5/weather?id=3435874&appid=1f5afdd7df9072b6abfe95afde66cc8a&lang=es')
    const data = await resp.json()
    const api = await fetch('./city-list.json')
    const cityList = await api.json()
    
    console.log(data)
    pintarCards(data)
    filtrarBusqueda(cityList)

  } catch (error) {
    console.log(error)
  }
}

const pintarCards = data => {
  
  const {coord, main, sys, weather} = data
  templateCard.querySelector('h2').textContent = `${data.name} - ${sys.country}`
  templateCard.querySelector('h1').textContent = `${(main.temp - 273.15).toFixed(1)}°C`
  templateCard.querySelectorAll('h3')[0].textContent = `${weather[0].main}: ${weather[0].description}`
  templateCard.querySelectorAll('h3')[1].textContent = `Lat: ${coord.lat}; Lon: ${coord.lon}`
  templateCard.querySelectorAll('h3')[2].textContent = `Nubes: ${data.clouds['all']}%`

  const clone = templateCard.cloneNode(true)
  fragment.appendChild(clone)
  cards.appendChild(fragment)
}

// Pintar Resultado de la Busqueda
const pintarResultado = () => {
  resultados.innerHTML  = ''

  Object.values(resultado).forEach(element => {
    templateList.querySelector('.lista').textContent = element.name
    templateList.querySelector('.lista').dataset.id = element.id
    
    const clone = templateList.cloneNode(true)
    fragment.appendChild(clone)
  });
  resultados.appendChild(fragment)
  console.log(resultados)
  resultados.style.display = 'block'
}

const filtrarBusqueda = (cityList) => {
  //console.log(name)
  search.addEventListener('keyup', e => {

    for(let letter in e.target.value){
      const result = cityList.filter(item => item.name[letter] === e.target.value[letter])
      if(result && result !== []){
        //console.log(result)
        resultado = result
      }
      console.log(resultado)
      pintarResultado()
    }

    e.stopPropagation()
  })
}

