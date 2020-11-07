const print = require("./print")
const fs = require("fs")
const dayjs = require("dayjs")
dayjs.extend(require('dayjs/plugin/utc'))

print().then(result => {
	const {readme, timestamp} = result
	console.log("::set-output name=TIMESTAMP::" + dayjs(timestamp).utc().format())
	fs.writeFileSync("README.md", readme)
})

