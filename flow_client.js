import inquirer from "inquirer"
import figlet from "figlet"

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
                // { name: "Cambiar contraseña", value: 2 },
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
        try {
            console.log(figlet.textSync("Client"))
            while (true) {
                const answer = await inquirer.prompt(this.#options_client);
                switch (answer.res) {
                    case 1:
                        await this.show_slices()
                        break
                    case 2:
                        break
                    case 3:
                        break
                    case 4:
                        console.clear()
                        this.TOKEN = null
                        return;
                }
            }

        } catch (error) {
            if (error.message === "StopStartLoop") {
                this.TOKEN = null
                console.clear()
                spinner.warn({ text: "Sesión expirada. Por favor, inicie sesión nuevamente." })
                throw error
            }
            else {
                console.error(error);
            }
        }
    }

    async show_slices() {
        const slices = await this.get_slices();
        if (slices.length === 0) console.log("No hay slices disponibles.")
        else console.table(slices);
    }

    async get_slices() {
        const ENDPOINT = `${this.URL}/slices/client`
        const response = await fetch(ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        })

        if (response.status === 411) {
            console.clear()
            return
        }

        const data = await response.json()
        const formated_slices = data.slices.map((slice) => {
            return {
                name: slice.name.deployment.details.project_name,
                topología: slice.deployment.details.topology,
                vms: Object.keys(slice.structure.visjs.nodes).length,
                status: slice.status,
                acceso: "",
                visualizar: slice.deployment.details.graph_url
            }
        })
        return formated_slices;
    }
}

export default ClientFlow
