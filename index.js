const { EventEmitter } = require('events')

module.exports = system

function system (obj) {
  return mutator(observe(obj))
}

function mutator (mutable) {
  let emitter = new EventEmitter()
  emitter.setMaxListeners(1)
  let emit = emitter.emit.bind(emitter)
  emitter.emit = function (evt, ...args) {
    emit(evt, mutable, ...args)
  }
  
  let immutable = new Proxy(mutable, {
    get: function (target, key) {
      let val = target[key]
      if (key === 'mutator') {
        return emitter
      } else if (key === 'mutate') {
        return function (evt, callback) {
          if (typeof evt == 'function') {
            return emitter.on('*', evt)
          } else {
            return emitter.on(evt, callback)
          }
        }
      } else if (key === 'dispatch') {
        return function (evt, ...args) {
          if (typeof evt !== 'string') 
            return emit('*', mutable, evt, ...args)
          else
            return emit(evt, mutable, ...args)
        }
      }
      
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
      } else if (key === 'subscribe') {
        return function (evt, callback) {
          if (typeof evt == 'function') {
            emitter.on('*', evt)
            return emitter.removeListener.bind(emitter, '*', evt)
          } else {
            emitter.on(evt, callback)
            return emitter.removeListener.bind(emitter, evt, callback)
          }
        }
      } else if (key === "__isObservable") {
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