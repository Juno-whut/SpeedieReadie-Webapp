let words = [];
let currentWordIndex = 0;
let readingInterval = null;

function startReading() {
    const wpm = document.getElementById("wpm").value;
    const wordsAtOnce = document.getElementById("words-at-once").value;
    const delay = 60000 / wpm * wordsAtOnce;

    if (readingInterval) {
        clearInterval(readingInterval);
    }

    readingInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
            const end = Math.min(currentWordIndex + parseInt(wordsAtOnce), words.length);
            document.getElementById("display-area").innerText = words.slice(currentWordIndex, end).join(' ');
            currentWordIndex = end;
        } else {
            clearInterval(readingInterval);
        }
    }, delay);
}

function stopReading() {
    clearInterval(readingInterval);
}

function resetReading() {
    stopReading();
    currentWordIndex = 0;
    document.getElementById("display-area").innerText = '';
}

function showSettings() {
    document.getElementById("settings-modal").style.display = 'block';
}

function closeSettings() {
    document.getElementById("settings-modal").style.display = 'none';
}

function applySettings() {
    const displayArea = document.getElementById("display-area");
    displayArea.style.fontSize = document.getElementById("font-size").value + 'px';
    displayArea.style.color = document.getElementById("text-color").value;
    displayArea.style.backgroundColor = document.getElementById("background-color").value;

    // Save user settings
    const wpm = document.getElementById('wpm').value;
    const chunkSize = document.getElementById('words-at-once').value;
    const fontSize = document.getElementById('font-size').value;
    const textColor = document.getElementById('text-color').value;
    const backgroundColor = document.getElementById('background-color').value;

    fetch("{% url 'save_user_settings' %}", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}'
        },
        body: JSON.stringify({
            wpm: wpm,
            chunk_size: chunkSize,
            font_size: fontSize,
            text_color: textColor,
            background_color: backgroundColor
        })
    });
}



