import inquirer from "inquirer"
import figlet from "figlet"
import { handleSessionTimeout } from "./index.js"

class AdministratorFlow {
	constructor(TOKEN, URL) {
		this.TOKEN = TOKEN
		this.URL = URL
	}

	#USERS = [
		{
			id: 1,
			usuario: "Willy Huallpa",
			contraseña: "willy",
			rol: "regular",
		},
	]

	#options_admin = [
		{
			type: "rawlist",
			name: "res",
			message: "Seleccione una opción:",
			choices: [
				{ name: "Listar usuarios", value: 1 },
				{ name: "Crear nuevo usuario", value: 2 },
				{ name: "Editar permisos de usuario", value: 3 },
				{ name: "Cerrar sesión", value: 4 },
			],
		},
	]

	#options_create_user = [
		{
			type: "input",
			name: "usuario",
			message: "Ingrese el nombre del usuario: ",
			validate: (answer) => {
				if (!answer) {
					return "Ingrese un nombre de usuario"
				}
				return true
			},
		},
		{
			type: "password",
			name: "contraseña",
			message: "Ingrese la contraseña del usuario: ",
			validate: (answer) => {
				if (!answer) {
					return "Ingrese una contraseña"
				}
				return true
			},
		},
		{
			type: "rawlist",
			name: "rol",
			message: "Seleccione el rol del usuario: ",
			choices: [
				{ name: "Regular", value: "regular" },
				{ name: "Manager", value: "manager" },
			],
		},
	]

	async start() {
		console.log(figlet.textSync("Administrador"))
		while (true) {
			let answer = await inquirer.prompt(this.#options_admin)
			switch (answer.res) {
				case 1: // show users
					await this.show_users()
					break
				case 2: // create user
					await this.create_user()
					break
				case 3: // edit user permissions
					break
				case 4: // logout
					this.TOKEN = null
					console.clear()
					return
			}
		}
	}

	async create_user() {
		const answer = await inquirer.prompt(this.#options_create_user)
		const new_user = {
			id: this.#USERS.length + 1,
			usuario: answer.usuario,
			contraseña: answer.contraseña,
			rol: answer.rol,
		}
		// await this.post_user(new_user); Uncomment when use headnode server
		this.#USERS.push(new_user)
		console.log("Usuario creado exitosamente")
	}

	async show_users() {
		// const response = await this.get_users(); Uncomment when use headnode server
		const response = { message: "success", users: this.#USERS }
		console.log(`Se encontraron ${response.users.length} usuario(s)`)
		console.table(response.users)
	}

	async post_user() {
		const ENDPOINT = `${this.URL}/users`
		const response = await fetch(ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.TOKEN,
			},
			body: JSON.stringify(new_user),
		})

		if (response.status === 411) {
			await handleSessionTimeout()
			return
		}

		const data = await response.json()
		return data
	}

	async get_users() {
		const ENDPOINT = `${this.URL}/users`
		const response = await fetch(ENDPOINT, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.TOKEN,
			},
		})

		if (response.status === 411) {
			await handleSessionTimeout()
			return
		}

		const data = await response.json()
		return data
	}
}

export default AdministratorFlow
