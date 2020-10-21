from fabric.api import *
import os

env.hosts = ['firebelly.opalstacked.com']
env.user = 'firebelly'
env.path = '~/Firebelly/fb-project-hub'
env.remotepath = '/home/firebelly/apps/fb-project-hub/fb-project-hub'
env.git_branch = 'deploy'
env.warn_only = True

def deploy():
  update()
  restart()

def prepare():
  local('npx sails run deploy')

def update():
  with cd(env.remotepath):
    run('git fetch --all && git checkout --force origin/{0}'.format(env.git_branch))

def restart():
  with cd(env.remotepath):
    run('../stop')
    run('../start')
