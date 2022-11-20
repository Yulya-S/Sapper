//Уровни сложности
const EASY = [9, 9, 10] //Легкий
const AVERAGE = [12, 12, 20] //Средний
const HARD = [30, 15, 99] //Сложный
const VARYHARD = [100, 80, 2000] //Суперсложный
let IAMLUCKY = AVERAGE
let PERSONALITY = [AVERAGE[0], AVERAGE[1], AVERAGE[0]*AVERAGE[1]-1]

const SPECHALLAVEL = ['IAMLUCKY']

const STANDART = 'AVERAGE'

let SELECTEDLEVEL = STANDART //выбранный уровень сложности

//Настройки системы
let SIZEX = STANDART[0]
let SIZEY = STANDART[1]
let KOLVO_BOMBS = STANDART[2]
let FLAGS

let startTime = 0 //время начала игры

let endGame = false
let bombMode = true //режим проверки ячейки или оежим отметки бомбы

let bombs = []
let nextCell = [] //очередь на проверку пустотности квадрата
let cellBefore = [] //память о существовании элемента в очереди на проверку
let cells //количество закрытых ячеек (если оно равно количеству бомб игра заканчивается)

difficultyLevel.value='AVERAGE' //установка среднего уровня сложности в html

function changingLevel(lavelName){
  if ( +(document.getElementsByName('bombs')[0].value) >= +(document.getElementsByName('x')[0].value) * +(document.getElementsByName('y')[0].value) || +(document.getElementsByName('bombs')[0].value)<1 ){
    alert("Неподходящее значение кол-ва бомб! настройки возвращены к стандартным")
    setLevel(STANDART)
  }
  setLevel(lavelName)
}

function setLevel(lavelName){
  if ( difficultyLevel.value == 'PERSONALITY' || SPECHALLAVEL.indexOf( difficultyLevel.value)!=-1) aNaming()
  const lavel = eval(lavelName)
  SIZEX = document.getElementsByName('x')[0].value = lavel[0]
  SIZEY = document.getElementsByName('y')[0].value = lavel[1]
  KOLVO_BOMBS = document.getElementsByName('bombs')[0].value = lavel[2]
  aNaming()
}


function settings() {
  changingLevel( difficultyLevel.value )
  SELECTEDLEVEL = difficultyLevel.value
  createField()
}

function changedPlayer(){
  const setting = document.getElementsByClassName('setting')[0]
  if ( difficultyLevel.value == 'PERSONALITY') for (let i= 1; i< setting.childElementCount - 1; i++ ) setting.children[i].removeAttribute('style')
  if ( SPECHALLAVEL.indexOf( difficultyLevel.value )!=-1 ) {
    for (let i= 1; i< setting.childElementCount - 2; i++ ) setting.children[i].removeAttribute('style')
    for (let i= 4; i< setting.childElementCount - 1; i++ ) setting.children[i].style.display='none'
  }
  if ( difficultyLevel.value != 'PERSONALITY' && SPECHALLAVEL.indexOf( difficultyLevel.value )==-1 ) {
    for ( let i= 1; i< setting.childElementCount - 1; i++ ) setting.children[i].style.display='none'
    document.getElementsByName('x')[0].value = eval(difficultyLevel.value)[0]
    document.getElementsByName('y')[0].value = eval(difficultyLevel.value)[1]
    document.getElementsByName('bombs')[0].value = eval(difficultyLevel.value)[2]
    aNaming()
  }
}

function aNaming(){
  if ( difficultyLevel.value === 'PERSONALITY' ) PERSONALITY = [ +document.getElementsByName('x')[0].value, +document.getElementsByName('y')[0].value, +document.getElementsByName('bombs')[0].value ]
  if ( difficultyLevel.value === 'IAMLUCKY' ) IAMLUCKY = [ +document.getElementsByName('x')[0].value, +document.getElementsByName('y')[0].value, +document.getElementsByName('x')[0].value * +document.getElementsByName('y')[0].value - 1 ]
  document.getElementsByClassName('setting')[0].children[3].innerHTML='Кол-во ячеек: ' + ( +document.getElementsByName('x')[0].value * +document.getElementsByName('y')[0].value )
  document.getElementsByClassName('setting')[0].children[5].innerHTML='Макс. кол-во бомб: ' + ( +document.getElementsByName('x')[0].value * +document.getElementsByName('y')[0].value - 1 )
}

