import * as calculatorCSS from "./calculator.scss";

let calculatorWindowContent = document.createRange().createContextualFragment(`
<div class="input-container">
    <input type="text" id="calculator-input" class="calc-input">
    <div class="history-checkbox-input">
        <input type="checkbox" id="history-checkbox" />
        <label for="history-checkbox">Show History</label>
    </div>
    <div class="button-rows">
        <div class="row-0 row">
            <button type="button" class="button" id="calc-del">DEL</button>
            <button type="button" class="button" id="calc-ce">CE</button>
            <button type="button" class="button" id="calc-c">C</button>
        </div>
        <div class="row-1 row">
            <button type="button" class="button number-button" id="calc-1">1</button>
            <button type="button" class="button number-button" id="calc-2">2</button>
            <button type="button" class="button number-button" id="calc-3">3</button>
            <button type="button" class="button operator-button" data-operator="/" id="calc-divide">÷</button>
        </div>
        <div class="row-2 row">
            <button type="button" class="button number-button" id="calc-4">4</button>
            <button type="button" class="button number-button" id="calc-5">5</button>
            <button type="button" class="button number-button" id="calc-6">6</button>
            <button type="button" class="button operator-button" data-operator="*" id="calc-multiply">×</button>
        </div>
        <div class="row-3 row">
            <button type="button" class="button number-button" id="calc-7">7</button>
            <button type="button" class="button number-button" id="calc-8">8</button>
            <button type="button" class="button number-button" id="calc-9">9</button>
            <button type="button" class="button operator-button" data-operator="-" id="calc-sub">-</button>
        </div>
        <div class="row-4 row">
            <button type="button" class="button number-button" id="calc-0">0</button>
            <button type="button" class="button number-button" id="calc-00">00</button>
            <button type="button" class="button decimal-button" id="calc-." style="width: 20%;">.</button>
            <button type="button" class="button operator-button" data-operator="+" id="calc-add">+</button>
        </div>
        <div class="row-5 row">
            <button type="button" class="button" id="calc-eq">=</button>
        </div>
    </div>
</div>
<div class="history-container">
    <textarea readonly id="history"></textarea>
</div>
`);

function calcKeyPress(e) {
  if (window.State.focused_window_id === "calculator") {
    console.log(e.key);

    if (e.key === ".") {
      e.preventDefault();
      document.getElementById("calc-.").click();
    }

    let number_regex = new RegExp(/\d/);
    let is_number = number_regex.test(e.key);

    let char_regex = new RegExp(/^[a-zA-Z]$/);
    let is_char = char_regex.test(e.key);

    let operator_regex = new RegExp(/^[\+\-\/\*]$/);
    let is_operator = operator_regex.test(e.key);

    if (
      is_number &&
      document.getElementById("calculator-input") !== document.activeElement
    ) {
      document.querySelector(`#calc-${e.key}`).click();
    }

    if (is_operator) {
      if (
        document.getElementById("calculator-input") === document.activeElement
      ) {
        e.preventDefault();
      }
      let key;
      switch (e.key) {
        case "+":
          key = "add";
          break;
        case "/":
          key = "divide";
          break;
        case "-":
          key = "sub";
          break;
        case "*":
          key = "multiply";
          break;
      }
      document.querySelector(`#calc-${key}`).click();
    }

    if (
      document.getElementById("calculator-input") === document.activeElement &&
      is_char
    ) {
      e.preventDefault();
    }

    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      document.getElementById("calculator-input") !== document.activeElement
    ) {
      document.querySelector(`#calc-del`).click();
    }

    if (e.ctrlKey && e.key === "a") {
      e.preventDefault();
      document.getElementById("calculator-input").select();
    }

    if (e.key === "Enter") {
      document.querySelector(`#calc-eq`).click();
    }

    window.State.Calculator.lhs = document.getElementById(
      "calculator-input"
    ).value;
  }
}

