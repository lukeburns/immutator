module.exports = immutator

function immutator (mutable) {
  let mutaters = {}  
  let immutable = new Proxy(mutable, {
    get: function (target, key) {
      if (mutaters[key]) {
        return mutaters[key]
      }
      
      return (target[key] instanceof Object && typeof target[key] !== 'function') ? immutator(target[key]) : target[key]
    },
    set: function (target, key, fn) {
      if (typeof fn !== 'function') {
        throw new Error('Object cannot be mutated')
        return false
      } else {
        return mutaters[key] = (...data) => fn(mutable, ...data)
      }
    },
    delete: function () {
      throw new Error('Object cannot be mutated')
      return false
    }
  })
    
  return immutable
}