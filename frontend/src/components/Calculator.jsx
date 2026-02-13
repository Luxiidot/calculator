import React, { useState } from 'react';
import axios from 'axios';
import './Calculator.css';

const API_URL = 'http://localhost:5000/api';

const Calculator = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [operation, setOperation] = useState('add');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [conversionResult1, setConversionResult1] = useState(null);
    const [conversionResult2, setConversionResult2] = useState(null);

    const operations = [
        { value: 'add', label: 'Сложение (+)' },
        { value: 'subtract', label: 'Вычитание (-)' },
        { value: 'multiply', label: 'Умножение (×)' },
        { value: 'divide', label: 'Деление (÷)' }
    ];

    const handleConvert = async (text, setConversionResult) => {
        if (!text.trim()) {
            setConversionResult(null);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/convert`, { text });
            setConversionResult(response.data.result);
            setError(null);
        } catch (err) {
            setConversionResult(null);
            setError(err.response?.data?.error || 'Ошибка при конвертации');
        }
    };

    const handleConvertAndCalculate = async () => {
        if (!text1.trim() || !text2.trim()) {
            setError('Пожалуйста, заполните оба поля');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(`${API_URL}/convert-and-calculate`, {
                text1,
                text2,
                operation
            });
            
            setResult(response.data.result);
            setConversionResult1(response.data.num1);
            setConversionResult2(response.data.num2);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при вычислении');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setText1('');
        setText2('');
        setOperation('add');
        setResult(null);
        setError(null);
        setConversionResult1(null);
        setConversionResult2(null);
    };

    return (
        <div className="calculator">
            <div className="calculator-container">
                <h2>Введите числа в текстовом формате</h2>
                
                <div className="input-group">
                    <label>Первое число:</label>
                    <textarea
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        onBlur={() => handleConvert(text1, setConversionResult1)}
                        placeholder="например: сто двадцать пять"
                        rows="2"
                    />
                    {conversionResult1 !== null && (
                        <div className="conversion-result">
                            Числовой формат: <strong>{conversionResult1}</strong>
                        </div>
                    )}
                </div>

                <div className="input-group">
                    <label>Второе число:</label>
                    <textarea
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        onBlur={() => handleConvert(text2, setConversionResult2)}
                        placeholder="например: тридцать четыре"
                        rows="2"
                    />
                    {conversionResult2 !== null && (
                        <div className="conversion-result">
                            Числовой формат: <strong>{conversionResult2}</strong>
                        </div>
                    )}
                </div>

                <div className="operation-group">
                    <label>Выберите операцию:</label>
                    <select 
                        value={operation} 
                        onChange={(e) => setOperation(e.target.value)}
                    >
                        {operations.map(op => (
                            <option key={op.value} value={op.value}>
                                {op.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="button-group">
                    <button 
                        onClick={handleConvertAndCalculate}
                        disabled={loading}
                        className="calculate-btn"
                    >
                        {loading ? 'Вычисление...' : 'Вычислить'}
                    </button>
                    <button 
                        onClick={clearAll}
                        className="clear-btn"
                    >
                        Очистить
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <strong>Ошибка:</strong> {error}
                    </div>
                )}

                {result !== null && (
                    <div className="result-container">
                        <h3>Результат:</h3>
                        <div className="result">
                            {result}
                        </div>
                        <div className="calculation-details">
                            <p>Выполнено преобразование:</p>
                            <p>"{text1}" → {conversionResult1}</p>
                            <p>"{text2}" → {conversionResult2}</p>
                            <p>Операция: {operations.find(op => op.value === operation)?.label}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="examples-section">
                <h3>Примеры текстовых чисел:</h3>
                <div className="examples-grid">
                    <div className="example-card">
                        <h4>Простые числа</h4>
                        <p>один → 1</p>
                        <p>пять → 5</p>
                        <p>десять → 10</p>
                    </div>
                    <div className="example-card">
                        <h4>Десятки</h4>
                        <p>двадцать → 20</p>
                        <p>пятьдесят → 50</p>
                        <p>девяносто → 90</p>
                    </div>
                    <div className="example-card">
                        <h4>Сотни</h4>
                        <p>сто → 100</p>
                        <p>двести → 200</p>
                        <p>триста → 300</p>
                    </div>
                    <div className="example-card">
                        <h4>Составные числа</h4>
                        <p>сто двадцать пять → 125</p>
                        <p>триста сорок два → 342</p>
                        <p>девятьсот девяносто девять → 999</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator