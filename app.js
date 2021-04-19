const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
const cards = document.getElementById('cards')
const search = document.getElementById('Buscador')
const templateList = document.getElementById('template-list').content
const resultados = document.querySelector('.resultados');

let resultado = {}
const apiId = "1f5afdd7df9072b6abfe95afde66cc8a";
let lang = 'es'
let idCiudad = '3431366'

const cityList = []


// Obtener datos desde la URL
const fetchData = async () => {

  try {
    const resp = await fetch(`http://api.openweathermap.org/data/2.5/weather?id=${idCiudad}&appid=${apiId}&lang=${lang}`)
    const data = await resp.json()
    pintarCards(data)

  } catch (error) {
    console.log(error)
  }
}

const getCities = () => {

  fetch('./city-list.json')
    .then(api => api.json())
    .then(data => cityList.push(...data))
}

const pintarCards = data => {

  const { coord, main, sys, weather } = data
  templateCard.querySelector('.card').dataset.id = data.id
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
  resultados.innerHTML = ''

  Object.values(resultado).forEach(element => {
    templateList.querySelector('.ciudad').textContent = `${element.name}, ${element.country}`
    templateList.querySelector('.ciudad').dataset.id = element.id

    const clone = templateList.cloneNode(true)
    fragment.appendChild(clone)
  });
  resultados.appendChild(fragment)
}

// Funcion ejecutada para encontrar un match en citylist y e.target.value
const findMatches = (wordToSearch, cityList) => {
  return cityList.filter(place => {
    const regex = new RegExp(wordToSearch, 'gi');
    return place.name.match(regex)
  })
}

const displayMatches = (e) => {
  resultados.style.display = 'block'
  const matchedArray = findMatches(e.target.value, cityList);
  if (matchedArray) {
    resultado = matchedArray
    pintarResultado()
  }
  e.stopPropagation()
}

const ciudadSeleccionada = e => {

  if (e.target.classList.contains('ciudad')) {
    pintarNuevo(e.target.parentElement)
    resultados.style.display = 'none'
  }
  e.stopPropagation()
}

const pintarNuevo = objeto => {
  const stringCode = objeto.querySelector('li').dataset.id
  idCiudad = stringCode
  //console.log(idCiudad)
  fetchData()
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData(),
    getCities()
})

resultados.addEventListener('click', e => {
  ciudadSeleccionada(e)
})

search.addEventListener('keyup', displayMatches)