function rollUp() {
  if (document.body.children[1].style.transform=='scaleX(1)'){
    document.body.children[1].style.transform='scaleX(0.000001)'
    document.body.style.marginLeft='110px'
  }
  else{
    document.body.children[1].style.transform='scaleX(1)'
    document.body.style.marginLeft='420px'
  }
}

function regimeСhange() { //переключение режима отметки бомб или открытия ячеек
  bombMode = !bombMode
  if (bombMode) document.getElementsByTagName('button')[2].innerHTML = 'Отмечать бомбы'
  else document.getElementsByTagName('button')[2].innerHTML = 'Проверять ячейки'
}

function printOstatki(kolvoCells){
  document.body.getElementsByTagName('div')[0].getElementsByTagName('a')[0].innerHTML = 'Ячеек не открыто: '+ kolvoCells
  if (!endGame) document.body.getElementsByTagName('div')[0].getElementsByTagName('a')[1].innerHTML = 'Бомб нужно найти: '+ FLAGS
  else document.body.getElementsByTagName('div')[0].getElementsByTagName('a')[1].innerHTML = 'Бомб нужно найти: 0'
}

function flagsAndChekingFlag(event){
  flags(event)
  if ( bombs.length!=0 && !event.classList.contains('empty') && !event.classList.contains('flag') && bombs[event.getAttribute('data-idx')]>0)
    checkingFlag(+event.getAttribute('data-idx'), +event.getAttribute('data-row'))
  if ( cells<=KOLVO_BOMBS ) printResult(true)
}


function checkCell() {
  if ( endGame ) return 0
  if (bombMode) cell(this)
  else flagsAndChekingFlag(this)
  printOstatki( cells - KOLVO_BOMBS )
}

function clickRight() {
  if ( endGame ) return 0
  if (bombMode) flagsAndChekingFlag(this)
  else cell(this)
  printOstatki( cells - KOLVO_BOMBS )
  window.event.returnValue = false;
}

function printResult(win) { //написание результатов
  for (let i= 0; i<(SIZEX * SIZEY); i++){
    let elem = document.getElementsByClassName('grid')[0].children[i].classList
    if ( bombs[i]==(-1) ) {
      elem.remove('empty')
      elem.remove('flag')
      elem.remove('bomb')
      if (win) elem.add('flag')
      else elem.add('bomb')
  }}
  endGame = true
  text.removeAttribute("style")
  if (win) {
    text.innerHTML = "Вы выиграли"
    printOstatki(0)
    const second = parseInt( ((new Date())-startTime)/1000 )
    const minutes = parseInt(second/60)
    const hours = parseInt(minutes/60)
    const days = parseInt(hours/24)
    let itog = `Вы выиграли за: `
    if ( days!=0 ) itog += `${days}дней `
    itog += `${hours}:${minutes-hours*24}:${second-minutes*60}`
    alert(itog)
  }
  else text.innerHTML = "Game Over"
}

function topMiddleBottom(start, end, nowRow, mod) { //проверка на количество флагов в строке/отрытие пустых ячеек в строке
  const doc = document.getElementsByClassName('grid')[0]
  let summ = 0
  for (let i= start; i<end; i++)
    if ( i>(-1) && i<(SIZEX * SIZEY) ) {
      const row = +doc.children[i].getAttribute('data-row')
      if ( row==nowRow ) {
        if (mod) {
          if (doc.children[i].classList.contains('flag')) summ++
        }
        else {
          if (doc.children[i].classList.contains('empty')) {
            doc.children[i].classList.remove('empty')
            cells--
          }
          if ( bombs[i]==(-1) && !doc.children[i].classList.contains('flag') ) {
            printResult()
            return 0
          }
          if ( bombs[i]>0 && !doc.children[i].classList.contains('flag') ) doc.children[i].innerHTML = bombs[i]
          else if ( bombs[i]==0 && nextCell.indexOf(i)==-1 && cellBefore.indexOf(i)==-1 ) nextCell.push(i)
        }
      }
    }
  if (mod) return summ
}

function checkingFlag(i, row) { //открытие ячеек в квадрате стоит нужное кол-во флагов
  let summ = 0
  summ += topMiddleBottom(i-SIZEX-1, i-SIZEX+2, row-1, true)
  summ += topMiddleBottom(i-1, i+2, row, true)
  summ += topMiddleBottom(i+SIZEX-1, i+SIZEX+2, +row+1, true)
  if ( summ==bombs[i] ) {
    nextCell.push(i)
    emptySquare(nextCell[0], +document.getElementsByClassName('grid')[0].children[nextCell[0]].getAttribute('data-row'))
  }
}

