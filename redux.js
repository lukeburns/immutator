const immutator = require('./')

const state = immutator({ count: 0 })

// mutating state outside of a mutation event handler throws an error
try {
  state.count++
} catch (err) {
  console.log('Error: an immutator cannot be mutated')
}

// subscribe to state mutations
state.subscribe(() => console.log('state mutated:', state))

// mutate state on mutation events
state.mutate((state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state.count++
    case 'DECREMENT':
      return state.count--
  }
})

// dispatch mutation events
state.dispatch({ type: 'INCREMENT' })
state.dispatch({ type: 'DECREMENT' })