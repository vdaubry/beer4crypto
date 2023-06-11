#!/bin/bash

set -o pipefail

# Get script's base directory
BASE_PATH=$(dirname "$(realpath "$0")")

# Define paths
GRAPH_NODE_PATH="$BASE_PATH/../graph-node/docker"
SMART_CONTRACTS_PATH="$BASE_PATH/smart_contracts"
GRAPH_PATH="$BASE_PATH/graph"
LOGS_PATH="$BASE_PATH/logs"

# Stop any running graph node and hardhat node
pkill -f "graph"
pkill -f "hardhat"

# Start hardhat node
echo "### Starting hardhat node ###"
cd $SMART_CONTRACTS_PATH
echo "" > $LOGS_PATH/hardhat_node.log
hh node --network hardhat > "$LOGS_PATH/hardhat_node.log" 2>&1 &
if [ $? -ne 0 ]; then
    echo "Failed to start hardhat node"
    tail -n 20 "$LOGS_PATH/hardhat_node.log"
    exit 1
fi

# Start graph node
echo "### Starting graph node ###"
cd $GRAPH_NODE_PATH
echo "" > $LOGS_PATH/graph_node.log
./run-graph-node.sh > "$LOGS_PATH/graph_node.log" 2>&1 &
if [ $? -ne 0 ]; then
    echo "Failed to start graph node"
    tail -n 20 "$LOGS_PATH/graph_node.log"
    exit 1
fi

# Wait for the graph node to fully start
while ! grep -q "Downloading latest blocks from Ethereum, this may take a few minutes..." "$LOGS_PATH/graph_node.log"; do
  echo "Waiting for graph node to start..."
  sleep 1
done

# Generate and build graph code
echo "### Generating and building graph code ###"
cd $GRAPH_PATH
echo "" > $LOGS_PATH/graph_codegen.log
graph codegen > "$LOGS_PATH/graph_codegen.log" 2>&1
if grep -q "Error" "$LOGS_PATH/graph_codegen.log"; then
    echo "Failed to run graph codegen"
    tail -n 20 "$LOGS_PATH/graph_codegen.log"
    exit 1
fi

echo "" > $LOGS_PATH/graph_build.log
graph build > "$LOGS_PATH/graph_build.log" 2>&1
if grep -q "Error" "$LOGS_PATH/graph_codegen.log"; then
    echo "Failed to run graph build"
    tail -n 20 "$LOGS_PATH/graph_build.log"
    exit 1
fi

# Create and deploy subgraph
echo "### Creating and deploying subgraph ###"
echo "" > $LOGS_PATH/create_local.log
yarn create-local > "$LOGS_PATH/create_local.log" 2>&1 &
if [ $? -ne 0 ]; then
    echo "Failed to run graph create_local"
    tail -n 20 "$LOGS_PATH/create_local.log"
    exit 1
fi

echo "" > $LOGS_PATH/deploy_local.log
yarn deploy-local --version-label "v0.0.1" > "$LOGS_PATH/deploy_local.log" 2>&1 &
if [ $? -ne 0 ]; then
    echo "Failed to run graph deploy_local"
    tail -n 20 "$LOGS_PATH/deploy_local.log"
    exit 1
fi

# Run seed data script
echo "### Running seed data script ###"
cd $SMART_CONTRACTS_PATH
echo "" > $LOGS_PATH/seed_data.log
hh run ./scripts/seed_data.js --network localhost > "$LOGS_PATH/seed_data.log" 2>&1 &
if grep -q "Error" "$LOGS_PATH/seed_data.log"; then
    echo "Failed to run seed data script"
    tail -n 20 "$LOGS_PATH/seed_data.log"
    exit 1
fi