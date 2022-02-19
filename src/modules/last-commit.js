const fs = require("fs")

module.exports = async () => {

	let lastDevCommit

	if (fs.existsSync("last-dev-commit.txt")) {
		lastDevCommit = fs.readFileSync("last-dev-commit.txt", "utf8")

	} else {
		const result = await require('child-process-promise').exec("git rev-parse HEAD")
		const { stdout } = result
		lastDevCommit = stdout
		fs.writeFileSync("last-dev-commit.txt", lastDevCommit)
	}

	return lastDevCommit
}
