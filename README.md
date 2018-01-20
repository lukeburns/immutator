# immutator

a redux-inspired state mutator

```js
npm install immutator
```

be aware: immutator uses `Proxy`. see [node support](http://node.green/#ES2015-built-ins-Proxy) and [browser support](https://caniuse.com/#feat=proxy).

## api

### `let state = immutator(init={})`

create a new immutator, initalizing with an object or an array `init`. 

```js
let state = immutator({ numbers: [] })
```

`state` can *only* be mutated using a mutation event handler. direct mutations throw errors.

### `state.mutator.on(event, callback(state, ...args))`

**mutate** state on mutation events

```js
state.mutator.on('push', function (state, number) {
  state.numbers.push(number)
})
```

### `state.mutator.emit(event, ...args)`

**dispatch** mutation events

```js
state.mutator.emit('push', Math.random())
```

### `state.on(property, callback)`

**subscribe** to state mutations

```js
state.on('*', function () {
  console.log('state mutated:', state)
})
```