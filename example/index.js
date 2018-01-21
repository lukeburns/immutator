const immutator = require('../')
const autorun = require('./autorun')
const bel = require('bel')
const morph = require('nanomorph')

const state = immutator({ count: 0 })

state.mutate('increment', state => state.count++)
state.mutate('decrement', state => state.count--)

autorun(state => morph(document.body, bodyView(state)), state)

function bodyView (state) {
  return bel`<body>
    <div id="count">${state.count}</div>
    <button onclick=${() => state.dispatch('increment')}>+</button>
    <button onclick=${() => state.dispatch('decrement')}>-</button>
  </body>`
}