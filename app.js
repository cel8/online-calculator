// global variables

const operator = {
  nop: 0,
  sum: 1,
  sub: 2,
  mul: 3,
  div: 4 
}

// DOM objects

const numBtn = document.querySelectorAll('[data-numbtn]');
const oprBtn = document.querySelectorAll('[data-oprbtn]');
const clearBtn = document.querySelector('.clear-btn');
const deleteBtn = document.querySelector('.delete-btn');
const signBtn = document.querySelector('.sign-btn');
const currentOperationOnScreen = document.querySelector('.current');
const lastOperationOnScreen = document.querySelector('.history');

// Font size variables 

const MAX_OPERAND_LEN = 25;
const MIN_OPERAND_LEN = 17

const currentOperationDefaultFontSize = 42;
const lastOperationDefaultFontSize = 24;
let currentOperationFontSize = currentOperationDefaultFontSize;
let lastOperationFontSize = lastOperationDefaultFontSize;

// Calculator 

let calculator = null;

// calculator class

class Calculator {
  constructor() {
    this.operandLeft = '';
    this.operandRight = '';
    this.reset = false;
    this.operation = operator.nop;
  }
  operate() {
    let exit = true;
    let result = '';
    if(operator.sum === this.operation) {
      result = +this.operandLeft + +this.operandRight;
    } else if(operator.sub === this.operation) {
      result = +this.operandLeft - +this.operandRight;
    } else if(operator.mul === this.operation) {
      if(+this.operandLeft * +this.operandRight > Number.MAX_VALUE) {
        result = 'Overflow';
        exit = false;
      } else {
        result = +this.operandLeft * +this.operandRight;
      }
    } else if(operator.div === this.operation) {
      if(this.operandRight === '0') {
        result = 'Division by zero is undefined';
        exit = false;
      } else if(+this.operandLeft / +this.operandRight < Number.MIN_VALUE) {
        result = 'Underflow';
        exit = false;
      } else {
        result = +this.operandLeft / +this.operandRight;
      }
    }
    if(true === exit) {
      let rounded = Math.floor(+result * 100) / 100;
      result = rounded.toString();
      this.chainOperation(result)
    } else {
      this.cleanOperation();
    }
    setCurrentOperation(result);
  }
  checkDot() {
    return ((this.operation === operator.nop) ? this.operandLeft.includes('.') 
                                              : this.operandRight.includes('.'));
  }
  cleanOperation() {
    this.operandLeft = '';
    this.operandRight = '';
    this.operation = operator.nop;
  }
  chainOperation(result) {
    this.operandLeft = result;
    this.operandRight = '';
    this.operation = operator.nop;
  }
  cleanUp() {
    this.cleanOperation();
    setCurrentOperation();
    setLastOperation();
  }
  trimOperand() {
    let text = this.getOperand();
    let trimText = (((+text < 0) && (text.length == 2))) ? 0 : +text.slice(0, -1);
    this.setOperand(trimText.toString());
    setCurrentOperation(+trimText);
  }
  changeSign() {
    let text = this.getOperand();
    if(text.length > 0) {
      text = +text * -1;
    }
    this.setOperand(text.toString());
    setCurrentOperation(text);
  }
  appendOperand(text) {
    if(text === '.') {
      if(this.checkDot()) {
        return;
      }
    }
    if(true === this.reset) {
      this.cleanOperation();
      this.reset = false;
    }
    if(this.operation === operator.nop) {
      if(this.operandLeft.length + 1 >= MAX_OPERAND_LEN)
        return;
      if(this.operandLeft === '0') {
        if(text !== '.') this.operandLeft = '';
      }
      if((text === '.') && (this.operandLeft === '')) {
        this.operandLeft = '0';
      } 
      this.operandLeft += text;
      setCurrentOperation(this.operandLeft);
    } else {
      if(this.operandRight.length + 1 >= MAX_OPERAND_LEN)
        return;
      if(this.operandRight === '0') {
        if(text !== '.') this.operandRight = '';
      }
      if((text === '.') && (this.operandRight === '')) {
        this.operandRight = '0';
      } 
      this.operandRight += text;
      setCurrentOperation(this.operandRight);
    }
  }
  getOperand() {
    return (this.operation === operator.nop ? this.operandLeft : this.operandRight);
  }
  setOperand(text) {
    if(this.operation === operator.nop) {
      this.operandLeft = text;
    } else {
      this.operandRight = text;
    }
  }
  setOperation(text) {
    if(this.operandRight === '') {
      if((text !== '=') && (this.operandLeft !== '')) {
        this.reset = false;
        this.operation = getOperator(text);
        setLastOperation(`${this.operandLeft} ${text}`);
      }
    } else {
      if(text === '=') {
        setLastOperation(`${lastOperationOnScreen.textContent} ${this.operandRight} =`);
        this.operate();
        this.reset = true;
      } else {
        this.reset = false;
        this.operate();
        setLastOperation(`${this.operandLeft} ${text}`);
        this.operation = getOperator(text);
      }
    }
  }
}

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
deleteBtn.addEventListener('click', () => calculator.trimOperand());
signBtn.addEventListener('click', () => calculator.changeSign());
window.addEventListener('keydown', handleKeyboard);

