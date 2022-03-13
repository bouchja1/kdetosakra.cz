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

# DOCKER TASKS
# Build the container
build: ## Build the container
	docker build -t $(APP_NAME) .

# Docker release - build, tag and push the container
release: build publish ## Make a release by building and publishing the `{version}` ans `latest` tagged containers to registry

# Docker publish
publish: publish-latest publish-version ## Publish the `{version}` ans `latest` tagged containers to registry

publish-latest: tag-latest ## Publish the `latest` taged container to ECR
	@echo 'publish latest to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(APP_NAME):latest

publish-version: tag-version ## Publish the `{version}` taged container to ECR
	@echo 'publish $(VERSION) to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(APP_NAME):$(VERSION)

# Docker tagging
tag: tag-latest tag-version ## Generate container tags for the `{version}` ans `latest` tags

tag-latest: ## Generate container `{version}` tag
	@echo 'create tag latest'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):latest

tag-version: ## Generate container `latest` tag
	@echo 'create tag $(VERSION)'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):$(VERSION)
