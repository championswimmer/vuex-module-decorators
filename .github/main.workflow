workflow "Publish to NPM" {
  resolves = ["GitHub Action for npm"]
  on = "release"
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
}
