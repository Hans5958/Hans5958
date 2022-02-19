const fs = require("fs")
// const axios = require("axios").default
const dayjs = require("dayjs")
const { Octokit } = require("@octokit/rest")
const { timeEnd } = require("console")
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/timezone'))


module.exports = async () => {
	const octokit = new Octokit()

	const commits = []
	const events = []
	const timeline = []
	const timelineSimplified = []
	const activityGraphLines = []
	let mostEvents = 0

	
	// let response = JSON.parse(fs.readFileSync('data.json'))

	let response = (await octokit.activity.listPublicEventsForUser({
		username: "Hans5958",
		per_page: 100
	})).data
	
	// fs.writeFileSync('data.json', JSON.stringify(response))

	currentDate = dayjs()
	lastDate = dayjs(response[response.length - 1].created_at)

	// response = (await axios.get("https://api.github.com/users/Hans5958/events/public")).data

	response.forEach(ghEvent => {
		const repoLink = `https://github.com/${ghEvent.repo.name}`
		const repoLinkMarkdown = `[${ghEvent.repo.name}](${repoLink})`
		const payload = ghEvent.payload
		const type = ghEvent.type
		const timestamp = ghEvent.created_at
		const date = dayjs(timestamp)
		
		timeline.push((date - lastDate)/(currentDate - lastDate))
		// console.log((date - lastDate)/(currentDate - lastDate))
		let issueNumber, prNumber
		const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)

		switch (type) {
			case "CreateEvent":
				if (payload.ref_type === "repository") events.push(`Created ${payload.ref_type} ${repoLinkMarkdown} (${timestamp})`)
				else if (payload.ref === null) events.push(`Created ${payload.ref_type} on ${repoLinkMarkdown} (${timestamp})`)
				else events.push(`Created ${payload.ref_type} \`${payload.ref}\` on ${repoLinkMarkdown} (${timestamp})`)
				break;
			case "DeleteEvent":
				if (payload.ref_type === "repository") events.push(`Deleted ${payload.ref_type} ${repoLinkMarkdown} (${timestamp})`)
				else if (payload.ref === null) events.push(`Deleted ${payload.ref_type} on ${repoLinkMarkdown} (${timestamp})`)
				else events.push(`Deleted ${payload.ref_type} \`${payload.ref}\` on ${repoLinkMarkdown} (${timestamp})`)
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
			case "PullRequestReviewEvent":
				prNumber = payload.pull_request.number
				events.push(`${capitalizeFirstLetter(payload.action)} review on PR [#${prNumber}](${repoLink}/issues/${prNumber}) on ${repoLinkMarkdown} (${timestamp})`)
				break;
			case "PublicEvent":
				events.push(`Made repo ${repoLinkMarkdown} public (${timestamp})`)
				break;
			case "PushEvent":
				const branch = payload.ref.slice(11)
				payload.commits.reverse().forEach(commit => {
					if (commit.author.name === "Hans5958") {
						const hash = commit.sha
						commits.push(`[\`${hash.substr(0, 7)}\`](${repoLink}/commit/${hash}) ${commit['message'].split("\n")[0]} (${repoLinkMarkdown}, [${branch}](${repoLink}/tree/${branch}))`)
					}
				})
				break;
			case "ReleaseEvent":
				events.push(`${capitalizeFirstLetter(payload.action)} version \`${payload.release.tag_name}\` on ${repoLinkMarkdown} (${timestamp})`)
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

	for (let i = 0; i < 80; i++) {
		timelineSimplified[i] = 0
	}

	timeline.forEach(time => {
		timelineSimplified[Math.round(time*79)]++
		if (timelineSimplified[Math.round(time*79)] > mostEvents)
			mostEvents = timelineSimplified[Math.round(time*79)]
	})

	console.log(mostEvents)

	const scale = 4

	const dateScales = [
		dayjs(lastDate),
		dayjs(lastDate + (currentDate - lastDate) * 0.2),
		dayjs(lastDate + (currentDate - lastDate) * 0.4),
		dayjs(lastDate + (currentDate - lastDate) * 0.6),
		dayjs(lastDate + (currentDate - lastDate) * 0.8),
	]

	for (let i = Math.ceil(mostEvents*scale/8); i > -1; i--) {
		let line = [...timelineSimplified].map(events => {
			// console.log(Math.ceil(mostEvents/8))
			if (i*8 <= Math.ceil(events*scale)) {
				if (Math.ceil(events*scale) - i*8 >= 8) {
					return '█'
				}
				return ' ▁▂▃▄▅▆▇'.split('')[Math.ceil(events*scale) - i*8]
			} else {
				return ' '
			}
		}).join('')
		activityGraphLines.push(line)
	}
	// console.log('▔'.repeat(80))
	activityGraphLines.push([...dateScales].map(date => date.format('DD/MM/YYYY          ')).join('') + 'Now')
	activityGraphLines.push([...dateScales].map(date => date.format('HH:MM               ')).join(''))
	// console.log(timelineSimplified)

	// timelineSimplified.forEach(time => {
	// 	console.log('█'.repeat(time))
	// })

	return {commits, events, activityGraphLines}
}