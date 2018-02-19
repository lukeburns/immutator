const immutator = require('../')
const html = require('bel')
const _ = require('morphable')
const raw = _.raw; _.raw = state => raw(state.__raw)
_.log = true

const state = immutator(_({ view: 'list', count: 0, list: [] }))

// count

state.increment = state => state.count++
state.decrement = state => state.count--
  
const count = _(state => html`<div>
  <h1>Count | <a href="#" onclick=${() => state.load('list')}>List</a></h1>
  <div id="count">${state.count}</div>
  <button onclick=${state.increment}>+</button>
  <button onclick=${state.decrement}>-</button>
</div>`)

// list

state.append = state => state.list.push(Math.random())

const list = _(state => html`<div>
  <h1><a href="#" onclick=${() => state.load('count')}>Count</a> | List</h1>
  <button onclick=${state.append}>Add Random Number</button>
  <ul>
    ${state.list.map(item => html`<li>${item}</li>`)}
  </ul>
</div>`)

// body

const views = { count, list }
state.load = (state, view) => state.view = view

const body = _(state => html`<body id=${state.view}>
  ${views[state.view](state)}
</body>`)

body(state, document.body)
