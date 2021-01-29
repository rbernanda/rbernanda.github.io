const words = ['for', 'for in', 'for of', 'forEach', 'while', 'object', 'array', 'string', 'boolean', 'number', 'undefined', 'null', 'if', 'else if', 'else', 'length', 'index', 'infinite loop', 'console',
'Syntax', 'value', 'key', 'literals', 'variable', 'function', 'method', 'properties', 'sort',
 'Math.round', 'Math.ceil', 'Math.floor', 'Math.random', 'Math.PI', 'Math.pow', 'Math.abs', 'break', 'continue', 'comparison', 'switch', 'hoisting', 'scope', 'var', 'const', 'let', 'this', 'arrow function',
 'equal to', 'not equal', 'greater than', 'less than', 'debugging', 'class', 'error', 'API', 'constructor', 'parameter', 'invoke', 'inheritance', 'static', 'callback', 'asynchronous', 'promises',
 'async', 'await', 'CRUD', 'recursive', 'node', 'element', 'DOM', 'node lists', 'addEventListener', 'document', 'accessor', 'prototype', 'ES6', 'form', 'setInterval', 'setTimeout', 'isInteger', 'NaN',
 'toString', 'toFixed', 'toUpperCase', 'toLowerCase', 'toExponential', 'parse', 'stringify', 'indexOf', 'push', 'pop', 'shift', 'unshift', 'split', 'slice', 'concat', 'join', 'splice', 'filter', 'map', 'valueOf', 'every', 'reverse', 'fill', 'some', 'from', 'reduce', 'getDate', 'getDay', 'getFullYear',
 'getHours', 'getMiliSeconds', 'getMinutes', 'getMonth', 'getSeconds', 'getTime', 'flagging', 'isNaN',
 'isFinite', 'return', 'throw', 'try', 'catch', 'do while', 'charAt', 'RegExp', 'increment', 'typeof', '""', "[]", '{}', 'require', 'export', 'import', 'cookie', 'hierarchy', 'script', 'clearTimeout', 'alert', 'prompt', 'Math.sqrt', 'console.log', 'substring', 'onBlur', 'onChange', 'onClick', 'onFocus',
 'onLoad', 'onMouseOver', 'onSelect', 'onSubmit', 'onUnload', 'href', 'anchor', 'window', 'or', 'and', "Angular", "React", "Vue"
]

// selector
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const scoreElement = document.getElementById('scoreBoard')
const buttonElement = document.getElementById('button')
const noteElement = document.getElementById('note')
const playButtonElement = document.getElementById('playButton')
const volumeSliderElement = document.getElementById('volume')
const musicContainer = document.getElementById('music')


// result variable
let music = new Audio ('assets/lofi.mp3')
let characterTyped = 0;
let errors = 0;

let totalErrorChart = 0;
let totalCorrectCharacter = 0
let accuracy = 0;
let isHighestCPM = 0;
let startTime = 60;

let cpmLocalStorage = Number(localStorage.getItem("cpm"))
let accuracyLocalStorage = Number(localStorage.getItem("accuracy"))

function getRandomQuote(arr) {
  let output = '';
  for (let i = 0; i < 10; i++) {
    
    let index = Math.round(Math.random() * arr.length);
    if (i === 9) output += words[index];
    else output += `${words[index]} `; 
  }

  return output;
}
  

let timerFlag = true;
let practiceFlag = false; // for practice mode -- no time limit

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')
  
  if(timerFlag) startTimer()
  timerFlag = false;
  
  characterTyped++
  errors = 0;

  let index = arrayValue.length-1
  let correct = true
  
  for (let i = index; i < arrayQuote.length; i++) {
    const character = arrayValue[i]
    if (character == null) {
      arrayQuote[i].classList.remove('correct')
      arrayQuote[i].classList.remove('incorrect')
      correct = false
    } else if (character === arrayQuote[i].innerText) {
      arrayQuote[i].classList.add('correct')
      arrayQuote[i].classList.remove('incorrect')
    } else if (character !== arrayQuote[i].innerText){
      arrayQuote[i].classList.remove('correct')
      arrayQuote[i].classList.add('incorrect')
      errors++
      totalErrorChart += errors;
    }
  }
  
  totalCorrectCharacter = characterTyped - totalErrorChart ; 
  accuracy = (totalCorrectCharacter / characterTyped) * 100;  

  if (correct) renderNewQuote()

})