// internal functions

function initialize() {
  calculator = new Calculator();
}

function convertOperator(text) {
  let exit = '=';
  if(text === '+') exit = '+';
  else if(text === '-') exit = '-';
  else if(text === '*') exit = '×';
  else if(text === '/') exit = '÷';
  return exit;
}

function getOperator(text) {
  let exit = operator.nop;
  if(text === '+') exit = operator.sum;
  else if(text === '-') exit = operator.sub;
  else if(text === '×') exit = operator.mul;
  else if(text === '÷') exit = operator.div;
  return exit;
}

function handleKeyboard(event) {
  if((event.key >= 0 && event.key <= 9) || (event.key === '.')) calculator.appendOperand(event.key);
  else if((event.key === '+') || (event.key === '/') || (event.key === '-') ||
          (event.key === 'Enter') || (event.key === '=') || (event.key === '*')) {
            calculator.setOperation(convertOperator(event.key));
          }
  else if(event.key === 'Backspace') calculator.trimOperand();
  else if((event.key === 'Delete') || (event.key === 'Escape')) calculator.cleanUp();
}

function setCurrentOperation(text = '', unit = 'px') {
  const deltaFixedFontSize = 6;
  const minFontSize = 6;
  const parentWidth = currentOperationOnScreen.parentElement.offsetWidth;
  let len = -1;
  // Set text
  currentOperationOnScreen.textContent = text;
  // Resize len to fit container
  if(text.length <= MIN_OPERAND_LEN) {
    currentOperationFontSize = currentOperationDefaultFontSize;
  } else {
    len = currentOperationFontSize = currentOperationDefaultFontSize;
    currentOperationOnScreen.style.fontSize = `${len}${unit}`;
    while(currentOperationOnScreen.parentElement.offsetWidth > parentWidth) {
      currentOperationFontSize = currentOperationFontSize - deltaFixedFontSize;
      len = currentOperationFontSize;
      if(len < minFontSize) {
        len = minFontSize;
        currentOperationFontSize = minFontSize;
        break;
      }
      currentOperationOnScreen.style.fontSize = `${len}${unit}`;
    }
  }
  currentOperationOnScreen.style.fontSize = (len == -1) ? `${currentOperationDefaultFontSize}${unit}` : `${len}${unit}`;
}

function setLastOperation(text = '', unit = 'px') {
  const deltaFixedFontSize = 2;
  const minFontSize = 3;
  const parentWidth = lastOperationOnScreen.parentElement.offsetWidth;
  let len = -1;
  // Set text
  lastOperationOnScreen.textContent = text;
  len = lastOperationFontSize = lastOperationDefaultFontSize;
  lastOperationOnScreen.style.fontSize = `${len}${unit}`;
  while(lastOperationOnScreen.parentElement.offsetWidth > parentWidth) {
    lastOperationFontSize = lastOperationFontSize - deltaFixedFontSize;
    len = lastOperationFontSize;
    if(len < minFontSize) {
      len = minFontSize;
      lastOperationFontSize = minFontSize;
      break;
    }
    lastOperationOnScreen.style.fontSize = `${len}${unit}`;
  }
  lastOperationOnScreen.style.fontSize = (len == -1) ? `${lastOperationDefaultFontSize}${unit}` : `${len}${unit}`;
}
