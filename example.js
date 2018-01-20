let immutator = require('./')

let state = immutator({ numbers: [] })

// subscribe to state mutations
state.on('*', function () {
  console.log('state mutated:', state)
})

// mutate state on mutation events
state.mutator.on('push', function (state, number) {
  state.numbers.push(number)
})

// dispatch mutation events
state.mutator.emit('push', Math.random())
state.mutator.emit('push', Math.random())

// mutating state outside of a mutation event handler throws an error
state.numbers.push(Math.random())