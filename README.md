# immutator

a redux-inspired state mutator

```js
npm install immutator
```

be aware: immutator uses `Proxy`. see [node support](http://node.green/#ES2015-built-ins-Proxy) and [browser support](https://caniuse.com/#feat=proxy).

## api

### `let state = immutator(init={})`

create a new immutator with initial value `init`.

```js
let state = immutator({ count: 0 })

try {
  state.count += 1
} catch (err) {
  console.log('Error: an immutator cannot be mutated')
}

console.log(state) // { count: 0 }
```

`state` can only be mutated by dispatching mutation events. direct mutations throw errors. sub-objects are also immutators.

### `state.dispatch([mutation_event], data)`

**dispatch** mutation events

```js
state.dispatch({ type: 'INCREMENT', amount: 2 })
```

or

```js
state.dispatch('INCREMENT', 2)
```

### `state.mutate([mutation_event], callback(state, data))`

**mutate** state on mutation events. callback passes a mutable `state` object.

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

or

```js
state.mutate('INCREMENT', (state, amount=1) => {
  state.count += amount
})

state.mutate('DECREMENT', (state, amount=1) => {
  state.count -= amount
})
```

### `state.subscribe([property], callback)`

**subscribe** to state mutations

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