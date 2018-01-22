const immutator = require('./')

const state = immutator({ count: 0 })

// mutating state outside of a mutation event handler throws an error
try {
  state.count++
} catch (err) {
  console.log('Error: an immutator cannot be mutated')
}

// subscribe to state mutations
state.subscribe('count', () => console.log('state mutated:', state))

// mutate state on mutation events
state.mutate('increment', state => state.count++)
state.mutate('decrement', state => state.count--)

// dispatch mutation events
state.dispatch('increment')
state.dispatch('decrement')