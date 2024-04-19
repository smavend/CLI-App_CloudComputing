#!/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "Este script debe ser ejecutado como root."
    exit 1
fi

apt update
apt upgrade

if command -v node &> /dev/null; then
    node_version=$(node -v | awk -F'.' '{print $1}' | sed 's/^.//')
    if $((node_verion))=>16; then
        echo "Sí tiene node correcto"
fi


