import print from "./print.js"

print()
	.then(result => {
		const { readme } = result
		console.log(readme)
	}).catch(error => {
		console.error(error)
		process.exit(1)
	})