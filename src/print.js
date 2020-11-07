const fs = require("fs")
const axios = require("axios").default
const dayjs = require("dayjs")
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/timezone'))

module.exports = async () => {

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

		// Time

		const gmtTime = dayjs().utc()
		const localTime = dayjs().tz("Asia/Jakarta")

		const gmt00 = gmtTime.hour()
		const gmt07 = localTime.hour()

		const h12 = localTime.format('ha')
		const h24 = localTime.format('HH')

		let emoji

		if (gmt07 > 6 && gmt07 < 19) emoji = ":sunny:"
		else emoji = ":crescent_moon:"

		// Commits and events

		const commits = []
		const events = [];

		let response

		response = (await axios.get("https://api.github.com/users/Hans5958/events/public")).data

		response.forEach(ghEvent => {
			const repoLink = `https://github.com/${ghEvent.repo.name}`
			const repoLinkMarkdown = `[${ghEvent.repo.name}](${repoLink})`
			const payload = ghEvent.payload
			const type = ghEvent.type
			const timestamp = ghEvent.created_at
			let issueNumber, prNumber
			const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)

			switch (type) {
				case "CreateEvent":
					events.push(`Created ${payload.ref_type} \`${payload.ref}\` on ${repoLinkMarkdown} (${timestamp})`)
					break;
				case "DeleteEvent":
					events.push(`Deleted ${payload.ref_type} \`${payload.ref}\` on ${repoLinkMarkdown} (${timestamp})`)
					break;
				case "ForkEvent":
					events.push(`Made fork of ${repoLinkMarkdown} on [${payload.forkee.full_name}](https://github.com/${payload.forkee.full_name}) (${timestamp})`)
					break;
				case "GollumEvent":
					events.push(`Updated wiki on ${repoLinkMarkdown} (${timestamp})`)
					break;
				case "IssueCommentEvent":
					issueNumber = payload.issue.number
					events.push(`${capitalizeFirstLetter(payload.action)} comment on issue/PR [#${issueNumber}](${repoLink}/issues/${issueNumber}) on ${repoLinkMarkdown} (${timestamp})`)
					break;
				case "IssuesEvent":
					issueNumber = payload.issue.number
					events.push(`${capitalizeFirstLetter(payload.action)} issue [#${issueNumber}](${repoLink}/issues/${issueNumber}) on ${repoLinkMarkdown} (${timestamp})`)
					break;
				case "PullRequestEvent":
					prNumber = payload.pull_request.number
					events.push(`${capitalizeFirstLetter(payload.action)} pull request [#${prNumber}](${repoLink}/issues/${prNumber}) on ${repoLinkMarkdown} (${timestamp})`)
					break;
				case "PullRequestReviewCommentEvent":
					prNumber = payload.pull_request.number
					events.push(`${capitalizeFirstLetter(payload.action)} comment on a review on PR [#${prNumber}](${repoLink}/issues/${prNumber}) on ${repoLinkMarkdown} (${timestamp})`)
					break;
				case "PublicEvent":
					events.push(`Made repo ${repoLinkMarkdown} public (${timestamp})`)
					break;
				case "PushEvent":
					const branch = payload.ref.slice(11)
					payload.commits.forEach(commit => {
						if (commit.author.name === "Hans5958") {
							const hash = commit.sha
							commits.push(`[\`${hash.substr(0, 7)}\`](${repoLink}/commit/${hash}) ${commit['message'].split("\n")[0]} (${repoLinkMarkdown}, [${branch}](${repoLink}/tree/${branch}))`)
						}
					})
					break;
				case "ReleaseEvent":
					events.push(`${capitalizeFirstLetter(payload.action)} version (${payload.release.tag_name}) on ${repoLinkMarkdown} (${timestamp})`)
					break;
				case "WatchEvent":
					events.push(`${capitalizeFirstLetter(payload.action)} ${repoLinkMarkdown} (${timestamp}`)
					break;
				default:
					// MemberEvent and SponsorEvent not supported
					events.push(`${type} on ${repoLinkMarkdown} (${timestamp})`)
					break;
			}
		})

		// Get last dev commit

		let lastDevCommit

		if (fs.existsSync("last-dev-commit.txt")) {
			lastDevCommit = fs.readFileSync("last-dev-commit.txt", "utf8")

		} else {
			const result = await require('child-process-promise').exec("git rev-parse HEAD")
			const { stdout } = result
			lastDevCommit = stdout
			fs.writeFileSync("last-dev-commit.txt", lastDevCommit)
			

		}

		// Replacing

		let file = fs.readFileSync("src/base.md", "utf8") + ""

		const replace = (from, to) => {
			file = file.replace(from, to)
		}

		replace("{{hour-24}}", h24)
		replace("{{hour-12}}", h12)
		replace("{{time-emoji}}", emoji)

		if (gmt07 < 7) replace("{{status-from-time}}", "*There is a great chance that I'm offline, so I'm sorry that I can't respond to you currently.*")
		else if (gmt07 < 9) replace("{{status-from-time}}", "*I will will be online in a few hours or so.*")
		else if (gmt07 < 22) replace("{{status-from-time}}", "*I'm online, doing stuff, and is able to respond to inquiries.*")
		else replace("{{status-from-time}}", "*I'm online, but only if I'm on a weekend, or there's nothing to do tommorow morning.*")

		commits.splice(0, 10).forEach(line => addLine("- " + line))
		replace("{{last-commits}}", printLines())

		events.splice(0, 10).forEach(line => addLine("- " + line))
		replace("{{last-events}}", printLines())

		replace("{{last-updated}}", gmtTime.format("DD/MM/YYYY, HH:mm:ss UTC"))
		replace("{{commit-hash}}", `[\`${lastDevCommit.substr(0, 7)}\`](https://github.com/Hans5958/Hans5958/commit/${lastDevCommit})`)

		return { readme: file, timestamp: gmtTime }

	} catch (error) {

		throw error

	}

}
