const immutator = require('../')
const bel = require('bel')
const morph = require('nanomorph')

const state = immutator({ count: 0, list: [] })

// counter

state.increment = state => state.count++
state.decrement = state => state.count--

function counter (state) {
  return bel`<div id="counter">
    <h1>Counter</h1>
    <div id="count">${state.count}</div>
    <button onclick=${state.increment}>+</button>
    <button onclick=${state.decrement}>-</button>
  </div>`
}

// list

state.append = state => state.list.push(Math.random())

function list (state) {
  return bel`<div id="list">
    <h1>Random Numbers</h1>
    <button onclick=${state.append}>Add Random Number</button>
    <ul>
      ${state.list.map(item => bel`<li>${item}</li>`)}
    </ul>
  </div>`
}

// render and subscribe

render()
state.subscribe(render)

function body (state) {
  return bel`<body>
    ${counter(state)}
    ${list(state)}
  </body>`
}

function render () {
  morph(document.body, body(state))
}