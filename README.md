# immutator

a redux-inspired state mutator

```js
npm install immutator
```

be aware: immutator uses `Proxy`. see [node support](http://node.green/#ES2015-built-ins-Proxy) and [browser support](https://caniuse.com/#feat=proxy).

## api

### `const state = immutator(init={})`

create a new immutator with initial value `init`, an array or an object.

```js
const immutator = require('immutator')

const state = immutator({ count: 0 })

try {
  state.count += 1
} catch (err) {
  console.log('Error: an immutator cannot be mutated')
}

console.log(state) // { count: 0 }
```

`state` is a proxy whose target can only be mutated by dispatching mutation events. sub-objects of `state` are also immutators.

### `state.dispatch([mutation_event], ...data)`

**dispatch** mutation events

```js
state.dispatch({ type: 'INCREMENT', amount: 2 })
```

or use namespaced events

```js
state.dispatch('INCREMENT', 2)
```

### `state.mutate([mutation_event], callback(state, ...data))`

**mutate** state on mutation events. callback passes a mutable `state` object, a proxy that emits events on state get, set, and delete.

```js
state.mutate((state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state.count += action.amount || 1
    case 'DECREMENT':
      return state.count -= action.amount || 1
  }
})

```

or use namespaced events

```js
state.mutate('INCREMENT', (state, amount=1) => {
  state.count += amount
})

state.mutate('DECREMENT', (state, amount=1) => {
  state.count -= amount
})
```

### `state.subscribe([property], callback)`

**subscribe** to all state mutations

```js
state.subscribe(function () {
  console.log('state mutated:', state)
})
```

or to specific properties

```js
state.subscribe('count', function () {
  console.log('state.count mutated:', state)
})
```