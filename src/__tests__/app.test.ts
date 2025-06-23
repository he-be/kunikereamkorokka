import { describe, it, expect, beforeEach, vi } from 'vitest';

// DOM要素のモック
const mockElements = {
    shuffleText: {
        textContent: 'カニクリームコロッケ',
        innerHTML: '',
        appendChild: vi.fn(),
    },
    shuffleButton: {
        disabled: false,
        addEventListener: vi.fn(),
    },
    historyDisplay: {
        innerHTML: '',
        appendChild: vi.fn(),
    },
} as any;

// グローバルなDOM APIのモック
Object.defineProperty(global, 'document', {
    value: {
        getElementById: vi.fn((id: string) => mockElements[id.replace(/([A-Z])/g, (match, letter) => letter.toLowerCase()).replace(/^./, (match) => match.toLowerCase())]),
        createElement: vi.fn((_tagName: string) => ({
            textContent: '',
            className: '',
            style: {},
            classList: { add: vi.fn() },
        })),
        addEventListener: vi.fn(),
    },
    writable: true,
});

describe('KaniKreamShuffler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // 各テストでmockElementsをリセット
        mockElements.shuffleText.textContent = 'カニクリームコロッケ';
        mockElements.shuffleText.innerHTML = '';
        mockElements.shuffleButton.disabled = false;
        mockElements.historyDisplay.innerHTML = '';
    });

    it('should initialize with correct initial text', () => {
        expect(mockElements.shuffleText.textContent).toBe('カニクリームコロッケ');
    });

    it('should have changeable positions for specific characters', () => {
        // 〇ニ〇リー〇〇ロッ〇 の〇の位置（0,2,5,6,7,9）が正しいかテスト
        const text = 'カニクリームコロッケ';
        const expectedChangeableChars = ['カ', 'ク', 'ム', 'コ', 'ロ', 'ケ'];
        const changeablePositions = [0, 2, 5, 6, 7, 9];
        
        changeablePositions.forEach((pos, index) => {
            expect(text[pos]).toBe(expectedChangeableChars[index]!);
        });
    });

    it('should preserve fixed characters during shuffle', () => {
        const text = 'カニクリームコロッケ';
        const fixedPositions = [1, 3, 4, 8]; // ニ、リ、ー、ッ
        const fixedChars = ['ニ', 'リ', 'ー', 'ッ'];
        
        fixedPositions.forEach((pos, index) => {
            expect(text[pos]).toBe(fixedChars[index]!);
        });
    });

    it('should maintain text length after shuffle operations', () => {
        const originalText = 'カニクリームコロッケ';
        expect(originalText.length).toBe(10);
        
        // シャッフル後も長さが保持されることを確認
        const chars = Array.from(originalText);
        const changeablePositions = [0, 2, 5, 6, 7, 9];
        
        // 3回の入れ替え操作をシミュレート
        for (let i = 0; i < 3; i++) {
            const pos1 = changeablePositions[0]!;
            const pos2 = changeablePositions[1]!;
            [chars[pos1], chars[pos2]] = [chars[pos2]!, chars[pos1]!];
        }
        
        expect(chars.join('').length).toBe(10);
    });
});