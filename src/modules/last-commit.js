import fs from "fs"
import { exec } from "child-process-promise"

export const getLastDevCommit = async () => {

	let lastDevCommit

	if (fs.existsSync("last-dev-commit.txt")) {
		lastDevCommit = fs.readFileSync("last-dev-commit.txt", "utf8")

	} else {
		const result = await exec("git rev-parse HEAD")
		const { stdout } = result
		lastDevCommit = stdout
		fs.writeFileSync("last-dev-commit.txt", lastDevCommit)
	}

	return lastDevCommit
}

export default getLastDevCommit