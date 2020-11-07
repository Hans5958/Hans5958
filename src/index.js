const print = require("./print")

print()
	.then(result => {
		const { readme } = result
		console.log(readme)
	}).catch(error => {
		console.error(error)
		process.exit(1)
	})