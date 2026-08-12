#!/usr/bin/env bash

# Stop the script immediately if any individual command fails
set -e

# Define color codes for pretty terminal logging output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' 

echo -e "${BLUE}=== Starting js-html-view Uninstallation ===${NC}"

# Define targeted paths (must match the installer exactly)
INSTALL_DIR="/usr/local/lib/hv"
BIN_LINK="/usr/local/bin/hv"

# 1. Remove the global command shortcut symlink link
if [ -L "$BIN_LINK" ] || [ -e "$BIN_LINK" ]; then
    echo "Removing global executable command shortcut from ${BIN_LINK}..."
    sudo rm -f "$BIN_LINK"
else
    echo "No global executable command shortcut found at ${BIN_LINK}."
fi

# 2. Delete the application binaries folder
if [ -d "$INSTALL_DIR" ]; then
    echo "Deleting application layers from ${INSTALL_DIR}..."
    sudo rm -rf "$INSTALL_DIR"
else
    echo "No application directory found at ${INSTALL_DIR}."
fi

echo -e "${GREEN}=== Success! js-html-view has been completely uninstalled ===${NC}"
