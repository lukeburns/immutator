module.exports = autorun

function autorun (fn, state) {
  let interceptor = intercept(state)
  fn(interceptor)
  let selectors = getSelectors(interceptor.accessedSelectors)
  
  let unsubscribers = []
  if (state.subscribe) {
    selectors.forEach(selector => {
      unsubscribers.push(state.subscribe(selector, () => fn(state)))
    })
  } else {
    throw new Error('Cannot subscribe to object')
  }
  return function stop () {
    unsubscribers.forEach(unsubscribe => unsubscribe())
  }
}

function getSelectors (arr, parents=[]) {
  var selectors = []
  arr.forEach(node => {
    if (node.length > 1) {
      var prop = node.shift()
      subSelectors = getSelectors(node, parents.concat([prop]))
      subSelectors.forEach(function (subselector) {
        selectors.push(subselector)
      })
    } else {
      selectors.push(parents.concat(node))
    }
  })
  return selectors
}

function format (arr) {
  return arr.reduce((prev, curr) => prev+'['+curr+']')
}

function intercept (state) {
  let gets = []
  let interceptor = new Proxy(state, {
    get: (target, prop) => {
      if (prop === 'accessedSelectors') {
        return gets.map(function (get) {
          if (get.child) {
            return get.props.concat(get.child.accessedSelectors)
          } else {
            return get.props
          }
        })
      }
      
      let index = gets.push({ props: [prop] })
      if (target[prop] instanceof Object) {
        return gets[index-1].child = intercept(target[prop])
      } else {
        return target[prop]
      }
    }
  })
    
  return interceptor
}