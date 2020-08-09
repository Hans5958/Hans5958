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
addline("[![Website: hans5958.me]](https://hans5958.me) [![Blog: blog.hans5958.me]](https://blog.hans5958.me)  ")
addline("[![YouTube: Hans5958]](https://youtube.com/Hans5958) [![Twitter: hans5958]](https://twitter.com/Hans5958) ![Discord: Hans5958#0969] [![GitHub: hans5958]](https://github.com/Hans5958) [![GitLab: hans5958]](https://gitlab.com/Hans5958) [![dev.to: Hans5958]](https://dev.to/hans5958) [![Keybase: hans5958]](https://keybase.io/hans5958)  [![Email: go to GitHub]](https://github.com/hans5958)")
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
addline(f"*Last updated: {time.strftime('%d/%m/%Y, %H:%M:%S UTC', time.localtime())}*")
addline('<a href="https://github.com/Hans5958/Hans5958/actions?query=workflow%3ABuild"><img src="https://img.shields.io/github/workflow/status/Hans5958/Hans5958/Build?style=flat-square" align="right" style="margin-left:0.2rem"></a>')
addline('<img src="https://img.shields.io/badge/dynamic/json?color=brightgreen&label=hits&query=%24.value&url=https%3A%2F%2Fapi.countapi.xyz%2Fhit%2Fvisitor-badge%2FHans5958.Hans5958&style=flat-square" align="right">')
addline("")
addline("[Website: hans5958.me]: https://img.shields.io/badge/main-hans5958.me-black?style=flat-square&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4wICg0MDM1YTRmYjQ5LCAyMDIwLTA1LTAxKSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iZWFydGguc3ZnIgogICBpZD0ic3ZnNiIKICAgdmlld0JveD0iMCAwIDE2IDE2IgogICBoZWlnaHQ9IjE2IgogICB3aWR0aD0iMTYiCiAgIHZlcnNpb249IjEuMSI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTIiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxMCIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnNiIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iLTgiCiAgICAgaW5rc2NhcGU6Y3k9IjgiCiAgICAgaW5rc2NhcGU6Y3g9IjgiCiAgICAgaW5rc2NhcGU6em9vbT0iMzMuNjI1IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpZD0ibmFtZWR2aWV3OCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI3MDUiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxMzY2IgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiIC8+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMiI+ZWFydGg8L3RpdGxlPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZiIKICAgICBpZD0icGF0aDQiCiAgICAgZD0iTTggMGMtNC40MTggMC04IDMuNTgyLTggOHMzLjU4MiA4IDggOCA4LTMuNTgyIDgtOC0zLjU4Mi04LTgtOHpNOCAxNWMtMC45ODQgMC0xLjkyLTAuMjAzLTIuNzY5LTAuNTdsMy42NDMtNC4wOThjMC4wODEtMC4wOTIgMC4xMjYtMC4yMSAwLjEyNi0wLjMzMnYtMS41YzAtMC4yNzYtMC4yMjQtMC41LTAuNS0wLjUtMS43NjUgMC0zLjYyOC0xLjgzNS0zLjY0Ni0xLjg1NC0wLjA5NC0wLjA5NC0wLjIyMS0wLjE0Ni0wLjM1NC0wLjE0NmgtMmMtMC4yNzYgMC0wLjUgMC4yMjQtMC41IDAuNXYzYzAgMC4xODkgMC4xMDcgMC4zNjMgMC4yNzYgMC40NDdsMS43MjQgMC44NjJ2Mi45MzZjLTEuODEzLTEuMjY1LTMtMy4zNjYtMy01Ljc0NSAwLTEuMDc0IDAuMjQyLTIuMDkxIDAuNjc0LTNoMS44MjZjMC4xMzMgMCAwLjI2LTAuMDUzIDAuMzU0LTAuMTQ2bDItMmMwLjA5NC0wLjA5NCAwLjE0Ni0wLjIyMSAwLjE0Ni0wLjM1NHYtMS4yMWMwLjYzNC0wLjE4OSAxLjMwNS0wLjI5IDItMC4yOSAxLjEgMCAyLjE0MSAwLjI1NCAzLjA2NyAwLjcwNi0wLjA2NSAwLjA1NS0wLjEyOCAwLjExMi0wLjE4OCAwLjE3Mi0wLjU2NyAwLjU2Ny0wLjg3OSAxLjMyLTAuODc5IDIuMTIxczAuMzEyIDEuNTU1IDAuODc5IDIuMTIxYzAuNTY5IDAuNTY5IDEuMzMyIDAuODc5IDIuMTE5IDAuODc5IDAuMDQ5IDAgMC4wOTktMC4wMDEgMC4xNDktMC4wMDQgMC4yMTYgMC44MDkgMC42MDUgMi45MTctMC4xMzEgNS44MTgtMC4wMDcgMC4wMjctMC4wMTEgMC4wNTUtMC4wMTMgMC4wODItMS4yNzEgMS4yOTgtMy4wNDIgMi4xMDQtNS4wMDIgMi4xMDR6IiAvPgo8L3N2Zz4K")
addline("[Blog: blog.hans5958.me]: https://img.shields.io/badge/blog-blog.hans5958.me-black?style=flat-square&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4wICg0MDM1YTRmYjQ5LCAyMDIwLTA1LTAxKSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iZWFydGguc3ZnIgogICBpZD0ic3ZnNiIKICAgdmlld0JveD0iMCAwIDE2IDE2IgogICBoZWlnaHQ9IjE2IgogICB3aWR0aD0iMTYiCiAgIHZlcnNpb249IjEuMSI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTIiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxMCIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnNiIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iLTgiCiAgICAgaW5rc2NhcGU6Y3k9IjgiCiAgICAgaW5rc2NhcGU6Y3g9IjgiCiAgICAgaW5rc2NhcGU6em9vbT0iMzMuNjI1IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpZD0ibmFtZWR2aWV3OCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI3MDUiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxMzY2IgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiIC8+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMiI+ZWFydGg8L3RpdGxlPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZiIKICAgICBpZD0icGF0aDQiCiAgICAgZD0iTTggMGMtNC40MTggMC04IDMuNTgyLTggOHMzLjU4MiA4IDggOCA4LTMuNTgyIDgtOC0zLjU4Mi04LTgtOHpNOCAxNWMtMC45ODQgMC0xLjkyLTAuMjAzLTIuNzY5LTAuNTdsMy42NDMtNC4wOThjMC4wODEtMC4wOTIgMC4xMjYtMC4yMSAwLjEyNi0wLjMzMnYtMS41YzAtMC4yNzYtMC4yMjQtMC41LTAuNS0wLjUtMS43NjUgMC0zLjYyOC0xLjgzNS0zLjY0Ni0xLjg1NC0wLjA5NC0wLjA5NC0wLjIyMS0wLjE0Ni0wLjM1NC0wLjE0NmgtMmMtMC4yNzYgMC0wLjUgMC4yMjQtMC41IDAuNXYzYzAgMC4xODkgMC4xMDcgMC4zNjMgMC4yNzYgMC40NDdsMS43MjQgMC44NjJ2Mi45MzZjLTEuODEzLTEuMjY1LTMtMy4zNjYtMy01Ljc0NSAwLTEuMDc0IDAuMjQyLTIuMDkxIDAuNjc0LTNoMS44MjZjMC4xMzMgMCAwLjI2LTAuMDUzIDAuMzU0LTAuMTQ2bDItMmMwLjA5NC0wLjA5NCAwLjE0Ni0wLjIyMSAwLjE0Ni0wLjM1NHYtMS4yMWMwLjYzNC0wLjE4OSAxLjMwNS0wLjI5IDItMC4yOSAxLjEgMCAyLjE0MSAwLjI1NCAzLjA2NyAwLjcwNi0wLjA2NSAwLjA1NS0wLjEyOCAwLjExMi0wLjE4OCAwLjE3Mi0wLjU2NyAwLjU2Ny0wLjg3OSAxLjMyLTAuODc5IDIuMTIxczAuMzEyIDEuNTU1IDAuODc5IDIuMTIxYzAuNTY5IDAuNTY5IDEuMzMyIDAuODc5IDIuMTE5IDAuODc5IDAuMDQ5IDAgMC4wOTktMC4wMDEgMC4xNDktMC4wMDQgMC4yMTYgMC44MDkgMC42MDUgMi45MTctMC4xMzEgNS44MTgtMC4wMDcgMC4wMjctMC4wMTEgMC4wNTUtMC4wMTMgMC4wODItMS4yNzEgMS4yOTgtMy4wNDIgMi4xMDQtNS4wMDIgMi4xMDR6IiAvPgo8L3N2Zz4K")
addline("[YouTube: Hans5958]: https://img.shields.io/badge/-Hans5958-FF0000?logo=youtube&logoColor=white&style=flat-square")
addline("[Twitter: hans5958]: https://img.shields.io/badge/-Hans5958-1DA1F2?logo=twitter&logoColor=white&style=flat-square")
addline("[Discord: Hans5958#0969]: https://img.shields.io/badge/-Hans5958%230969-7289DA?logo=discord&logoColor=white&style=flat-square")
addline("[GitHub: hans5958]: https://img.shields.io/badge/-Hans5958-181717?logo=github&logoColor=white&style=flat-square")
addline("[GitLab: hans5958]: https://img.shields.io/badge/-Hans5958-292961?logo=gitlab&logoColor=white&style=flat-square")
addline("[dev.to: hans5958]: https://img.shields.io/badge/-Hans5958-0A0A0A?logo=dev.to&logoColor=white&style=flat-square")
addline("[Keybase: hans5958]: https://img.shields.io/badge/-hans5958-33A0FF?logo=keybase&logoColor=white&style=flat-square")
addline("[Email: go to GitHub]: https://img.shields.io/badge/-go%20to%20GitHub-D14836?logo=gmail&logoColor=white&style=flat-square")

print("\n".join(lines))