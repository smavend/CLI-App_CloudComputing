#!/usr/bin/env node

import inquirer from "inquirer"
import figlet from "figlet"
import { createSpinner } from "nanospinner"
import jwt from "jsonwebtoken"

import AdministratorFlow from "./flow_administrator.js"
import ManagerFlow from "./flow_manager.js"
import ClientFlow from "./flow_client.js"


let TOKEN

const IP = "10.20.12.148"
const PORT = "8080"
let BASE_URL = `http://${IP}:${PORT}`

async function loginUser(username, password, url) {
    const urlAuth = `${url}/auth`
    const response = await fetch(urlAuth, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    const result = await response.json()
    return result
}

// main app
export async function launch() {
    let answers
    try {
        do {
            console.log(figlet.textSync("Slice Manager"))
            console.log("¡Bienvenido a la app CLI del orquestador Cloud!")
            answers = await inquirer.prompt(start_options)
            switch (answers.option) {
                case 1: // request login
                    await login()
                    break
                case 2: // funcion para cambiar de contraseña con correo asociado
                    await update_pswd()
                    break
            }
        } while (answers.option !== 0)
        console.log("Cerrando programa...")
    } catch (error) {
        if (error.message === "StopStartLoop") {
            console.log(figlet.textSync("Slice Manager"))
            await login()
            do {
                console.log(figlet.textSync("Slice Manager"))
                console.log("¡Bienvenido a la app CLI del orquestador Cloud!")
                answers = await inquirer.prompt(start_options)
                switch (answers.option) {
                    case 1: // request login
                        await login()
                        break
                    case 2: // funcion para cambiar de contraseña con correo asociado
                        await update_pswd()
                        break
                }
            } while (answers.option !== 0)
        }
    }
}

// validation of credentials
async function login() {
    console.log("Ingrese sus credenciales\n")
    const answers = await inquirer.prompt(login_options)
    const spinner = createSpinner("Validando credenciales...").start()

    const response = await loginUser(answers.username, answers.password, BASE_URL)
    // const response = { message: "success", token: "token" }

    if (response.message === "success") {
        spinner.success({ text: "Credenciales correctas" })

        TOKEN = response.token
        const decoded = jwt.verify(TOKEN, "secret")
        // const decoded = { role: "manager" }

        console.clear()
        let flow
        switch (decoded.role) {
            case "admin":
                flow = new AdministratorFlow(TOKEN, BASE_URL)
                await flow.start()
                break
            case "manager":
                flow = new ManagerFlow(TOKEN, BASE_URL)
                await flow.start()
                break
            case "client":
                flow = new ClientFlow(TOKEN, BASE_URL)
                await flow.start()
                break
        }
    } else {
        console.clear()
        spinner.error({ text: "Credenciales incorrectas" })
    }
}

// update password flow
async function update_pswd() { }

// start app prompt
const start_options = [
    {
        type: "list",
        name: "option",
        message: "Escoja una opción para continuar",
        choices: [
            { name: "Iniciar sesión", value: 1 },
            { name: "Olvidé mi contraseña", value: 2 },
            { name: "Salir", value: 0 },
        ],
    },
]

// login inputs prompt
const login_options = [
    {
        name: "username",
        message: "Usuario: ",
        validate: (answer) => {
            if (!answer) {
                return "Ingresar nombre de usuario"
            }
            return true
        },
    },
    {
        type: "password",
        name: "password",
        message: "Contraseña: ",
        mask: "*",
        validate: (answer) => {
            if (!answer) {
                return "Ingresar contraseña"
            }
            return true
        },
    },
]

launch(false)
