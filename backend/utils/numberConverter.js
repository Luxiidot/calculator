class NumberConversionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NumberConversionError';
    }
}

const wordsToNumbers = {
    'ноль': 0, 'один': 1, 'два': 2, 'три': 3, 'четыре': 4,
    'пять': 5, 'шесть': 6, 'семь': 7, 'восемь': 8, 'девять': 9,
    'десять': 10, 'одиннадцать': 11, 'двенадцать': 12, 'тринадцать': 13,
    'четырнадцать': 14, 'пятнадцать': 15, 'шестнадцать': 16, 'семнадцать': 17,
    'восемнадцать': 18, 'девятнадцать': 19, 'двадцать': 20, 'тридцать': 30,
    'сорок': 40, 'пятьдесят': 50, 'шестьдесят': 60, 'семьдесят': 70,
    'восемьдесят': 80, 'девяносто': 90, 'сто': 100, 'двести': 200,
    'триста': 300, 'четыреста': 400, 'пятьсот': 500, 'шестьсот': 600,
    'семьсот': 700, 'восемьсот': 800, 'девятьсот': 900,
    'тысяча': 1000, 'тысячи': 1000, 'тысяч': 1000,
    'миллион': 1000000, 'миллиона': 1000000, 'миллионов': 1000000
};

const DIGIT_LEVELS = [
    { level: 'million', value: 1000000, min: 1000000 },
    { level: 'thousand', value: 1000, min: 1000 },
    { level: 'hundred', value: 100, min: 100 },
    { level: 'tens', value: 10, min: 10 },
    { level: 'units', value: 1, min: 1 }
];

function convertTextToNumber(text) {
    try {
        if (!text || text.trim() === '') {
            throw new NumberConversionError('Введите текст для конвертации');
        }

        const cleanText = text.toLowerCase().trim();
        
        if (!isNaN(cleanText) && cleanText !== '') {
            return Number(cleanText);
        }

        const words = cleanText.split(/\s+/);
        
        const validWordRegex = /^[а-яё\s-]+$/;
        if (!validWordRegex.test(cleanText)) {
            throw new NumberConversionError('Текст содержит недопустимые символы');
        }

        for (const word of words) {
            if (!wordsToNumbers.hasOwnProperty(word)) {
                throw new NumberConversionError(`Не удалось распознать слово: "${word}"`);
            }
        }

        return parseNumberWords(words);
        
    } catch (error) {
        if (error instanceof NumberConversionError) {
            throw error;
        }
        throw new NumberConversionError('Ошибка при конвертации числа');
    }
}

function parseNumberWords(words) {
    let result = 0;
    let currentSegment = 0;
    let lastLevel = Infinity;
    let lastValue = Infinity;
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const value = wordsToNumbers[word];
        const currentLevel = getNumberLevel(value);
        
        if (i > 0) {
            const prevWord = words[i - 1];
            const prevValue = wordsToNumbers[prevWord];
            const prevLevel = getNumberLevel(prevValue);
            
            if (prevLevel === 'million' && currentLevel !== 'thousand' && currentLevel !== 'hundred' && 
                currentLevel !== 'tens' && currentLevel !== 'units') {
                throw new NumberConversionError(`Некорректная структура числа: "${prevWord} ${word}"`);
            }
            
            if (prevLevel === 'thousand' && currentLevel !== 'hundred' && 
                currentLevel !== 'tens' && currentLevel !== 'units') {
                throw new NumberConversionError(`Некорректная структура числа: "${prevWord} ${word}"`);
            }
            
            if (prevLevel === 'hundred' && currentLevel !== 'tens' && currentLevel !== 'units') {
                throw new NumberConversionError(`Некорректная структура числа: "${prevWord} ${word}"`);
            }
            
            if (prevLevel === 'tens' && currentLevel !== 'units') {
                throw new NumberConversionError(`Некорректная структура числа: после "${prevWord}" должны быть единицы`);
            }
            
            if (prevLevel === 'units' && currentLevel !== 'thousand' && currentLevel !== 'million') {
                throw new NumberConversionError(`Некорректная структура числа: после "${prevWord}" не может идти "${word}"`);
            }
            
            if (prevLevel === currentLevel && currentLevel !== 'thousand' && currentLevel !== 'million') {
                throw new NumberConversionError(`Повторяющиеся разряды: "${prevWord}" и "${word}"`);
            }
        }
        
        if (value >= 1000) {
            if (currentSegment === 0) {
                currentSegment = 1;
            }
            result += currentSegment * value;
            currentSegment = 0;
        }
        else if (value >= 100) {
            if (currentSegment === 0) {
                currentSegment = value;
            } else {
                currentSegment += value;
            }
        }
        else {
            if (currentSegment === 0) {
                currentSegment = value;
            } else {
                const segmentLevel = getNumberLevel(currentSegment);
                if (segmentLevel === currentLevel) {
                    throw new NumberConversionError(`Некорректная комбинация: ${prevWord} и ${word} не могут быть вместе`);
                }
                currentSegment += value;
            }
        }
        
        lastLevel = currentLevel;
        lastValue = value;
    }
    
    result += currentSegment;
    
    if (result === 0) {
        throw new NumberConversionError('Не удалось преобразовать текст в число');
    }
    
    return result;
}

function getNumberLevel(value) {
    if (value >= 1000000) return 'million';
    if (value >= 1000) return 'thousand';
    if (value >= 100) return 'hundred';
    if (value >= 10) return 'tens';
    return 'units';
}

function calculate(num1, num2, operation) {
    try {
        const number1 = typeof num1 === 'string' ? convertTextToNumber(num1) : Number(num1);
        const number2 = typeof num2 === 'string' ? convertTextToNumber(num2) : Number(num2);
        
        if (isNaN(number1) || isNaN(number2)) {
            throw new Error('Одно из чисел невалидно');
        }

        let result;
        switch (operation) {
            case 'add':
                result = number1 + number2;
                break;
            case 'subtract':
                result = number1 - number2;
                break;
            case 'multiply':
                result = number1 * number2;
                break;
            case 'divide':
                if (number2 === 0) {
                    throw new Error('Деление на ноль невозможно');
                }
                result = number1 / number2;
                break;
            default:
                throw new Error('Неподдерживаемая операция');
        }

        return Number(result.toFixed(2));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    convertTextToNumber,
    calculate
};