function buttonPress(e) {
  if (
    e.target.classList.contains("number-button") ||
    e.target.id === "calc-."
  ) {
    if (
      e.target.id === "calc-." &&
      document.getElementById("calculator-input").value.indexOf(".") !== -1
    ) {
      return;
    }
    document.getElementById("calculator-input").value += e.target.innerHTML;
  }

  if (e.target.id == "calc-ce") {
    document.getElementById("calculator-input").value = "";
    window.State.Calculator.lhs = undefined;
    window.State.Calculator.rhs = undefined;
    window.State.Calculator.operation = undefined;
  }

  if (e.target.id == "calc-c") {
    window.State.Calculator = {
      lhs: undefined,
      rhs: undefined,
      operation: undefined,
      history: [],
    };
    document.getElementById("calculator-input").value = "";
    updateHistory();
  }

  if (e.target.id == "calc-del") {
    let current_value = document.getElementById("calculator-input").value;
    document.getElementById("calculator-input").value = current_value.substring(
      0,
      current_value.length - 1
    );
  }

  let lhs = window.State.Calculator.lhs;
  let rhs = window.State.Calculator.rhs;
  let operation = window.State.Calculator.operation;

  if (e.target.classList.contains("operator-button")) {
    if (!rhs) {
      window.State.Calculator.operation = e.target.dataset.operator;
      window.State.Calculator.rhs = window.State.Calculator.lhs;
      window.State.Calculator.lhs = undefined;
      document.getElementById("calculator-input").value = "";
    } else {
      startCalc();
      window.State.Calculator.operation = e.target.dataset.operator;
      window.State.Calculator.rhs = document.getElementById(
        "calculator-input"
      ).value;
      window.State.lhs = undefined;
      document.getElementById("calculator-input").value = "";
    }
  }

  if (e.target.id === "calc-eq") {
    if (lhs && rhs && operation) {
      let result = calculate(operation, lhs, rhs);
      document.getElementById("calculator-input").value = result;
      window.State.Calculator.lhs = result;
    }
    return;
  }

  window.State.Calculator.lhs = document.getElementById(
    "calculator-input"
  ).value;
}

function startCalc() {
  let lhs = window.State.Calculator.lhs;
  let rhs = window.State.Calculator.rhs;
  let operation = window.State.Calculator.operation;

  let result = calculate(operation, lhs, rhs);
  document.getElementById("calculator-input").value = result;
  window.State.Calculator.lhs = result;
}

function calculate(operation, lhs, rhs) {
  let result;
  lhs = parseFloat(lhs);
  rhs = parseFloat(rhs);
  switch (operation) {
    case "+":
      result = lhs + rhs;
      break;
    case "-":
      result = rhs - lhs;
      break;
    case "/":
      result = rhs / lhs;
      break;
    case "*":
      result = lhs * rhs;
      break;
  }
  result = result.toString().indexOf(".") !== -1 ? result.toFixed(3) : result;
  window.State.Calculator.operation = undefined;
  window.State.Calculator.lhs = undefined;
  window.State.Calculator.rhs = undefined;
  window.State.Calculator.history.push({
    lhs,
    rhs,
    operation,
    result,
  });
  updateHistory();
  return result;
}

function updateHistory() {
  document.getElementById("history").innerHTML = "";
  window.State.Calculator.history.forEach((calculation) => {
    document.getElementById(
      "history"
    ).innerHTML += `${calculation.rhs}\n${calculation.operation}\t${calculation.lhs}\n========\n${calculation.result}\n\n`;
  });
}

function onLoad() {
  window.State.Calculator = {
    operation: undefined,
    lhs: undefined,
    rhs: undefined,
    history: [],
  };

  document.getElementById("calculator-input").addEventListener("input", (e) => {
    window.State.Calculator.lhs = e.target.value;
  });

  document
    .getElementById("history-checkbox")
    .addEventListener("change", (e) => {
      if (e.target.checked) {
        document.getElementById("calculator").classList.add("show-history");
      } else {
        document.getElementById("calculator").classList.remove("show-history");
      }
    });
}

let calculatorWindow = {
  title: "Calculator",
  id: "calculator",
  content: calculatorWindowContent,
  customCSS: calculatorCSS,
  onLoadFunction: onLoad,
  eventListeners: [
    {
      type: "keydown",
      handler: calcKeyPress,
      element: "body",
    },
    {
      type: "click",
      handler: buttonPress,
    },
  ],
};

module.exports = calculatorWindow;
