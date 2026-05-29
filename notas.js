// Ejercicio 1: Async/Await

async function fetchData () {
  const response = await fetch('url')
  const data = await response.json()

  console.log(data)
}

fetchData()
// Ejercicio 2: Promises and async/await
