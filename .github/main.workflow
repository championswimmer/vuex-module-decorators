workflow "Build, Test (and Publish on Tag)" {
  resolves = [
    "Publish",
    "JamesIves/github-pages-deploy-action@master",
  ]
  on = "push"
}

action "Build" {
  uses = "actions/npm@master"
  args = "install"
}

action "Test" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "test"
}

# Filter for a new tag
action "Tag" {
  needs = "Test"
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "Publish" {
  needs = "Tag"
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}

action "JamesIves/github-pages-deploy-action@master" {
  uses = "JamesIves/github-pages-deploy-action@master"
  needs = ["Test"]
  env = {
    BUILD_SCRIPT = "npm run docs:build"
    BRANCH = "gh-pages"
    FOLDER = "docs/.vuepress/dist"
  }
  secrets = [
    "ACCESS_TOKEN",
  ]
}
