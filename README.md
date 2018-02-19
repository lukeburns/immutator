# immutator

a redux-inspired state mutator. 

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

console.log(state) // { count: 0 }

// define mutator `increment`
state.increment = state => state.count++

// call mutator
state.increment() 

console.log(state) // { count: 1 }
```

`state` is a proxy whose target can only be mutated by defining and calling a mutator.

functions defined on the immutator are mutators. mutators are passed a mutable copy of state as their first argument when they are called. while they share the same namespace, defining a mutator does not affect state.

## api

#### `const immutable_state = immutator(initial_state={})`
#### `immutable_state[mutation_type] = mutator(mutable_state, ...mutation_data)`
#### `immutable_state[mutation_type](...mutation_data)`