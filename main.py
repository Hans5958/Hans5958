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
addline("[Website](https://hans5958.me) :black_medium_square: [YouTube](https://youtube.com/Hans5958) :black_medium_square: [Twitter](https://twitter.com/Hans5958) :black_medium_square: [Keybase](https://keybase.io/hans5958)")
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
	if event["type"] == "PushEvent":
		events.append(f'Pushed commits on [{event["repo"]["name"]}]({event["repo"]["url"]}) ({event["created_at"]})')
		for commit in event["payload"]["commits"]:
			commits.append(f"{commit['sha']} {commit['message'].splitlines()[0]}")
	elif event["type"] == "IssuesEvent":
		events.append(f'Created issue "({event["payload"]["issue"]["title"]})" on [{event["repo"]["name"]}]({event["repo"]["url"]} ({event["created_at"]})')
	elif event["type"] == "PullRequestEvent":
		events.append(f'Created pull request "({event["payload"]["pull_request"]["title"]})" on [{event["repo"]["name"]}]({event["repo"]["url"]} ({event["created_at"]})')
	elif event["type"] == "IssuesEvent":
		events.append(f'Created issue "({event["payload"]["issue"]["title"]})" on [{event["repo"]["name"]}]({event["repo"]["url"]} ({event["created_at"]})')
	elif event["type"] == "IssueCommentEvent":
		events.append(f'Left comment on issue/PR "({event["payload"]["issue"]["title"]})" on [{event["repo"]["name"]}]({event["repo"]["url"]} ({event["created_at"]})')
	elif event["type"] == "ReleaseEvent":
		events.append(f'Released version "({event["payload"]["release"]["tag_name"]})" on [{event["repo"]["name"]}]({event["repo"]["url"]} ({event["created_at"]})')
	else:
		events.append(f'{event["type"]} on [{event["repo"]["name"]}]({event["repo"]["url"]} ({event["created_at"]})')

addline("### Last five commits")
addline("")

for line in commits[:5]:
	addline(f"- {line}")
	
addline("### Last five events")
addline("")

for line in events[:5]:
	addline(f"- {line}")
	
addline("")
addline("</details>")
addline("")
addline(f"*Last updated: {time.strftime('%m/%d/%Y, %H:%M:%S UTC', time.localtime())}*")

print("\n".join(lines))