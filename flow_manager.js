import inquirer from "inquirer"
import figlet from "figlet"

class ManagerFlow {
	constructor(TOKEN, URL) {
		this.TOKEN = TOKEN
		this.URL = URL
	}

    #URL_DEPLOY = "http://10.20.12.148:8080/slices/diag";

	#options_manager = [
		{
			type: "list",
			name: "option",
			message: "Seleccione una opción",
			choices: [
				{ name: "Lista de slices", value: 1 },
				{ name: "Crear slice", value: 2 },
				{ name: "Editar slices", value: 3 },
				{ name: "Borrar slices", value: 4 },
				{ name: "Monitoreo de recursos", value: 5 },
				{ name: "Cambiar contraseña", value: 6 },
				{ name: "Ayuda", value: 7 },
				{ name: "Cerrar sesión", value: 0 },
			],
		},
	]

	#show_slices_options = [
		{
			type: "list",
			name: "res",
			message: "Selecciona una opción:",
			choices: [
				{ name: "Ver detalles de slice", value: 1 },
				{ name: "Regresar", value: 2 },
			],
		},
	]

	#options_create_slice_start = [
		{
			type: "input",
			name: "slice_name",
			message: "Ingrese el nombre del slice:",
		},
        {
            type: "list",
            name: "zone",
            message: "Seleccione una zona de disponibilidad:",
            choices: [
                { name: "Zona 1", value: 1 },
                { name: "Zona 2", value: 2 },
                { name: "Zona 3", value: 3 },
            ]
        },
		{
			type: "list",
			name: "method",
			message: "Seleccione el medio para crear el slice:",
			choices: [
				{ name: "Crear desde cero", value: "from_scratch" },
				{ name: "Crear desde topología", value: "from_topology" },
				{ name: "Crear desde plantilla", value: "from_template" },
			],
		},
	]

	#options_vms_and_links = [
		{
			type: "list",
			name: "option",
			message: "Seleccione una opción",
			choices: [
				{ name: "Agregar máquina virtual", value: 1 },
				{ name: "Agregar enlace", value: 2 },
				{ name: "Editar máquina virtual", value: 3 },
				{ name: "Borrar máquina virtual", value: 4 },
				{ name: "Borrar enlace", value: 5 },
                { name: "Siguiente", value: 6 },
				{ name: "Cancelar", value: 0 },
			],
		},
	]

	#options_create_vm = [
		{
			type: "input",
			name: "vm_name",
			message: "Ingrese el nombre de la máquina virtual: ",
		},
		{
			type: "list",
			name: "vm_os",
			message: "Seleccione el sistema operativo de la máquina virtual: ",
			choices: [
				{ name: "Windows", value: "windows" },
				{ name: "Linux", value: "linux" },
				{ name: "MacOS", value: "macos" },
			],
		},
		{
            type: "list",
            name: "flavor",
            message: "Selecciones un flavor para la máquina virtual:",
            choices: [
                { name: "Pequeño", value: "small" },
                { name: "Mediano", value: "medium" },
                { name: "Grande", value: "large" },
            ]
		},
		{
			type: "confirm",
			name: "vm_internet",
			message: "¿Brindar acceso a internet a la máquina virtual?",
		},
	]

	#options_create_link = [
		{
			type: "input",
			name: "link_name",
			message: "Ingrese el nombre del enlace: ",
		},
		{
			type: "list",
			name: "node_1",
			message: "Seleccione el punto de conexión 1: ",
			choices: [],
		},
		{
			type: "list",
			name: "node_2",
			message: "Seleccione el punto de conexión 2: ",
			choices: [],
		},
	]

	#options_delete_vm = [
		{
			type: "list",
			name: "vm_name",
			message: "Seleccione la máquina virtual a borrar: ",
			choices: [{ name: "Cancelar", value: 0 }],
		},
	]

	#options_delete_link = [
		{
			type: "list",
			name: "link_name",
			message: "Seleccione el enlace a borrar: ",
			choices: [{ name: "Cancelar", value: 0 }],
		},
	]

    #options_pre_deploy_slice = [
        {
            type: "list",
            name: "option",
            message: "Seleccione una opción:",
            choices: [
                { name: "Desplegar", value: 1 },
                { name: "Regresar", value: 0 },
            ]
        }
    ]

	#options_monitoring = [
		{
			type: "list",
			name: "worker",
			message: "Seleccione un trabajador para monitorear:",
			choices: [
				{ name: "Worker 1", value: "worker1" },
				{ name: "Worker 2", value: "worker2" },
				{ name: "Worker 3", value: "worker3" },
			],
		},
	]

	async monitor_resources() {
        let answer = await inquirer.prompt(this.#options_monitoring);
        const worker = answer.worker;
        await this.display_worker_metrics(worker);
    }

    async display_worker_metrics(worker) {
        const urlWorkerMetrics = `${this.URL}/monitoreo/${worker}`;
        const response = await fetch(urlWorkerMetrics, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        });
        const result = await response.json();
        if (result.message === "success") {
            console.table(result.data);
        } else {
            console.log(result.message);
        }
    }

	async start() {
		console.log(figlet.textSync("Manager"))
		while (true) {
			const answer = await inquirer.prompt(this.#options_manager)
			switch (answer.option) {
				case 1:
					await this.show_slices()
					break
				case 2:
					await this.create_slice()
					break
				case 3:
					break
				case 4:
					break
				case 5:
					await this.monitor_resources();
                    break;
				case 6:
					break
				case 7:
					break
				case 0:
					console.clear()
					return
			}
		}
	}

	async show_slices() {
		const response = await this.fetch_slices()
		const slices = response.slices
		console.log(`Se encontraron ${slices.length} slices`)
		console.table(slices)
		let answer
		do {
			answer = await inquirer.prompt(this.#show_slices_options)
			console.log(answer)
		} while (answer.res != 2)
	}

	async create_slice() {
		let SLICE = {};
		let answer = await inquirer.prompt(this.#options_create_slice_start);
		SLICE.name = answer.slice_name;
        SLICE.zone = answer.zone;

		switch (answer.method) {
			case "from_scratch":
				answer = await this.create_slice_from_scratch(SLICE)
				break
			case "from_topology":
				answer = await this.create_slice_from_topology(SLICE)
				break
			case "from_template":
				answer = await this.create_slice_from_template(SLICE)
				break
		}
	}

	async create_slice_from_scratch(SLICE) {
		console.log("create_slice_from_scratch")
		const result = await this.create_vms_and_links()
        if (result) {

            const { VMS, LINKS, STRUCTURE } = result;
            SLICE.VMS = VMS;
            SLICE.LINKS = LINKS;
            SLICE.STRUCTURE = STRUCTURE;
            console.log(JSON.stringify(SLICE));

            const answer = await inquirer.prompt(this.#options_pre_deploy_slice);
            if (answer.option === 1) {
                await this.deploy_slice(SLICE);
            }
        } else {
            console.log("Creación de slice cancelada");
        }
    }

    async create_slice_from_topology(SLICE) {
		console.log("create_slice_from_topology");
	}

	async create_slice_from_template(SLICE) {
		console.log("create_slice_from_template");
	}

    async deploy_slice(SLICE) {
        console.log("Desplegando slice...");
        const response = await fetch(this.#URL_DEPLOY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
            body: JSON.stringify(SLICE.STRUCTURE),
        });
        const result = await response.json();
        console.log("URL: "+JSON.stringify(result));
    }

	async create_vms_and_links(vms_created, links_created, structure_created) {
		let VMS = vms_created ? vms_created : [];
		let LINKS = links_created ? links_created : [];
		let STRUCTURE = structure_created ? structure_created : { visjs: { nodes: {}, edges: {} }, metadata: { edge_node_mapping: {} } };

		let delete_or_edit_vm_available = false;
		let delete_links_available = false;
		let create_link_available = false;

		while (true) {
			let answer = await inquirer.prompt(this.#options_vms_and_links);
			switch (answer.option) {
				case 1: // CREATE VM
					const new_vm = await this.create_vm(STRUCTURE);
					VMS.push(new_vm);
					break
				case 2: // CREATE LINK
					if (!create_link_available) {
						console.log("Primero debe agregar más de una máquina virtual");
						break;
					}
					const new_link = await this.create_link(STRUCTURE);
					LINKS.push(new_link);
					break;
				case 3: // EDIT VM
					if (!delete_or_edit_vm_available) {
						break
					}
					await this.edit_vm();
					break;
				case 4: // DELETE VM
					if (!delete_or_edit_vm_available) {
						break;
					}
					const UPDATED_VMS = await this.delete_vm(VMS);
					if (UPDATED_VMS) {
						console.log(UPDATED_VMS);
						VMS = UPDATED_VMS;
					}
					break;
				case 5: // DELETE LINK
					if (!delete_links_available) {
						console.log("Primero debe agregar un enlace");
						break;
					}
					const UPDATED_LINKS = await this.delete_link(LINKS)
					if (UPDATED_LINKS) {
						console.log(UPDATED_LINKS);
						LINKS = UPDATED_LINKS;
					}
					break;
                case 6: // NEXT
                    return { VMS, LINKS, STRUCTURE };
				case 0:
					return; 
			}

			// CHECK VMS AND LINKS TO SHOW OR NOT OPTIONS
			if (VMS.length > 0) {
				delete_or_edit_vm_available = true
			} else {
				delete_or_edit_vm_available = false
			}

			if (LINKS.length > 0) {
				delete_links_available = true
			} else {
				delete_links_available = false
			}

			if (VMS.length > 1) {
				create_link_available = true
			} else {
				create_link_available = false
			}

			// console.log(`vms: ${JSON.stringify(VMS)}`);
			// console.log(`links: ${JSON.stringify(LINKS)}`);
            // console.log(`structure: ${JSON.stringify(STRUCTURE)}`);
		}
	}

	async create_vm(STRUCTURE) {
		const new_vm = await inquirer.prompt(this.#options_create_vm)
        // UPDATING CREATE OPTIONS
        this.#options_delete_vm[0].choices.unshift({
            name: new_vm.vm_name,
            value: new_vm.vm_name,
        });
        this.#options_create_link[1].choices.unshift({
            name: new_vm.vm_name,
            value: new_vm.vm_name,
        });
        this.#options_create_link[2].choices.unshift({
            name: new_vm.vm_name,
            value: new_vm.vm_name,
        });
        // UPDATE SLICE STRUCTURE
        STRUCTURE.visjs.nodes[new_vm.vm_name] = { label: new_vm.vm_name, figure: "server"};
        STRUCTURE.metadata.edge_node_mapping[new_vm.vm_name] = [];
        return new_vm;
	}

	async create_link(STRUCTURE) {
		const new_link = await inquirer.prompt(this.#options_create_link);
        // UPDATING CREATE OPTIONS
        this.#options_delete_link[0].choices.unshift({
            name: new_link.link_name,
            value: new_link.link_name,
        });
        // UPDATE SLICE STRUCTURE
        STRUCTURE.visjs.edges[new_link.link_name] = { label: new_link.link_name, color: "purple"};
        STRUCTURE.metadata.edge_node_mapping[new_link.node_1].push(new_link.link_name);
        STRUCTURE.metadata.edge_node_mapping[new_link.node_2].push(new_link.link_name);
        return new_link;
	}

	async delete_vm(VMS) {
		const answer = await inquirer.prompt(this.#options_delete_vm);
		if (answer.vm_name === 0) return; // DELETE CANCELED
		const UPDATED_VMS = VMS.filter((vm) => vm.vm_name != answer.vm_name);
		return UPDATED_VMS;
	}

	async delete_link(LINKS) {
		const answer = await inquirer.prompt(this.#options_delete_link);
		if (answer.link_name === 0) return; // DELETE CANCELED
		const UPDATED_LINKS = LINKS.filter((link) => link.link_name != answer.link_name);
		return UPDATED_LINKS;
	}

	async fetch_slices() {
		const urlSlices = `${this.URL}/slices`;
		const response = await fetch(urlSlices, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.TOKEN,
			},
		})
		const result = await response.json();
		return result;
	}
}

export default ManagerFlow
