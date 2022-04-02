// global variables

const operator = {
  nop: 0,
  sum: 1,
  sub: 2,
  mul: 3,
  div: 4 
}

const MAX_OPERAND_LEN = 8;

// calculator class

class Calculator {
  constructor() {
    this.operandLeft = '';
    this.operandRight = '';
    this.result = '';
    this.operation = operator.nop;
  }
  operate() {
    if(operator.sum === this.operation) {
      setCurrentOperation(+this.operandLeft + +this.operandRight);
    } else if(operator.sub === this.operation) {
      setCurrentOperation(+this.operandLeft - +this.operandRight);
    } else if(operator.mul === this.operation) {
      setCurrentOperation(+this.operandLeft * +this.operandRight);
    } else if(operator.div === this.operation) {
      if(this.operandRight === '0') {
        setCurrentOperation('Division by zero is undefined', 18);  
      } else {
        setCurrentOperation(+this.operandLeft / +this.operandRight);
      }
    } 
  }
  checkDot() {
    return ((this.operation === operator.nop) ? this.operandLeft.includes('.') 
                                              : this.operandRight.includes('.'));
  }
  cleanUp() {
    this.operandLeft = '';
    this.operandRight = '';
    this.operation = operator.nop;
    setCurrentOperation();
    setLastOperation();
  }
  appendOperand(text) {
    if(text === '.') {
      if(this.checkDot()) {
        return;
      }
    }
    if(this.operation === operator.nop) {
      if(this.operandLeft.length + 1 >= MAX_OPERAND_LEN)
        return;
      this.operandLeft += text;
      setCurrentOperation(this.operandLeft);
    } else {
      if(this.operandRight.length + 1 >= MAX_OPERAND_LEN)
        return;
      this.operandRight += text;
      setCurrentOperation(this.operandRight);
    }
  }
  setOperation(text) {
    if(this.operandRight === '') {
      if(text === '+') this.operation = operator.sum;
      else if(text === '-') this.operation = operator.sub;
      else if(text === '×') this.operation = operator.mul;
      else if(text === '÷') this.operation = operator.div;
      setLastOperation(`${this.operandLeft} ${text}`);
    } else {
      if(text === '=') {
        setLastOperation(`${lastOperationOnScreen.textContent} ${this.operandRight} =`);
        this.operate();
      }
    }
  }
}

let calculator = null;

// DOM objects

const numBtn = document.querySelectorAll('[data-numbtn]');
const oprBtn = document.querySelectorAll('[data-oprbtn]');
const clearBtn = document.querySelector('.clear-btn');
const currentOperationOnScreen = document.querySelector('.current');
const lastOperationOnScreen = document.querySelector('.history');

// events 

window.addEventListener('load', () => {
  initialize();
});

numBtn.forEach((btn) => btn.addEventListener('click', () => {
    calculator.appendOperand(btn.textContent);
  })
);

oprBtn.forEach((btn) => 
  btn.addEventListener('click', () => {
    calculator.setOperation(btn.textContent);
  })
);

clearBtn.addEventListener('click', () => calculator.cleanUp());

// internal functions

function initialize() {
  calculator = new Calculator();
}

function setCurrentOperation(text = '', len = -1) {
  currentOperationOnScreen.textContent = text;
  currentOperationOnScreen.style.fontSize = (len == -1) ? '42px' : `${len}px`;
}

function setLastOperation(text = '', len = -1) {
  lastOperationOnScreen.textContent = text;
  lastOperationOnScreen.style.fontSize = (len == -1) ? '24px' : `${len}px`;
}
