workflow "Build and Test" {
  resolves = [
    "Test",
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

workflow "NPM and Docs Publish" {
  resolves = [
    "Github Pages",
    "Publish",
  ]
  on = "release"
}

action "Github Pages" {
  uses = "JamesIves/github-pages-deploy-action@master"
  env = {
    BUILD_SCRIPT = "npm install && npm run docs:build"
    BRANCH = "gh-pages"
    FOLDER = "docs/.vuepress/dist"
  }
  secrets = [
    "ACCESS_TOKEN",
  ]
}

action "Build for Publish" {
  uses = "actions/npm@master"
  args = "build"
}

action "Publish" {
  uses = "actions/npm@master"
  args = "publish --access publish"
  secrets = ["NPM_AUTH_TOKEN"]
  needs = ["Build for Publish"]
}
