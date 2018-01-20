const immutator = require('./')

const state = immutator({ count: 0 })

// mutating state outside of a mutation event handler throws an error
try {
  state.count += 1
} catch (err) {
  console.log('Error: an immutator cannot be mutated')
}

// subscribe to state mutations
state.subscribe('count', () => {
  console.log('state mutated:', state)
})

// mutate state on mutation events
state.mutate('INCREMENT', (state, amount=1) => {
  state.count += amount
})

state.mutate('DECREMENT', (state, amount=1) => {
  state.count -= amount
})

// dispatch mutation events
state.dispatch('INCREMENT', 2)
state.dispatch('DECREMENT', 1)