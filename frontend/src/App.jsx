import React from 'react';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Калькулятор текстовых чисел</h1>
        <p>Преобразуйте текст в числа и выполняйте математические операции</p>
      </header>
      <Calculator />
    </div>
  );
}

export default App;