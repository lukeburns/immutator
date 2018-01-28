const { EventEmitter } = require('events')

module.exports = system

function system (obj) {
  return mutator(observe(obj))
}

function mutator (mutable) {
  let mutaters = {}  
  let immutable = new Proxy(mutable, {
    get: function (target, key) {
      if (mutaters[key]) {
        return mutaters[key]
      }
      
      let val = target[key]
      return (val instanceof Object && typeof val !== 'function') ? mutator(val) : val
    },
    set: function (target, key, fn) {
      if (typeof fn !== 'function') {
        throw new Error('Object cannot be mutated')
        return false
      } else {
        mutaters[key] = (...data) => fn(mutable, ...data)
        return true
      }
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
      if (key === 'subscribe') {
        return function (evt, callback) {
          if (typeof evt == 'function') {
            emitter.on('*', evt)
            return emitter.removeListener.bind(emitter, '*', evt)
          } else {
            emitter.on(evt, callback)
            return emitter.removeListener.bind(emitter, evt, callback)
          }
        }
      } else {
        return target[key]
      } 
    },
    set: function (target, prop, value) {
      var oldValue = target[prop]
      if (value instanceof Object && typeof value !== 'function' && prop !== 'length') {
        let state = observe(value, function (state) {
          state.subscribe('*', function (subProps) {
            let props = [prop].concat(subProps)
            emitter.emit('*', props)
            props.forEach(function (prop, i) {
              emitter.emit(format(props.slice(0, i+1)))
            })
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