function emptySquare(i, row) { //открытие ячеек если центральная пустая
  topMiddleBottom(i-SIZEX-1, i-SIZEX+2, row-1)
  topMiddleBottom(i-1, i+2, row)
  topMiddleBottom(i+SIZEX-1, i+SIZEX+2, +row+1)
  cellBefore.push(nextCell[0])
  nextCell.shift()
  if( nextCell.length!=0 ) emptySquare(nextCell[0], +document.getElementsByClassName('grid')[0].children[nextCell[0]].getAttribute('data-row'))
}

function topMiddleBottomScore(start, end, nowIdx, nowRow) { //проверка строки на наличие бомб
  for (let i= start; i<end; i++)
    if ( i>(-1) && i<(SIZEX * SIZEY) ) {
      let row = +document.getElementsByClassName('grid')[0].children[i].getAttribute('data-row')
      if ( row==nowRow && bombs[i]==(-1) ) bombs[nowIdx]++
    }
}

function mixBombs(idx) { //рандомное разложение бомб
  for (let i= 0; i<cells; i++) bombs.push(0)
  for (let i= 0; i<KOLVO_BOMBS; i++) {
    const j = Math.floor( Math.random() * cells)
    if ( j==idx || bombs[j]==(-1) ) i--
    else bombs[j] = -1
  }
  for (let i= 0; i<cells; i++){
    const now = +document.getElementsByClassName('grid')[0].children[i].getAttribute('data-row')
    if ( bombs[i]!=(-1) ){
      topMiddleBottomScore(i-SIZEX-1, i-SIZEX+2, i, now-1)
      topMiddleBottomScore(i-1, i+2, i, now)
      topMiddleBottomScore(i+SIZEX-1, i+SIZEX+2, i, now+1)
  }}
  //console.log(bombs) //вывысти ответы в виде массива
}

function flags(elem) {
  if (elem.classList.contains('empty') || elem.classList.contains('flag')){
    if (elem.classList.contains('flag')) {
      elem.classList.remove('flag')
      elem.classList.add('empty')
      FLAGS++
    }
    else {
      elem.classList.remove('empty')
      elem.classList.add('flag')
      FLAGS--
}}}

function cell(elem) {
  const idx = +elem.getAttribute('data-idx')
  if ( endGame || elem.classList.contains('flag') ) return 0
  const doc = document.getElementsByClassName('grid')[0].children[idx]
  if ( bombs.length==0 ) { //проверка на первый ход
    mixBombs(idx)
    startTime = new Date()
  }
  if ( bombs[idx]==(-1) ){
    printResult()
    return 0
  }
  if ( bombs[idx]==0 ) {
    nextCell.push(idx)
    emptySquare(idx, elem.getAttribute('data-row'))
  }
  else {
    checkingFlag(idx, elem.getAttribute('data-row'))
    if ( doc.classList.contains('empty') ) {
      doc.classList.remove('empty')
      cells--
    }
    doc.innerHTML = bombs[idx]
  }
  if ( cellBefore.length!=0 ) cellBefore = []
  if ( cells<=KOLVO_BOMBS ) printResult(true)
}

function createP(row, idx) {
  const p = document.createElement('p')
  p.classList.add('empty')
  p.setAttribute('data-row', row)
  p.setAttribute('data-idx', idx)
  p.addEventListener('click', checkCell)
  p.addEventListener('contextmenu', clickRight)
  document.body.querySelector('.grid').appendChild(p)
}

function createField() {
  setLevel( SELECTEDLEVEL )
  FLAGS = KOLVO_BOMBS
  endGame = false
  printOstatki( SIZEX * SIZEY - KOLVO_BOMBS )
  aNaming()
  document.body.querySelector('.grid').style.width = ((34 * SIZEX) + 'px')
  document.body.style.width = ((34 * SIZEX) + 30 + 'px')
  cells = SIZEX * SIZEY
  bombs = []
  nextCell = []
  cellBefore = []
  startTime = 0

  text.innerHTML = ""
  text.style.visibility = "hidden"
  document.querySelector('.grid').replaceChildren()
  let idx = 0
  for (let i= 0; i<SIZEY; i++)
    for (let j= 0; j<SIZEX; j++){
      createP(i, idx)
      idx++
    }
}

createField()
