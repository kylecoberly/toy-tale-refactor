const toysUrl = "http://localhost:3000/toys"
let isAdding = false

const $ = {
    addButton: document.querySelector('#new-toy-btn'),
    toyForm: document.querySelector('.container'),
    toyCollection: document.querySelector('#toy-collection'),
}

attachEventListeners()
renderToys()

function renderToys() {
    return getToys().then(toys => toys.forEach(renderToy))
}

function getToys() {
    return fetch(toysUrl).then(parseJson)
}

function renderToy(toy) {
    $.toyCollection.prepend(buildToyCard(toy))
}

function buildToyCard(toy){
    const $div = createNewToyCard()
    const {name, image, id, likes} = toy
    $div.innerHTML = `
        <h1>${name}</h1>
        <img src="${image}" alt="${name}" />
        <p data-id=${id} data-likes=${likes}>${likes} likes</p>
        <button data-id=${id} class="like-btn">Like <3</button>
    `

    return $div
}

function createNewToyCard(){
    let $div = document.createElement('div')
    $div.id = "toy-collection"
    $div.classList.add('card')

    return $div
}


function createNewToy(toyData) {
    fetch(toysUrl, {
        method: "post",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            "name": toyData.name.value,
            "image": toyData.image.value,
            "likes": 0
        })
    }).then(parseJson)
    .then(craftToys)
}

function addLike(id, $p) {
    const likes = +$p.dataset.likes + 1;

    fetch(`${toysUrl}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ likes })
    }).then(parseJson)
    .then(renderLikes($p, likes));
}

function renderLikes(element, likeCount){
    return () => element.textContent = `${likeCount} likes`
}

function toggleFormDisplay(){
    isAdding = !isAdding
    isAdding
        ? $.toyForm.style.display = 'block'
        : $.toyForm.style.display = 'none'
}

function parseJson(response){
    return response.json()
}

function attachEventListeners(){
    $.addButton.addEventListener('click', toggleFormDisplay)
    $.toyForm.addEventListener('submit', event => {
        event.preventDefault()
        createNewToy(event.target)
    })
    $.toyCollection.addEventListener('click', event => {
        if (event.target.tagName === "BUTTON"){
            const id = event.target.dataset.id
            const $p = document.querySelector(`p[data-id="${id}"]`)
            addLike(id, $p)
        }
    })
}
