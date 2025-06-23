const HTML_CONTENT = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カニクリームコロッケ シャッフル</title>
    <style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

.background-history {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    color: #e0e0e0;
    font-size: 14px;
    line-height: 1.8;
    word-wrap: break-word;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 1ch;
    overflow: hidden;
}

.history-item {
    white-space: nowrap;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.container {
    position: relative;
    z-index: 2;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-content {
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.shuffle-text {
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
    letter-spacing: 0.1em;
    line-height: 1.2;
}

.shuffle-button {
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.shuffle-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.shuffle-button:active {
    transform: translateY(0);
}

.shuffle-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

@media (max-width: 768px) {
    .main-content {
        padding: 30px 20px;
        margin: 20px;
    }
    
    .shuffle-text {
        font-size: 2rem;
        margin-bottom: 20px;
    }
    
    .shuffle-button {
        padding: 12px 30px;
        font-size: 1rem;
    }
    
    .background-history {
        padding: 10px;
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .shuffle-text {
        font-size: 1.5rem;
    }
    
    .main-content {
        padding: 20px 15px;
    }
}
    </style>
</head>
<body>
    <div class="background-history" id="historyDisplay"></div>
    
    <div class="container">
        <main class="main-content">
            <div class="shuffle-text" id="shuffleText">カニクリームコロッケ</div>
            <button class="shuffle-button" id="shuffleButton">シャッフル</button>
        </main>
    </div>

    <script type="module">
class KaniKreamShuffler {
    constructor() {
        this.config = {
            initialText: 'カニクリームコロッケ',
            changeablePositions: [0, 2, 5, 6, 7, 9],
            shuffleOperations: 3
        };

        this.currentText = this.config.initialText;
        this.history = [];

        this.shuffleTextElement = document.getElementById('shuffleText');
        this.shuffleButton = document.getElementById('shuffleButton');
        this.historyDisplay = document.getElementById('historyDisplay');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.shuffleButton.addEventListener('click', () => {
            this.performShuffle();
        });
    }

    async performShuffle() {
        this.shuffleButton.disabled = true;

        this.addToHistory(this.currentText);

        const newText = this.shuffleText(this.currentText);

        await this.animateTextChange(this.currentText, newText);

        this.currentText = newText;

        this.shuffleButton.disabled = false;
    }

    shuffleText(text) {
        const chars = Array.from(text);

        for (let i = 0; i < this.config.shuffleOperations; i++) {
            const shuffledPositions = [...this.config.changeablePositions];
            
            for (let j = shuffledPositions.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [shuffledPositions[j], shuffledPositions[k]] = [shuffledPositions[k], shuffledPositions[j]];
            }

            const pos1 = shuffledPositions[0];
            const pos2 = shuffledPositions[1];

            [chars[pos1], chars[pos2]] = [chars[pos2], chars[pos1]];
        }

        return chars.join('');
    }

    addToHistory(text) {
        this.history.push(text);
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyDisplay.innerHTML = '';

        this.history.forEach(text => {
            const span = document.createElement('span');
            span.textContent = text;
            span.className = 'history-item';
            this.historyDisplay.appendChild(span);
        });
    }

    async animateTextChange(oldText, newText) {
        const oldChars = Array.from(oldText);
        const newChars = Array.from(newText);

        const changedPositions = this.getChangedPositions(oldChars, newChars);

        if (changedPositions.length === 0) return;

        const spanElements = this.createCharSpans(oldChars, changedPositions);

        await this.executeAnimation(spanElements, changedPositions, newChars, newText);
    }

    getChangedPositions(oldChars, newChars) {
        const changedPositions = [];
        for (let i = 0; i < oldChars.length; i++) {
            if (oldChars[i] !== newChars[i]) {
                changedPositions.push(i);
            }
        }
        return changedPositions;
    }

    createCharSpans(chars, changedPositions) {
        this.shuffleTextElement.innerHTML = '';
        const spanElements = [];

        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.position = 'relative';
            span.style.display = 'inline-block';
            span.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';

            if (changedPositions.includes(index)) {
                span.classList.add('changing');
            }

            spanElements.push(span);
            this.shuffleTextElement.appendChild(span);
        });

        return spanElements;
    }

    async executeAnimation(spanElements, changedPositions, newChars, newText) {
        return new Promise(resolve => {
            setTimeout(() => {
                changedPositions.forEach(pos => {
                    const span = spanElements[pos];
                    span.style.transform = 'translateY(-20px)';
                    span.style.opacity = '0.3';
                });

                setTimeout(() => {
                    changedPositions.forEach(pos => {
                        const span = spanElements[pos];
                        span.textContent = newChars[pos];
                        span.style.transform = 'translateY(0)';
                        span.style.opacity = '1';
                    });

                    setTimeout(() => {
                        this.shuffleTextElement.textContent = newText;
                        resolve();
                    }, 500);
                }, 250);
            }, 50);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KaniKreamShuffler();
});
    </script>
</body>
</html>`;

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/') {
      return new Response(HTML_CONTENT, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'OK',
        edge: 'Cloudflare Workers'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  },
};
