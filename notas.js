// Ejercicio 1: Async/Await

async function fetchData () {
  const response = await fetch('url')
  const data = await response.json()

  console.log(data)
}

fetchData()

// Ejercicio 2: Promises and async/await

const promise = new Promise((resolve, reject) => {
  const success = Math.random() > 0.5
  if (success) {
    resolve('Operation resolved')
  } else {
    reject(new Error('Operation rejected'))
  }
})

promise.then((response) => console.log(response))
