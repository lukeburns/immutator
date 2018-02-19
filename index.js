module.exports = immutator

function immutator (mutable) {
  let immutable = new Proxy(mutable, {
    get: function (target, key) {
      if (key === '__raw') {
        return target
      }
      
      return (target[key] instanceof Object && typeof target[key] !== 'function') ? immutator(target[key]) : target[key]
    },
    set: function (target, key, fn) {
      if (typeof fn !== 'function') {
        throw new Error('Object cannot be mutated')
        return false
      } else {
        return target[key] = (...data) => fn(target, ...data)
      }
    },
    delete: function () {
      throw new Error('Object cannot be mutated')
      return false
    }
  })
    
  return immutable
}