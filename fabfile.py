from fabric.api import *
import os

env.hosts = ['hub.firebelly.co']
env.user = 'firebelly'
env.path = '~/Firebelly/fb-project-hub'
env.remotepath = '/home/firebelly/webapps/fb_project_hub/fb-project-hub'
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
  # SCP fonts
  put('assets/fonts', env.remotepath + '.www/dist/fonts/')

def restart():
  with cd(env.remotepath):
    run('../bin/stop')
    run('../bin/start')
