import time
import requests

gmt_00 = time.gmtime().tm_hour
gmt_07 = gmt_00 + 7

if gmt_07 < 12:
  h12 = f"{gmt_07}am"
else:
  h12 = f"{gmt_07-12}pm"

if gmt_07 > 23:
  gmt_07 -= 24

if len(str(gmt_07)) == 1:
  h24 = f"0{gmt_07}"
else:
  h24 = gmt_07

if gmt_07 > 6 and gmt_07 < 19:
  emoji = ":sunny:"
else:
  emoji = ":crescent_moon:"

lines = []

def addline(x):
  lines.append(x)

addline('<div align="center">')
addline("<h1>Welcome to my GitHub profile!</h1>")
addline("")
addline("[Website](https://hans5958.me) - [YouTube](https://youtube.com/Hans5958) - [Twitter](https://twitter.com/Hans5958) - [Keybase](https://keybase.io/hans5958)")
addline("")
addline(f"FYI: It is **{h24}:xx** (**{h12}**) in Jakarta. {emoji}  ")
if gmt_07 < 7:
  addline("*There is a great chance that I'm offline, so I'm sorry that I can't respond to you currently.*")
elif gmt_07 < 9:
  addline("*I will will be online in a few hours or so.*") 
elif gmt_07 < 22:
  addline("*I'm online, doing stuff, and is able to respond to inquiries.*")
else:
  addline("*I'm online, but only if I'm on a weekend, or there's nothing to do tommorow morning.*")

addline("</div>")
addline("")

addline("<details><summary>Read about me:</summary>")
addline("")
addline("## About me")

details_file = open("about-me.md")
details = details_file.readlines()
details_file.close()

for details_line in details:
  addline(details_line.rstrip())

addline("</details>")
addline("")

addline("<details><summary>Recent activity:</summary>")
addline("")
addline("## Recent activity")
addline("")

commits = []
events = []

responseReq = requests.get('https://api.github.com/users/Hans5958/events/public')
response = responseReq.json()

for event in response:
	repo_link = f'https://github.com/{event["repo"]["name"]}'
	repo_link_md = f'[{event["repo"]["name"]}]({repo_link})'
	timestamp = event["created_at"]
	if event["type"] == "PushEvent":
		# events.append(f'Pushed commits on {repo_link_md} ({timestamp})')
		branch = event["payload"]["ref"][11:]
		for commit in event["payload"]["commits"]:
			hash = commit['sha']
			commits.append(f"[`{hash[:7]}`]({repo_link}/commit/{hash}) {commit['message'].splitlines()[0]} ({repo_link_md}, [{branch}]({repo_link}/tree/{branch}))")
	elif event["type"] == "IssuesEvent":
		issue_number = event["payload"]["issue"]["number"]
		events.append(f'{event["payload"]["action"].capitalize()} issue [#{issue_number}]({repo_link}/issues/{issue_number}) on {repo_link_md} ({timestamp})')
	elif event["type"] == "PullRequestEvent":
		pr_number = event["payload"]["pull_request"]["number"]
		events.append(f'{event["payload"]["action"].capitalize()} pull request [#{pr_number}]({repo_link}/issues/{pr_number}) on {repo_link_md} ({timestamp})')
	elif event["type"] == "IssueCommentEvent":
		issue_number = event["payload"]["issue"]["number"]
		events.append(f'{event["payload"]["action"].capitalize()} comment on issue/PR [#{issue_number}]({repo_link}/issues/{issue_number}) on {repo_link_md} ({timestamp})')
	elif event["type"] == "ReleaseEvent":
		events.append(f'{event["payload"]["action"].capitalize()} version ({event["payload"]["release"]["tag_name"]}) on {repo_link_md} ({timestamp})')
	elif event["type"] == "PullRequestReviewCommentEvent":
		pr_number = event["payload"]["pull_request"]["number"]
		events.append(f'{event["payload"]["action"].capitalize()} comment on a review on PR [#{pr_number}]({repo_link}/issues/{pr_number}) on {repo_link_md} ({timestamp})')
	else:
		events.append(f'{event["type"]} on {repo_link_md} ({timestamp})')

addline("### Last five commits")
addline("")

for line in commits[:5]:
	addline(f"- {line}")
	
addline("")
addline("### Last five events")
addline("")

for line in events[:5]:
	addline(f"- {line}")
	
addline("")
addline("</details>")
addline("")
addline(f"*Last updated: {time.strftime('%d/%m/%Y, %H:%M:%S UTC', time.localtime())}* <a href='https://github.com/Hans5958/Hans5958/actions?query=workflow%3ABuild'><img src='https://img.shields.io/github/workflow/status/Hans5958/Hans5958/Build' align='right'></a>")

print("\n".join(lines))