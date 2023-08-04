const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calculator-buttons button');
const clearButton = document.getElementById('clear');
const equalsButton = document.getElementById('equals');

// Agregar eventos de clic a los botones de la calculadora
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        display.value += value;
    });
});

// Función para borrar el contenido del display
clearButton.addEventListener('click', () => {
    display.value = '';
});

// Función para evaluar la expresión matemática y mostrar el resultado
equalsButton.addEventListener('click', () => {
    try {
        const result = evaluateExpression(display.value);
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
});

// Función para evaluar de forma segura la expresión matemática utilizando una función propia
function evaluateExpression(expression) {
    const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
    return Function(`'use strict'; return (${sanitizedExpression})`)();
}

// Capturar teclado
document.addEventListener('keydown', event => {
    const key = event.key;
    if (key === 'Enter') {
        event.preventDefault();
        try {
            const result = evaluateExpression(display.value);
            display.value = result;
        } catch (error) {
            display.value = 'Error';
        }
    } else if (key === 'Escape') {
        display.value = '';
    } else if (key === 'Backspace') {
        display.value = display.value.slice(0, -1);
    } else if (/[\d()+\-/*.]/.test(key)) {
        display.value += key;
    }
});