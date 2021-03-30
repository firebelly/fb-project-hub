from fabric import task
from invoke import run as local

remote_path = "/home/firebelly/apps/fb-project-hub/fb-project-hub"
remote_hosts = ["firebelly@firebelly.opalstacked.com"]
git_branch = "deploy"

# deploy
@task(hosts=remote_hosts)
def deploy(c):
    update(c)
    restart(c)

def update(c):
    c.run("cd {} && git fetch --all && git checkout --force origin/{}".format(remote_path, git_branch))
    c.run("cd {} && npm install &>/dev/null".format(remote_path))

def restart(c):
    c.run("cd {} && ../stop".format(remote_path))
    c.run("cd {} && ../start".format(remote_path))

# local commands
@task
def prepare(c):
    local("npx sails run deploy")
