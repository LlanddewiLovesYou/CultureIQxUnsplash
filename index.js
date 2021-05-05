const UNSPLASH_BASE_URL = "https://api.unsplash.com/search/photos"
const UNSPLASH_API_KEY = "Kwmz0jittYrHpDWnjppCukrtXUzZimVBNc3zGD8c06g"

const elements = {
  searchButton: document.getElementById('search-button'),
  modal: document.getElementById('modal'),
  modalImage: document.getElementById('modal-image'),
  details: document.getElementById('modal-description'),
  queryElement: document.getElementById('query'),
  input: document.getElementById('search-input'),
  close: document.getElementById('close')
}

function getPhotoFromLocalStorageById(id) {
  const photos = JSON.parse(window.localStorage.getItem('photos'))
  return photos.filter((photo) => photo.id === id)[0]
}

function openModal(photoElementId) {
  elements.modalImage.innerHTML = null
  const photo = getPhotoFromLocalStorageById(photoElementId)
  createAndAppendPhotoElement(photo, elements.modalImage, 'large')
  elements.details.innerHTML = photo.id
  window.scrollTo(0,0)
  elements.modal.classList.add('visible')
}

function closeModal() {
  elements.modal.classList.remove('visible')
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

function appendQueryToDom() {
  const query = window.localStorage.getItem("query")
  elements.queryElement.innerHTML = `Search results for "${query}"`
}

function appendThumbnailsToDom() {
  const photos = JSON.parse(window.localStorage.getItem('photos'))
  const photoResultsSection = document.getElementById('photo-results')
  photoResultsSection.innerHTML = null

  appendQueryToDom()
  photos.forEach((photo) => {
    createAndAppendPhotoElement(photo, photoResultsSection, 'thumbnail')
  })
}

function getPhotos() {
  const query = elements.input.value
  return fetch(`${UNSPLASH_BASE_URL}?client_id=${UNSPLASH_API_KEY}&query=${query}`)
    .then((response) => {
      return response.json()
  }).then((photos) => {
    window.localStorage.setItem("photos", JSON.stringify(photos.results))
    window.localStorage.setItem("query", query)
    elements.input.value = ''
  })
}

function addListenerToModal() {
  elements.modal.addEventListener('click', function() {
    closeModal()
  })
  elements.close.addEventListener('click', function() {
    closeModal()
  })
}

function addListenerToSearchButton() {
  elements.searchButton.addEventListener("click", function(e) {
    e.preventDefault()
    getPhotos().then(() => {
      appendThumbnailsToDom()
    })
  })
}

function resetLocalStorage() {
  window.localStorage.setItem('photos','[]')
  window.localStorage.setItem('query','')
}

function initPage() {
  addListenerToSearchButton()
  addListenerToModal()
  resetLocalStorage()
}

initPage()