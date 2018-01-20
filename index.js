const { EventEmitter } = require('events')

module.exports = system

function system (obj) {
  return mutator(observe(obj))
}

function mutator (mutable) {
  let emitter = new EventEmitter()
  let emit = emitter.emit.bind(emitter)
  emitter.emit = function (evt, ...args) {
    emit(evt, mutable, ...args)
  }
  
  let immutable = new Proxy(mutable, {
    get: function (target, key) {
      let val = target[key]
      if (key === 'mutator') return emitter
      return (val instanceof Object && typeof val !== 'function') ? mutator(val) : val
    },
    set: function () {
      throw new Error('Object cannot be mutated')
      return false
    },
    delete: function () {
      throw new Error('Object cannot be mutated')
      return false
    }
  })
    
  return immutable
}

function observe (obj={}, before=x=>x) {
  let emitter = new EventEmitter()
  let target = obj instanceof Array ? [] : {}
  
  let state = new Proxy(target, {
    get: (target, key) => {
      if (key !== 'emit' && emitter[key]) {
        return emitter[key].bind(emitter)
      } else if (key === "__isProxy") {
        return true 
      } else {
        return target[key]
      } 
    },
    set: function (target, prop, value) {
      var oldValue = target[prop]
      if (prop === 'length') {
        target.length = value
        return true
      } else if (value instanceof Object) {
        let state = observe(value, function (state) {
          state.on('*', function (subProps) {
            let props = [prop].concat(subProps)
            emitter.emit('*', props)
            emitter.emit(format(props))
          })
        })
        target[prop] = state
        emitter.emit('*', [prop])
        emitter.emit(prop)
      } else {
        target[prop] = value
        emitter.emit('*', [prop])
        emitter.emit(prop)
      }
      return true
    },
    deleteProperty: function (target, prop) {
      var oldValue = target[prop]
      delete target[prop]
      emitter.emit('*', [prop])
      emitter.emit(prop)
      return true
    }
  })
  
  before(state)
  Object.assign(state, obj)
  
  return state
}

function format (arr) {
  return arr.reduce((prev, curr) => prev+'['+curr+']')
}