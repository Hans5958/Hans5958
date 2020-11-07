const print = require("./print")

print().then(result => {
	const {readme} = result
	console.log(readme)
})