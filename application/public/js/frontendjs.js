function setFlashMessageFadeOut(flashMessageElement) {
    setTimeout(() => {
        let opacity = 1.0;
        let timer = setInterval(()=>{
            //TODO Edit Flash messages interval.
            if(opacity <0.05){
                clearInterval(timer);
                flashMessageElement.remove();
            }
            opacity -= 0.5;
            flashMessageElement.style.opacity = opacity;
        },50)
    },4000)
}
let flashElement = document.getElementById('flash-message');
if(flashElement){
    setFlashMessageFadeOut(flashElement);
}

function addFlashFromFrontEnd(message){
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);

    flashMessageDiv.setAttribute('id', 'flash-message');
    innerFlashDiv.setAttribute('class', 'alert alert-info');
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}
function createCard(postData){
    return `<div class="card" id="post-${postData.id}">
    <img class="card-image" src="${postData.thumbnail}" alt="">
    <div class="card-body">
        <p class="card-title">${postData.title}</p>
        <p class="card-text">${postData.description}</p>
        <a href="post/${postData.id}" class="anchor-buttons">Post Details</a>
    </div>
</div>`
}
function executeSearch(){
    let searchTerm = document.getElementById('search-text').value;
    if(!searchTerm){
        location.replace('/');
        return;
    }
    let mainContent = document.getElementsByClassName('main-content')[0];

    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
        .then((data) => {
            return data.json();
        })
        .then((data_json) =>{
            let newMainContentHTML = '';
            data_json.results.forEach((row) => {
                newMainContentHTML += createCard(row);
            });
            if(document.getElementById('form-page-container')){
                document.getElementById('form-page-container').id = "index-container";
            }
            mainContent.innerHTML = newMainContentHTML;
            if(data_json.message){
                addFlashFromFrontEnd(data_json.message);
            }
        })
        .catch((err) => console.log(err));
}

let searchButton = document.getElementById('search-button');
if(searchButton){
    searchButton.onclick = executeSearch;
}