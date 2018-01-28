# immutator

a redux-inspired state mutator. 

this library follows half of three principles of redux: (1) single source of truth and (2) state is *mostly* read-only. The third principle of redux, changes are made by pure functions, is abandoned in favor of restricting the context of state mutation to within "mutators."

```js
npm install immutator
```

be aware: immutator uses `Proxy`. see [node support](http://node.green/#ES2015-built-ins-Proxy) and [browser support](https://caniuse.com/#feat=proxy).

## example

```js
const immutator = require('immutator')

const state = immutator({ count: 0 })

try {
  state.count++
} catch (err) {
  console.log('Error: state cannot be mutated directly. please define a mutator.')
}

state.increment = state => state.count++

state.subscribe('count', () => console.log(state))

state.increment() // { count: 1 }
```

`state` is a proxy whose target can only be mutated by defining and calling a mutator.

functions defined on the immutator are mutators. mutators are passed a mutable copy of state as their first argument when they are called. defining a mutator does not affect state.

## api

#### `const immutable_state = immutator(init={})`

#### `immutable_state[mutation_type] = mutator(mutable_state, ...mutation_data)`

#### `immutable_state[mutation_type](...mutation_data)`

#### `immutable_state.subscribe([state_property], callback)`