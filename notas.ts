// Ejercicio 1: Async/Await

async function fetchData (): Promise<void> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  const data = await response.json()

  console.log(data)
}

fetchData().catch(console.error)

// Ejercicio 2: Promises and async/await

const promise = new Promise<string>((resolve, reject) => {
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

// Ejercicio 3: Concurrency
const posts = await Promise.all([1, 2].map(id => fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(r => r.json())))
console.log(posts.length)
