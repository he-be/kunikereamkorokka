interface ShufflerConfig {
    readonly initialText: string;
    readonly changeablePositions: readonly number[];
    readonly shuffleOperations: number;
}

class KaniKreamShuffler {
    private currentText: string;
    private history: string[] = [];
    private readonly config: ShufflerConfig;

    private readonly shuffleTextElement: HTMLElement;
    private readonly shuffleButton: HTMLButtonElement;
    private readonly historyDisplay: HTMLElement;

    constructor() {
        this.config = {
            initialText: 'カニクリームコロッケ',
            changeablePositions: [0, 2, 5, 6, 7, 9], // カ、ク、ム、コ、ロ、ケ
            shuffleOperations: 3
        };

        this.currentText = this.config.initialText;

        this.shuffleTextElement = this.getElementById('shuffleText');
        this.shuffleButton = this.getElementById('shuffleButton') as HTMLButtonElement;
        this.historyDisplay = this.getElementById('historyDisplay');

        this.initializeEventListeners();
    }

    private getElementById(id: string): HTMLElement {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }

    private initializeEventListeners(): void {
        this.shuffleButton.addEventListener('click', () => {
            this.performShuffle();
        });
    }

    private async performShuffle(): Promise<void> {
        this.shuffleButton.disabled = true;

        this.addToHistory(this.currentText);

        const newText = this.shuffleText(this.currentText);

        await this.animateTextChange(this.currentText, newText);

        this.currentText = newText;

        this.shuffleButton.disabled = false;
    }

    private shuffleText(text: string): string {
        const chars = Array.from(text);

        for (let i = 0; i < this.config.shuffleOperations; i++) {
            const shuffledPositions = [...this.config.changeablePositions];
            
            // Fisher-Yates shuffle algorithm
            for (let j = shuffledPositions.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [shuffledPositions[j], shuffledPositions[k]] = [shuffledPositions[k]!, shuffledPositions[j]!];
            }

            const pos1 = shuffledPositions[0]!;
            const pos2 = shuffledPositions[1]!;

            [chars[pos1], chars[pos2]] = [chars[pos2]!, chars[pos1]!];
        }

        return chars.join('');
    }

    private addToHistory(text: string): void {
        this.history.push(text);
        this.updateHistoryDisplay();
    }

    private updateHistoryDisplay(): void {
        this.historyDisplay.innerHTML = '';

        this.history.forEach(text => {
            const span = document.createElement('span');
            span.textContent = text;
            span.className = 'history-item';
            this.historyDisplay.appendChild(span);
        });
    }

    private async animateTextChange(oldText: string, newText: string): Promise<void> {
        const oldChars = Array.from(oldText);
        const newChars = Array.from(newText);

        const changedPositions = this.getChangedPositions(oldChars, newChars);

        if (changedPositions.length === 0) return;

        const spanElements = this.createCharSpans(oldChars, changedPositions);

        await this.executeAnimation(spanElements, changedPositions, newChars, newText);
    }

    private getChangedPositions(oldChars: string[], newChars: string[]): number[] {
        const changedPositions: number[] = [];
        for (let i = 0; i < oldChars.length; i++) {
            if (oldChars[i] !== newChars[i]) {
                changedPositions.push(i);
            }
        }
        return changedPositions;
    }

    private createCharSpans(chars: string[], changedPositions: number[]): HTMLSpanElement[] {
        this.shuffleTextElement.innerHTML = '';
        const spanElements: HTMLSpanElement[] = [];

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

    private async executeAnimation(
        spanElements: HTMLSpanElement[],
        changedPositions: number[],
        newChars: string[],
        newText: string
    ): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                changedPositions.forEach(pos => {
                    const span = spanElements[pos]!;
                    span.style.transform = 'translateY(-20px)';
                    span.style.opacity = '0.3';
                });

                setTimeout(() => {
                    changedPositions.forEach(pos => {
                        const span = spanElements[pos]!;
                        span.textContent = newChars[pos]!;
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

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new KaniKreamShuffler();
});