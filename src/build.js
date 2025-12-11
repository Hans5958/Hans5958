import print from "./print.js"
import fs from "fs"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import core from '@actions/core'

dayjs.extend(utc)

print()
	.then(result => {
		const { readme, timestamp } = result
		core.setOutput('TIMESTAMP', dayjs(timestamp).utc().format())
		fs.writeFileSync("README.md", readme)
	}).catch(error => {
		console.error(error)
		process.exit(1)
	})
