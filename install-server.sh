#!/bin/bash

set -eu

echo "Installing express dependencies..."
cd server
yarn install