function renderNewQuote() {
  const quote = getRandomQuote(words)
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })

  quoteInputElement.value = null
}


function startTimer() {
 let countDown =  setInterval(() => {
   startTime -= 1
  if (startTime <= 0) {
    clearInterval(countDown)
    finish()
  }
   if (startTime < 10) timer.innerText = `0:0${startTime}`
   else timer.innerText = `0:${startTime}`
  }, 1000)
}


function finish() {

  accuracy = Math.round(accuracy);
  
  totalcpm.innerText = `${Math.round((characterTyped / 60) * 60)} CPM`
  wrongChart.innerText = `: ${totalErrorChart}`;

  if (accuracy < 0) accuracy = "Under 15";
  if (totalCorrectCharacter < 0) totalCorrectCharacter = "-Negative"

  accuracyValue.innerText = `: ${accuracy}%`;
  correctChart.innerText = `: ${totalCorrectCharacter}`;

  isHighestCPM = Math.round((characterTyped / 60) * 60)

  if (!cpmLocalStorage && !accuracyLocalStorage) {
    localStorage.setItem("accuracy", `${accuracy}`)
    localStorage.setItem("cpm", `${isHighestCPM}`)
    updateHighestRecord(accuracy, isHighestCPM)
  } else if (accuracy > accuracyLocalStorage && isHighestCPM >= cpmLocalStorage) {
    localStorage.setItem("accuracy", `${accuracy}`)
    localStorage.setItem("cpm", `${isHighestCPM}`)
    updateHighestRecord(accuracy, isHighestCPM)
  }

  quoteInputElement.value = null
  quoteDisplayElement.style.display = 'none'
  scoreElement.style.display = 'block'
  noteElement.style.display = 'block'

}

buttonElement.addEventListener('click', reload)

function reload() {
  characterTyped = 0;
  errors = 0;
  accuracy = 0;
  startTime = 60;
  timerFlag = true;
  totalErrorChart = 0;
  totalCorrectCharacter = 0;

  totalcpm.innerText = `0 CPM`
  accuracyValue.innerText = 0
  correctChart.innerText = 0
  wrongChart.innerText = 0
  timer.innerText = "1:00"

  quoteInputElement.value = null
  quoteDisplayElement.style.display = 'block'
  scoreElement.style.display = 'none'
  noteElement.style.display = 'none'

  renderNewQuote()
  quoteInputElement.focus()
}

playButtonElement.addEventListener('click', playPause)
volumeSliderElement.addEventListener('change', volumeChange)

let isPlaying = false

function playPause() {
  
  if (!isPlaying) {
    playButton.innerHTML = "||"
    music.play()
    music.loop = true;
    isPlaying = true;
  } else {
    playButton.innerHTML = "&#9658"
    music.pause()
    isPlaying = false;
  }

}

function volumeChange(){
	music.volume = volumeSliderElement.value / 100
}

function displayMusicContainer() {
  musicContainer.style.display = 'flex'
}

window.onload = () => {
  setTimeout(displayMusicContainer, 4000);
  setTimeout(playPause, 3000)
}

function updateHighestRecord(acc, cpm) {
  highestCPM.innerText = `${cpm} CPM`
  highestAccuracy.innerText = `with ${acc}% accuracy`
}

if (cpmLocalStorage && accuracyLocalStorage) {
  updateHighestRecord(accuracyLocalStorage, cpmLocalStorage)
}

renderNewQuote()