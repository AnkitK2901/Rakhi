document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTS ---
    const giftContainer = document.getElementById('gift-container');
    const giftBox = document.getElementById('gift-box');
    const mainContent = document.getElementById('main-content');
    const mainHeader = document.getElementById('main-header');
    const surpriseButton = document.getElementById('surprise-button');
    const modal = document.getElementById('surprise-modal');
    const modalOverlay = document.getElementById('surprise-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const finalConfettiButton = document.getElementById('final-confetti-button');

    // --- 1. GIFT BOX OPENING & ZOOM TRANSITION ---
    giftBox.addEventListener('click', () => {
        // Add 'opened' class to animate the lid
        giftBox.classList.add('opened');

        // After a delay, start the zoom-out effect
        setTimeout(() => {
            giftContainer.classList.add('zoom-out');
            mainContent.classList.remove('hidden');
        }, 600);

        // After animation finishes, remove the gift container and initialize AOS
        setTimeout(() => {
            giftContainer.remove();
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
            });
        }, 1600);
    });

    // --- 2. STICKY HEADER ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // --- 3. STORY DECK LOGIC ---
    const storyCards = document.querySelectorAll('.story-card');
    const nextBtn = document.getElementById('next-card-btn');
    const prevBtn = document.getElementById('prev-card-btn');
    let currentCardIndex = 0; // The first card is initially active in the HTML, so index is 0.

    // Find the initially active card to set the correct starting index
    storyCards.forEach((card, index) => {
        if (card.classList.contains('active')) {
            currentCardIndex = index;
        }
    });


    const updateCards = () => {
        storyCards.forEach((card, index) => {
            card.classList.remove('active', 'previous');
            if (index === currentCardIndex) {
                card.classList.add('active');
            } else if (index < currentCardIndex) {
                card.classList.add('previous');
            }
        });

        // Enable/disable navigation buttons
        prevBtn.disabled = currentCardIndex === 0;
        nextBtn.disabled = currentCardIndex === storyCards.length - 1;
    };

    nextBtn.addEventListener('click', () => {
        if (currentCardIndex < storyCards.length - 1) {
            currentCardIndex++;
            updateCards();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateCards();
        }
    });

    // Initialize the button states based on the initial active card
    updateCards();


    // --- 4. SURPRISE MODAL LOGIC ---
    const openModal = () => {
        modal.classList.remove('hidden');
        modalOverlay.classList.remove('hidden');
    };
    const closeModal = () => {
        modal.classList.add('hidden');
        modalOverlay.classList.add('hidden');
    };

    surpriseButton.addEventListener('click', openModal);
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // --- 5. FINAL CONFETTI BUTTON ---
    if (finalConfettiButton && typeof confetti !== 'undefined') {
        finalConfettiButton.addEventListener('click', () => {
            const rect = finalConfettiButton.getBoundingClientRect();
            const x = (rect.left + rect.right) / 2 / window.innerWidth;
            const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

            confetti({
                particleCount: 150,
                spread: 90,
                origin: { x, y },
                colors: ['#D9534F', '#FFC107', '#FFFFFF']
            });
        });
    }
});