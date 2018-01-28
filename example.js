const immutator = require('./')

const state = immutator({ count: 0 })

// mutating state outside of a mutation event handler throws an error
try {
  state.count++
} catch (err) {
  console.log('Error: an immutator cannot be mutated')
}

// define mutators
state.increment = state => state.count++
state.decrement = state => state.count--

// subscribe to state mutations
state.subscribe('count', () => console.log(state))

// call mutations
state.increment() // { count: 1 }
state.increment() // { count: 2 }
state.decrement() // { count: 1 }
