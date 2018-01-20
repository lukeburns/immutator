let immutator = require('./')

let state = immutator({ count: 0 })

// subscribe to state mutations
state.subscribe(() => {
  console.log('state mutated:', state)
})

// mutate state on mutation events
state.mutate((state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state.count += action.amount || 1
    case 'DECREMENT':
      return state.count -= action.amount || 1
  }
})

// dispatch mutation events
state.dispatch({ type: 'INCREMENT', amount: 2 })
state.dispatch({ type: 'DECREMENT', amount: 1 })

// mutating state outside of a mutation event handler throws an error
try {
  state.count += 1
} catch (err) {
  console.log('Error: an immutator cannot be mutated')
}