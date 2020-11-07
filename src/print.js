// import time
// import requests
// import os.path

const fs = require("fs")
const axios = require("axios").default
const dayjs = require("dayjs")
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/timezone'))

module.exports = async () => {

	// # Prepare functions

	// lines = []

	// def add_line(x): 
	// 	lines.append(x)

	// def flush_lines():
	// 	lines.clear()

	// def print_lines():
	// 	temp_lines = lines.copy()
	// 	flush_lines()
	// 	return "\n".join(temp_lines)

	let lines = []

	const addLine = line => lines.push(line)
	const flushLine = () => lines = []
	const printLines = () => {
		const returnValue = lines.join("\r\n")
		flushLine()
		return returnValue
	}

	// # Time

	// gmt_00 = time.gmtime().tm_hour
	// gmt_07 = gmt_00 + 7

	// if gmt_07 > 23: gmt_07 -= 24

	// if gmt_07 == 0: h12 = "12am"
	// elif gmt_07 < 12: h12 = f"{gmt_07}am"
	// elif gmt_07 == 12: h12 = "12pm"
	// else: h12 = f"{gmt_07-12}pm"

	// if len(str(gmt_07)) == 1: h24 = f"0{gmt_07}"
	// else: h24 = gmt_07

	// if gmt_07 > 6 and gmt_07 < 19: emoji = ":sunny:"
	// else: emoji = ":crescent_moon:"

	const gmtTime = dayjs().utc()
	const localTime = dayjs().tz("Asia/Jakarta")

	const gmt00 = gmtTime.hour()
	const gmt07 = localTime.hour()

	const h12 = localTime.format('ha')
	const h24 = localTime.format('HH')

	let emoji

	if (gmt07 > 6 && gmt07 < 19) emoji = ":sunny:"
	else emoji = ":crescent_moon:"

	// # Commits and events

	// commits = []
	// events = []

	const commits = []
	const events = [];

	// responseReq = requests.get('https://api.github.com/users/Hans5958/events/public')
	// response = responseReq.json()

	// for event in response:
	// 	repo_link = f'https://github.com/{event["repo"]["name"]}'
	// 	repo_link_md = f'[{event["repo"]["name"]}]({repo_link})'
	// 	payload = event["payload"]
	// 	type = event["type"]
		
	// 	timestamp = event["created_at"]
		
	// 	if type == "CreateEvent":
	// 		events.append(f'Created {payload["ref_type"]} `{payload["ref"]}` on {repo_link_md} ({timestamp})')
		
	// 	elif type == "DeleteEvent":
	// 		events.append(f'Deleted {payload["ref_type"]} `{payload["ref"]}` on {repo_link_md} ({timestamp})')
			
	// 	elif type == "ForkEvent":
	// 		events.append(f'Made fork of {repo_link_md} on [{payload["forkee"]["full_name"]}](https://github.com/{payload["forkee"]["full_name"]}) ({timestamp})')
		
	// 	elif type == "GollumEvent":
	// 		events.append(f'Updated wiki on {repo_link_md} ({timestamp})')
		
	// 	elif type == "IssueCommentEvent":
	// 		issue_number = payload["issue"]["number"]
	// 		events.append(f'{payload["action"].capitalize()} comment on issue/PR [#{issue_number}]({repo_link}/issues/{issue_number}) on {repo_link_md} ({timestamp})')
		
	// 	elif type == "IssuesEvent":
	// 		issue_number = payload["issue"]["number"]
	// 		events.append(f'{payload["action"].capitalize()} issue [#{issue_number}]({repo_link}/issues/{issue_number}) on {repo_link_md} ({timestamp})')

	// 	elif type == "PullRequestEvent":
	// 		pr_number = payload["pull_request"]["number"]
	// 		events.append(f'{payload["action"].capitalize()} pull request [#{pr_number}]({repo_link}/issues/{pr_number}) on {repo_link_md} ({timestamp})')
		
	// 	elif type == "PullRequestReviewCommentEvent":
	// 		pr_number = payload["pull_request"]["number"]
	// 		events.append(f'{payload["action"].capitalize()} comment on a review on PR [#{pr_number}]({repo_link}/issues/{pr_number}) on {repo_link_md} ({timestamp})')
		
	// 	elif type == "PublicEvent":
	// 		events.append(f'Made repo {repo_link_md} public ({timestamp})')
		
	// 	elif type == "PushEvent":
	// 		# events.append(f'Pushed commits on {repo_link_md} ({timestamp})')
	// 		branch = payload["ref"][11:]
	// 		for commit in payload["commits"]:
	// 			if commit["author"]["name"] == "Hans5958":
	// 				hash = commit['sha']
	// 				commits.append(f"[`{hash[:7]}`]({repo_link}/commit/{hash}) {commit['message'].splitlines()[0]} ({repo_link_md}, [{branch}]({repo_link}/tree/{branch}))")
		
	// 	elif type == "ReleaseEvent":
	// 		events.append(f'{payload["action"].capitalize()} version ({payload["release"]["tag_name"]}) on {repo_link_md} ({timestamp})')
		
	// 	elif type == "WatchEvent":
	// 		events.append(f'{payload["action"].capitalize()} {repo_link_md} ({timestamp})')
		
	// 	else: # MemberEvent and SponsorEvent not supported
	// 		events.append(f'{type} on {repo_link_md} ({timestamp})')

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
				events.push(`${capitalizeFirstLetter(payload.action)} ${repoLinkMd} (${timestamp}`)
				break;
			default:
				// MemberEvent and SponsorEvent not supported
				events.push(`${type} on ${repoLinkMarkdown} (${timestamp})`)
				break;
		}
	})

	// # Get last dev commit

	// if os.path.isfile("../last-dev-commit.txt"):
	// 	last_dev_commit = open("../last-dev-commit.txt", "r").read().rstrip()
	// else: 
	// 	responseReq = requests.get('https://api.github.com/repos/Hans5958/Hans5958/branches/dev')
	// 	response = responseReq.json()
	// 	last_dev_commit = response["commit"]["sha"]
	// 	with open("../last-dev-commit.txt", "w") as f:
	// 		f.write(last_dev_commit)

	let lastDevCommit

	if (fs.existsSync("last-dev-commit.txt")) {
		lastDevCommit = fs.readFileSync("last-dev-commit.txt", "utf8")

	} else {
		response = (await axios.get("https://api.github.com/repos/Hans5958/Hans5958/branches/dev")).data
		lastDevCommit = response.commit.sha
		fs.writeFileSync("last-dev-commit.txt", lastDevCommit)

	}

	// # Replacing

	// with open('base.md', 'r') as f:
	// 	file = f.read()
	// 	def replace(replace_string, to_string): 
	// 		global file	
	// 		file = file.replace(replace_string, to_string)

	let file = fs.readFileSync("src/base.md", "utf8") + ""

	const replace = (from, to) => {
		file = file.replace(from, to)
	}
		
	// 	replace("{{hour-24}}", str(h24))
	// 	replace("{{hour-12}}", str(h12))
	// 	replace("{{time-emoji}}", emoji)

	replace("{{hour-24}}", h24)
	replace("{{hour-12}}", h12)
	replace("{{time-emoji}}", emoji)

	// 	if gmt_07 < 7:
	// 		replace("{{status-from-time}}", "*There is a great chance that I'm offline, so I'm sorry that I can't respond to you currently.*")
	// 	elif gmt_07 < 9:
	// 		replace("{{status-from-time}}", "*I will will be online in a few hours or so.*") 
	// 	elif gmt_07 < 22:
	// 		replace("{{status-from-time}}", "*I'm online, doing stuff, and is able to respond to inquiries.*")
	// 	else:
	// 		replace("{{status-from-time}}", "*I'm online, but only if I'm on a weekend, or there's nothing to do tommorow morning.*")

	if (gmt07 < 7) replace("{{status-from-time}}", "*There is a great chance that I'm offline, so I'm sorry that I can't respond to you currently.*")
	else if (gmt07 < 9) replace("{{status-from-time}}", "*I will will be online in a few hours or so.*") 
	else if (gmt07 < 22) replace("{{status-from-time}}", "*I'm online, doing stuff, and is able to respond to inquiries.*")
	else replace("{{status-from-time}}", "*I'm online, but only if I'm on a weekend, or there's nothing to do tommorow morning.*")

	// 	for line in commits[:10]:
	// 		add_line(f"- {line}")
	// 	replace("{{last-commits}}", print_lines())

	commits.splice(0, 10).forEach(line => addLine("- " + line))
	replace("{{last-commits}}", printLines())

	// 	for line in events[:10]:
	// 		add_line(f"- {line}")
	// 	replace("{{last-events}}", print_lines())

	events.splice(0, 10).forEach(line => addLine("- " + line))
	replace("{{last-events}}", printLines())

	// 	replace("{{last-updated}}", time.strftime('%d/%m/%Y, %H:%M:%S UTC', time.localtime()))
	// 	replace("{{commit-hash}}", f"[`{last_dev_commit[:7]}`](https://github.com/Hans5958/Hans5958/commit/{last_dev_commit})")

	replace("{{last-updated}}", gmtTime.format("DD/MM/YYYY, HH:mm:ss UTC"))
	replace("{{commit-hash}}", `[\`${lastDevCommit.substr(0, 7)}\`](https://github.com/Hans5958/Hans5958/commit/${lastDevCommit})`)

	// with open("../README.md", "w", encoding="utf-8") as f:
	// 	f.write(file)

	return {readme: file, timestamp: gmtTime}

}
