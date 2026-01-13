const card = document.querySelector('.animated-card');

card.addEventListener('click', function() {
    this.classList.toggle('flipped');
});