const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LLM Tarot Reader</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>7-Day Evolution Tarot Reading</h1>
        <p>This 3-card spread provides guidance on your personal evolution over the next 7 days. It reveals your current state, what to focus on for growth, and the potential outcomes.</p>
        <button id="drawButton">Draw Cards</button>
        <div id="cardsContainer" class="cards"></div>
        <div id="readingContainer" class="reading"><div id="spinner" style="display:none;"><div class="spinner"></div> Generating reading...</div></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;

const CSS = `body {
    font-family: Arial, sans-serif;
    background-color: #2c3e50;
    color: #ecf0f1;
    text-align: center;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

h1 {
    margin-bottom: 30px;
}

#drawButton {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 30px;
}

#drawButton:hover {
    background-color: #2980b9;
}

.cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 30px;
}

.card {
    width: 150px;
    height: 250px;
    background-color: #34495e;
    border: 2px solid #ecf0f1;
    border-radius: 10px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    padding: 10px;
}

.reading {
    background-color: #34495e;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    text-align: left;
}
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 2s linear infinite;
    display: inline-block;
    margin-right: 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.reading strong { font-weight: bold; color: #ecf0f1; }
.reading em { font-style: italic; color: #bdc3c7; }
.reading br { display: block; margin: 5px 0; }
.reading h3 { font-size: 1.2em; margin: 10px 0 5px 0; color: #ecf0f1; }
.reading li { margin-left: 20px; color: #bdc3c7; }
.reading li::before { content: "• "; color: #ecf0f1; }
.reading h4 { font-size: 1.1em; margin: 8px 0 4px 0; color: #ecf0f1; font-weight: bold; }
.reading hr { border: 0; height: 1px; background: #34495e; margin: 15px 0; }
.reading h1 { font-size: 1.5em; margin: 15px 0 10px 0; color: #ecf0f1; font-weight: bold; }
.reading h2 { font-size: 1.3em; margin: 12px 0 8px 0; color: #ecf0f1; font-weight: bold; }
.reading h3 { font-size: 1.2em; margin: 10px 0 5px 0; color: #ecf0f1; }
.reading h4 { font-size: 1.1em; margin: 8px 0 4px 0; color: #ecf0f1; font-weight: bold; }`;

const JS = `// Tarot deck
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
        minorArcana.push(\`\${rank} of \${suit}\`);
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
        cardDiv.innerHTML = \`<strong>\${card.position}</strong><br>\${card.name}\`;
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

// Function to get reading from LLM via proxy
async function getReading(cards) {
    const prompt = \`Provide a concise and insightful tarot reading for the following 7-day personal evolution spread: \${cards.map(c => \`\${c.position}: \${c.name}\`).join(', ')}. Explain each card's meaning in its position, how they interact, and key priorities for growth over the next 7 days. Use markdown formatting for clarity, including headers (###, ####), bullet points (-), and separators (---). Avoid greetings, introductions, or unnecessary fluff.\`;

    const response = await fetch('/api/tarot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
});`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/' || pathname === '/index.html') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (pathname === '/style.css') {
      return new Response(CSS, {
        headers: { 'Content-Type': 'text/css' }
      });
    }

    if (pathname === '/script.js') {
      return new Response(JS, {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }

    if (pathname === '/api/tarot') {
      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          }
        });
      }

      // Only allow POST
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { 
          status: 405,
          headers: { 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
        
        if (!DEEPSEEK_API_KEY) {
          return new Response(JSON.stringify({ error: 'API key not configured' }), {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        const requestData = await request.json();

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${DEEPSEEK_API_KEY}\`
          },
          body: JSON.stringify(requestData)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
