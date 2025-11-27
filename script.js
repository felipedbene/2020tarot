// Tarot deck
const majorArcana = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
];

const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King'];

const minorArcana = [];
suits.forEach(suit => {
    ranks.forEach(rank => {
        minorArcana.push(`${rank} of ${suit}`);
    });
});

const deck = majorArcana.concat(minorArcana);

// Function to draw cards
function drawCards() {
    const shuffled = [...deck].sort(() => 0.5 - Math.random());
    const positions = ['Current State', 'Focus for Growth', 'Potential in 7 Days'];
    return positions.map((pos, i) => ({ name: shuffled[i], position: pos }));
}

// Function to display cards
function displayCards(cards) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';
    cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.innerHTML = `<strong>${card.position}</strong><br>${card.name}`;
        container.appendChild(cardDiv);
    });
}

// Function to render basic markdown
function renderMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
        .replace(/^---$/gm, '<hr>')
        .replace(/^\*\*\*$/gm, '<hr>')
        .replace(/^- (.*)$/gm, '<li>$1</li>')
        .replace(/^\* (.*)$/gm, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

// Function to get reading from LLM
async function getReading(cards) {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert('Please enter your DeepSeek API Key');
        return;
    }
    localStorage.setItem('deepseek_api_key', apiKey);

    const prompt = `Provide a concise and insightful tarot reading for the following 7-day personal evolution spread: ${cards.map(c => `${c.position}: ${c.name}`).join(', ')}. Explain each card's meaning in its position, how they interact, and key priorities for growth over the next 7 days. Use markdown formatting for clarity, including headers (###, ####), bullet points (-), and separators (---). Avoid greetings, introductions, or unnecessary fluff.`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        throw new Error('API request failed: ' + response.status);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Load API key from localStorage on page load
window.addEventListener('load', () => {
    const savedKey = localStorage.getItem('deepseek_api_key');
    if (savedKey) {
        document.getElementById('apiKey').value = savedKey;
    }
});

// Event listener for button
document.getElementById('drawButton').addEventListener('click', async () => {
    try {
        const cards = drawCards();
        displayCards(cards);
        const readingContainer = document.getElementById('readingContainer');
        document.getElementById('spinner').style.display = 'block';
        const reading = await getReading(cards);
        document.getElementById('spinner').style.display = 'none';
        readingContainer.innerHTML = renderMarkdown(reading);
    } catch (error) {
        console.error(error);
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('readingContainer').textContent = 'Error getting reading: ' + error.message;
    }
});