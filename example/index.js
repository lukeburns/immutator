const immutator = require('../')
const bel = require('bel')
const morph = require('nanomorph')

const state = immutator({ count: 0, list: [] })

// counter

state.mutate('counter-increment', state => state.count++)
state.mutate('counter-decrement', state => state.count--)

function counterView (state) {
  return bel`<div id="counter">
    <h1>Counter</h1>
    <div id="count">${state.count}</div>
    <button onclick=${() => state.dispatch('counter-increment')}>+</button>
    <button onclick=${() => state.dispatch('counter-decrement')}>-</button>
  </div>`
}

// list

state.mutate('list-add', state => state.list.push(Math.random()))

function listView (state) {
  return bel`<div id="list">
    <h1>Random Numbers</h1>
    <button onclick=${() => state.dispatch('list-add')}>Add Random Number</button>
    <ul>
      ${state.list.map(item => bel`<li>${item}</li>`)}
    </ul>
  </div>`
}

// mount and subscribe

morph(document.body, bodyView(state))
state.subscribe(() => morph(document.body, bodyView(state)))

function bodyView (state) {
  return bel`<body>
    ${counterView(state)}
    ${listView(state)}
  </body>`
}