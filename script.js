class KaniKreamShuffler {
    constructor() {
        this.currentText = 'カニクリームコロッケ';
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

    performShuffle() {
        // 現在の文字列を履歴に追加
        this.addToHistory(this.currentText);
        
        // シャッフルを実行
        this.currentText = this.shuffleText(this.currentText);
        
        // 表示を更新
        this.updateDisplay();
    }

    shuffleText(text) {
        // 「カニクリームコロッケ」の変更可能な文字の位置
        // 0:カ, 2:ク, 5:ム, 6:コ, 7:ロ, 8:ケ
        const changeablePositions = [0, 2, 5, 6, 7, 8];
        const chars = Array.from(text);
        
        // 3回の入れ替え操作を実行
        for (let i = 0; i < 3; i++) {
            // ランダムに2つの位置を選択
            const shuffledPositions = [...changeablePositions];
            for (let j = shuffledPositions.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [shuffledPositions[j], shuffledPositions[k]] = [shuffledPositions[k], shuffledPositions[j]];
            }
            
            const pos1 = shuffledPositions[0];
            const pos2 = shuffledPositions[1];
            
            // 文字を入れ替え
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

    updateDisplay() {
        this.shuffleTextElement.textContent = this.currentText;
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new KaniKreamShuffler();
});