const cards = document.querySelectorAll('.animated-image-card');

function onCardClick(currentCard){
    cards.forEach(i => {
        if(i !== currentCard){
            if(i.classList.contains('flipped')){
                i.classList.toggle('flipped');
            }
        }
    });
}

cards.forEach(card => {
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');   
        onCardClick(this);
    });
});