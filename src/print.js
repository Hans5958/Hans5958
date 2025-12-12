import fs from "fs"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import getEvents from "./modules/events.js"
import getLastDevCommit from "./modules/last-commit.js"

dayjs.extend(utc)
dayjs.extend(timezone)

export const print = async () => {

	try {

		// Prepare functions

		let lines = []

		const addLine = line => lines.push(line)
		const flushLine = () => lines = []
		const printLines = () => {
			const returnValue = lines.join("\r\n")
			flushLine()
			return returnValue
		}

		let file = fs.readFileSync("src/base.md", "utf8") + ""

		const replace = (from, to) => {
			file = file.replace(from, to)
		}

		// PART 1: TIME AND DATES

		const gmtTime = dayjs().utc()
		const localTime = dayjs().tz("Asia/Jakarta")

		const gmt00 = gmtTime.hour()
		const gmt07 = localTime.hour()

		const h12 = localTime.format('ha')
		const h24 = localTime.format('HH')

		let emoji

		if (gmt07 > 6 && gmt07 < 19) emoji = ":sunny:"
		else emoji = ":crescent_moon:"

		replace("{{hour-24}}", h24)
		replace("{{hour-12}}", h12)
		replace("{{time-emoji}}", emoji)

		if (gmt07 < 7) replace("{{status-from-time}}", "*There is a great chance that I'm offline, so I'm sorry that I can't respond to you currently.*")
		else if (gmt07 < 9) replace("{{status-from-time}}", "*I will be online in a few hours or so.*")
		else if (gmt07 < 22) replace("{{status-from-time}}", "*I'm online, doing stuff, and is able to respond to inquiries.*")
		else replace("{{status-from-time}}", "*I'm online, but only if I'm on a weekend, or there's nothing to do tommorow morning.*")

		replace("{{last-updated}}", gmtTime.format("DD/MM/YYYY, HH:mm:ss UTC"))

		// PART 2: RECENT ACTIVITY

		const { commits, events, activityGraphLines } = await getEvents(10)

		commits.splice(0, 10).forEach(line => addLine("- " + line))
		replace("{{last-commits}}", printLines())

		events.splice(0, 10).forEach(line => addLine("- " + line))
		replace("{{last-events}}", printLines())

		replace("{{activity-graph}}", activityGraphLines.join('\n'))

		// PART 3: LAST COMMIT

		let lastDevCommit = await getLastDevCommit()

		replace("{{commit-hash}}", `[\`${lastDevCommit.substring(0, 7)}\`](https://github.com/Hans5958/Hans5958/commit/${lastDevCommit})`)

		// RETURN

		return { readme: file, timestamp: gmtTime }

	} catch (error) {

		throw error

	}

}

export default print
