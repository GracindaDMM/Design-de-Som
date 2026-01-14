const tooltip = document.getElementById("tooltip");

const emotionPages = {
    'vigilance': 'vigilance.html',
    'rage': 'rage.html',
    'loathing': 'loathing.html',
    'grief': 'grief.html',
    'amazement': 'amazement.html',
    'terror': 'terror.html',
    'admiration': 'admiration.html',
    'ecstasy': 'ecstasy.html',
    'optimism': 'optimism.html',
    'aggressiveness': 'aggressiveness.html',
    'contempt': 'contempt.html',
    'remorse': 'remorse.html',
    'disapproval': 'disapproval.html',
    'awe': 'awe.html',
    'submission': 'submission.html',
    'love': 'love.html'
};

document.querySelectorAll(".petala").forEach(p => {
    p.addEventListener("mousemove", e => {
        tooltip.textContent = p.dataset.label;
        tooltip.style.left = e.clientX + "px";
        tooltip.style.top = e.clientY + "px";
        tooltip.style.opacity = 1;
    });

    p.addEventListener("mouseleave", () => {
        tooltip.style.opacity = 0;
    });
});


document.querySelectorAll(".petala").forEach(p => {
    p.addEventListener("click", () => {
        const emotion = p.dataset.label.toLowerCase();
        const page = emotionPages[emotion];

        if (page) {
            window.location.href = page;
        } else {
            console.error(`Página não encontrada para a emoção: ${emotion}`);
        }
    });
});


document.querySelectorAll(".emotion-item").forEach(item => {
    item.addEventListener("click", () => {
        const emotion = item.querySelector(".emotion-name").textContent.toLowerCase();
        const page = emotionPages[emotion];

        if (page) {
            window.location.href = page;
        }
    });
});

const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});