const UNSPLASH_BASE_URL = "https://api.unsplash.com/search/photos"
const UNSPLASH_API_KEY = "Kwmz0jittYrHpDWnjppCukrtXUzZimVBNc3zGD8c06g"

function getPhotoFromLocalStorageById(id) {
  const photos = JSON.parse(window.localStorage.getItem('photos'))
  return photos.filter((photo) => photo.id === id)[0]
}

function openModal(photoElementId) {
  const modal = document.getElementById('modal')
  const modalImage = document.getElementById('modal-image')
  const details = document.getElementById('modal-description')
  modalImage.innerHTML = null

  const photo = getPhotoFromLocalStorageById(photoElementId)
  createAndAppendPhotoElement(photo, modalImage, 'large')
  details.innerHTML = photo.id
  window.scrollTo(0,0)
  modal.classList.add('visible')
}

function closeModal() {
  const modal = document.getElementById('modal')
  modal.classList.remove('visible')
}

function createAndAppendPhotoElement(photo, parent, classname) {
  const photoElement = document.createElement('img')
  photoElement.classList.add(classname)
  photoElement.src = `${photo.urls.thumb}?client_id=${UNSPLASH_API_KEY}`
  photoElement.id = photo.id
  photoElement.addEventListener('click', function() {
    openModal(photoElement.id)
  })
  parent.append(photoElement)
}

function appendQueryToDom(element) {
  const query = window.localStorage.getItem("query")
  const queryElement = document.getElementById('query')
  queryElement.innerHTML = `Search results for "${query}"`
}

function appendThumbnailsToDom() {
  const photos = JSON.parse(window.localStorage.getItem('photos'))
  const photoResultsSection = document.getElementById('photo-results')
  photoResultsSection.innerHTML = null

  appendQueryToDom(photoResultsSection)
  photos.forEach((photo) => {
    createAndAppendPhotoElement(photo, photoResultsSection, 'thumbnail')
  })
}

function getPhotos() {
  const input = document.getElementById('search-input')
  const query = input.value
  return fetch(`${UNSPLASH_BASE_URL}?client_id=${UNSPLASH_API_KEY}&query=${query}`)
    .then((response) => {
      return response.json()
  }).then((photos) => {
    window.localStorage.setItem("photos", JSON.stringify(photos.results))
    window.localStorage.setItem("query", query)
    input.value = ''
  })
}

function addListenerToModal() {
  const close = document.getElementById('close')
  const modal = document.getElementById('modal')
  modal.addEventListener('click', function() {
    closeModal()
  })
  close.addEventListener('click', function() {
    closeModal()
  })
}

function addListenerToSearchButton() {
  const searchButton = document.querySelector('#search-button');
  searchButton.addEventListener("click", function(e) {
    e.preventDefault()
    getPhotos().then(() => {
      appendThumbnailsToDom()
    })
  })
}

function initPage() {
  addListenerToSearchButton()
  addListenerToModal()
  window.localStorage.setItem('photos','[]')
}

initPage()