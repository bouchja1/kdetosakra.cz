# source: https://gist.github.com/mpneuried/0594963ad38e68917ef189b4e6a269db
# USAGE
# Build the container - make build
# Build and publish the container - make release
# Publish a container to private registry (includes the login to the repo) - make publish
# Run the container - make run
# Build an run the container - make up
# Stop the running container - make stop

dpl ?= .env
include $(dpl)
export $(shell sed 's/=.*//' $(dpl))

# grep the version from the mix file
VERSION=$(shell cd ./ && git describe --tags --abbrev=0)

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

# DOCKER TASKS
# Build the container
build: ## Build the container
	docker build -t $(APP_NAME) .

run: ## Run container on port configured in `config.env`
	docker run -i -t --rm --env-file=./.env -p=$(PORT):$(PORT) --name="$(APP_NAME)" $(APP_NAME)

up: build run ## Run container on port configured in `config.env` (Alias to run)

stop: ## Stop and remove a running container
	docker stop $(APP_NAME); docker rm $(APP_NAME)

# Docker release - build, tag and push the container
release: build publish ## Make a release by building and publishing the `{version}` ans `latest` tagged containers to registry

release-dev: build publish-latest ## Make a release by building and publishing the `{version}` ans `latest` tagged containers to registry

release-version: build publish-version ## Make a release by building and publishing the `{version}` ans `latest` tagged containers to registry

# Docker publish
publish: publish-latest publish-version ## Publish the `{version}` ans `latest` tagged containers to registry

publish-latest: tag-latest ## Publish the `latest` taged container to ECR
	@echo 'publish latest to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(DOCKER_REPO_USERNAME)/$(APP_NAME):latest

publish-version: tag-version ## Publish the `{version}` taged container to ECR
	@echo 'publish $(VERSION) to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(DOCKER_REPO_USERNAME)/$(APP_NAME):$(VERSION)

# Docker tagging
tag: tag-latest tag-version ## Generate container tags for the `{version}` ans `latest` tags

tag-latest: ## Generate container `{version}` tag
	@echo 'create tag latest'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(DOCKER_REPO_USERNAME)/$(APP_NAME):latest

tag-version: ## Generate container `latest` tag
	@echo 'create tag $(VERSION)'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(DOCKER_REPO_USERNAME)/$(APP_NAME):$(VERSION)

version: ## Output the current version
	@echo $(VERSION)
