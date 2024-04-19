#!/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "Este script debe ser ejecutado como root....................................x"
    exit 1
fi

apt update -y
apt upgrade -y

validation_node() {
    if command -v node &> /dev/null; then
        node_version=$(node -v | awk -F'.' '{print $1}' | sed 's/^.//')
        if $((node_version))=>16; then
            echo "Requerimiento de node cumplido............................................../"
            npm i
        else
            validation_wget
        fi
    else
        apt install nodejs -y
        validation_node
    fi
}

validation_wget() {
    if command -v wget &> /dev/null; then
        echo "Instalando wget para descargar nvm mediante enlace público................../"
        apt install wget -y
        validation_wget
    else
        echo "Descargando nvm desde enlace público......................................../"
        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        validation_nvm
    fi
}

validation_nvm() {
    if command -v nvm &> /dev/null; then
        versions=($(nvm ls | grep -o '\bv[0-9]*\.[0-9]*\.[0-9]*\b' | sed 's/^.//'))
        version="none"
        for ver in "${versions[@]}"; do
            major_version=$(echo "$ver" | awk -F'.' '{print $1}')
            if [ "$major_version" -ge 16 ]; then
                version="$ver"
                break
            fi
        done
        echo "Verificando versiones instaladas............................................."
        if [ "$version" == "none" ]; then
            echo "Instalando version 16.0.0...................................................."
            nvm install 16.0.0
            validate_node
        else
            echo "Seteando versión compatible por defecto............................"
            nvm use "$version"
            nvm alias default "$version"
            validate_node
        fi
    fi
}

validation_node