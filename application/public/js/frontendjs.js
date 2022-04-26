function setFlashMessageFadeOut() {
    setTimeout(() => {
        let opacity = 1.0;
        let timer = setInterval(()=>{
            //TODO Edit Flash messages interval.
            if(opacity <0.05){
                clearInterval(timer);
                flashElement.remove();
            }
            opacity -= 0.5;
            flashElement.style.opacity = opacity;
        },50)
    },4000)
}
let flashElement = document.getElementById('flash-message');
if(flashElement){
    setFlashMessageFadeOut();
}