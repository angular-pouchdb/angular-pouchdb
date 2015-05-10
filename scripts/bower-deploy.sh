#!/usr/bin/env bash
set -e

info() { echo "$0: $1"; }
error() { info "$1"; exit 1; }

[[ "$TRAVIS" ]] || error "Please run this script in TravisCI"
[[ "$TRAVIS_TAG" ]] || error "Only deploying tagged builds"
[[ "$TRAVIS_PULL_REQUEST" == "false" ]] || error "Not deploying pull requests"

git clone https://github.com/angular-pouchdb/bower-angular-pouchdb.git deploy
mv bower.json README.md LICENSE.md dist/* deploy
cd deploy
git add .
git config user.email "angular-pouchdb-ci@tlvince.com"
git config user.name "Angular PouchDB CI"
git commit --all --message "$TRAVIS_TAG"
git tag "$TRAVIS_TAG"
echo -e "machine github.com\n  login $CI_USER_TOKEN" >> ~/.netrc
git push --tags origin master
