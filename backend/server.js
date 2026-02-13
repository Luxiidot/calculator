const express = require('express');
const cors = require('cors');
const { convertTextToNumber, calculate } = require('./utils/numberConverter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

app.post('/api/convert', (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Введите текст для конвертации' });
        }

        const result = convertTextToNumber(text);
        res.json({ 
            success: true, 
            original: text, 
            result: result 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message || 'Ошибка при конвертации числа' 
        });
    }
});

app.post('/api/calculate', (req, res) => {
    try {
        const { num1, num2, operation } = req.body;

        if (!num1 || !num2 || !operation) {
            return res.status(400).json({ 
                error: 'Необходимо указать два числа и операцию' 
            });
        }

        const result = calculate(num1, num2, operation);
        res.json({ 
            success: true, 
            result: result 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message || 'Ошибка при выполнении операции' 
        });
    }
});

app.post('/api/convert-and-calculate', (req, res) => {
    try {
        const { text1, text2, operation } = req.body;

        if (!text1 || !text2 || !operation) {
            return res.status(400).json({ 
                error: 'Необходимо указать два текстовых числа и операцию' 
            });
        }

        const num1 = convertTextToNumber(text1);
        const num2 = convertTextToNumber(text2);
        
        const result = calculate(num1, num2, operation);
        
        res.json({ 
            success: true, 
            num1: num1,
            num2: num2,
            operation: operation,
            result: result 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message || 'Ошибка при обработке запроса' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});