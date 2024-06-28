import inquirer from "inquirer"
import figlet from "figlet"
import { handleSessionTimeout } from "./index.js"

class ClientFlow {
	constructor(TOKEN, URL) {
		this.TOKEN = TOKEN
		this.URL = URL
	}

	#options_client = [
		{
			type: "rawlist",
			name: "res",
			message: "Seleccione una opción: ",
			choices: [
				{ name: "Ver slices", value: 1 },
				{ name: "Cambiar contraseña", value: 2 },
				{ name: "Ayuda", value: 3 },
				{ name: "Cerrar sesión", value: 4 },
			],
		},
	]

	#options_show_slices = [
		{
			type: "rawlist",
			name: "res",
			message: "Seleccione una opción: ",
			choices: [
				{ name: "Ver detalles de slice", value: 1 },
				{ name: "Regresar", value: 2 },
			],
		},
	]

	#options_show_slice_details = [
		{
			type: "input",
			name: "slice_id",
			message: "Ingrese el id del slice: ",
		},
	]

	async start() {
		console.log(figlet.textSync("Client"))
		let answer
		do {
			answer = await inquirer.prompt(this.#options_client)
			switch (answer.res) {
				case 1: // show slices
					await this.show_slices()
					break
				case 2: // update passwd
					break
				case 3: // help
					break
				case 4: // logout
					console.clear()
					break
			}
		} while (answer.res !== 4)
	}

	async show_slices() {
		// const response = await this.get_slices(); descomentar al utilizar servidor de headnode
		const response = "|mostrando slices|"
		console.log(response)
		while (true) {
			let answer = await inquirer.prompt(this.#options_show_slices)
			if (answer.res === 2) {
				break
			}
			answer = await inquirer.prompt(this.#options_show_slice_details)

			console.log(answer.slice_id)
			console.log("|mostrando detalles de slice|")
		}
	}

	async get_slices() {
		const ENDPOINT = `${this.URL}/regularUser/slices`
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

export default ClientFlow
