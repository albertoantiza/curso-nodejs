// Ejercicio 1: Async/Await

async function fetchData () {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
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

try {
  const response = await promise
  console.log(response)
} catch (err) {
  console.log(err)
}
