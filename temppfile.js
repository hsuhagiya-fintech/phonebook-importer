class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetScreen = false;
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentInput = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentInput.includes('.')) return;
        if (this.currentInput === '0' && number !== '.') {
            this.currentInput = number;
        } else {
            this.currentInput += number;
        }
    }

    chooseOperation(op) {
        if (this.currentInput === '') return;
        
        if (this.previousInput !== '') {
            this.compute();
        }
        
        this.operation = op;
        this.previousInput = this.currentInput;
        this.shouldResetScreen = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        this.currentInput = computation.toString();
        this.operation = null;
        this.previousInput = '';
        this.shouldResetScreen = true;
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentInput.length === 1 || 
            (this.currentInput.length === 2 && this.currentInput.startsWith('-'))) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
    }

    specialFunction(func) {
        const current = parseFloat(this.currentInput);
        if (isNaN(current)) return;
        
        switch (func) {
            case 'sqrt':
                this.currentInput = Math.sqrt(current).toString();
                break;
            case 'square':
                this.currentInput = Math.pow(current, 2).toString();
                break;
            case 'sin':
                this.currentInput = Math.sin(current * Math.PI / 180).toString();
                break;
            case 'cos':
                this.currentInput = Math.cos(current * Math.PI / 180).toString();
                break;
            case 'tan':
                this.currentInput = Math.tan(current * Math.PI / 180).toString();
                break;
            case 'log':
                this.currentInput = Math.log10(current).toString();
                break;
            case 'ln':
                this.currentInput = Math.log(current).toString();
                break;
            case 'exp':
                this.currentInput = Math.exp(current).toString();
                break;
            case 'abs':
                this.currentInput = Math.abs(current).toString();
                break;
        }
        this.shouldResetScreen = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    getCurrentDisplay() {
        return this.getDisplayNumber(this.currentInput);
    }

    getOperationDisplay() {
        if (this.operation != null) {
            return `${this.getDisplayNumber(this.previousInput)} ${this.operation}`;
        }
        return '';
    }
}

function runExample() {
    const calc = new Calculator();
    try {
        calc.appendNumber('5');
        calc.appendNumber('3');
        calc.chooseOperation('+');
        calc.appendNumber('2');
        calc.compute();
        console.log(calc.getCurrentDisplay()); // Output: 55
    } catch (error) {
        console.error("An error occurred while performing calculations:", error);
    }
}

runExample();

runExample();
const calc = new Calculator();
calc.appendNumber('5');
calc.appendNumber('3');
calc.chooseOperation('+');
calc.appendNumber('2');
calc.compute();
console.log(calc.getCurrentDisplay()); // Output: 55