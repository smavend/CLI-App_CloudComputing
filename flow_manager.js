import inquirer from "inquirer"
import figlet from "figlet"
import { createSpinner } from "nanospinner"

class ManagerFlow {
    constructor(TOKEN, BASE_URL) {
        this.TOKEN = TOKEN
        this.BASE_URL = BASE_URL
    }

    #ENDPOINT_LIST_SLICES = "/slices";
    #ENDPOINT_DEPLOY = "/slices";
    #ENDPOINT_DRAFT_SLICE = "/slices/draft";
    #ENDPOINT_LIST_REGULAR_USERS = "/users/client";

    #options_manager = [
        {
            type: "list",
            name: "option",
            message: "Seleccione una opción",
            choices: [
                { name: "Listar slices", value: 1 },
                { name: "Crear slice", value: 2 },
                { name: "Editar slices", value: 3 },
                { name: "Borrar slices", value: 4 },
                { name: "Monitoreo de recursos", value: 5 },
                { name: "Cambiar contraseña", value: 6 },
                { name: "Ayuda", value: 7 },
                { name: "Ver Logs", value: 8 },
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

    #options_create_slice = [
        {
            type: "list",
            name: "option",
            message: "Seleccione continuar con su slice o crear uno nuevo: ",
            choices: []
        }
    ]

    #options_create_slice_start = [
        {
            type: "list",
            name: "platform",
            message: "Seleccione la plataforma para el slice: ",
            choices: [
                { name: "Linux", value: "Linux" },
                { name: "OpenStack", value: "OpenStack" },
            ],
        },
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
                { name: "Automático", value: 0 }
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

    #options_slice_topology = [
        {
            type: "list",
            name: "topology",
            message: "Seleccione una topología:",
            choices: [
                { name: "Lineal" },
                { name: "Malla" },
                { name: "Árbol" },
                { name: "Anillo" },
                { name: "Bus" },
            ],
        },
        {
            type: "number",
            name: "nodes",
            message: "Ingrese el número de nodos: ",
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
                { name: "Asignar usuario", value: 6 },
                { name: "Guardar avance y salir", value: 7 },
                { name: "Siguiente", value: 8 },
                { name: "Cancelar", value: 0 },
            ],
        },
    ]

    #options_assign_user = [
        {
            type: "list",
            name: "user",
            message: "Seleccione un usuario para asignar:",
            choices: []
        }
    ]

    #options_create_vm = [
        {
            type: "input",
            name: "vm_name",
            message: "Ingrese el nombre de la máquina virtual: ",
        },
        {
            type: "list",
            name: "vm_image",
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
            ],
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
                { name: "Desplegar" },
                { name: "Regresar" },
            ],
        },
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
        let answer = await inquirer.prompt(this.#options_monitoring)
        const worker = answer.worker
        await this.display_worker_metrics(worker)
    }

    async display_worker_metrics(worker) {
        const urlWorkerMetrics = `${this.BASE_URL}/monitoreo/${worker}`
        const response = await fetch(urlWorkerMetrics, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        })
        const result = await response.json()
        if (result.message === "success") {
            console.table(result.data)
        } else {
            console.log(result.message)
        }
    }

    async displayLogs() {
        const urlLogs = `${this.BASE_URL}/logs`
        try {
            const response = await fetch(urlLogs, {
                method: "GET",
            })
            const result = await response.json()
            if (result.message === "success") {
                console.log("\x1b[36m%s\x1b[0m", "Últimos 25 registros del archivo:") // Color cyan para el título
                const logs = result.data.split("\n").slice(-25) // Obtener solo las últimas 25 líneas

                logs.forEach((line) => {
                    if (line.trim() !== "") {
                        // Buscar y cambiar color del texto entre corchetes [authModule] a verde
                        const coloredLine = line.replace(/\[(.*?)\]/g, "\x1b[32m[$1]\x1b[0m")

                        const parts = coloredLine.split(" - ")
                        if (parts.length >= 2) {
                            const dateTime = parts[0].trim()
                            const message = parts.slice(1).join(" - ").trim()
                            console.log("\x1b[35m%s\x1b[0m", dateTime, "\t", message) // Color magenta para fecha/hora
                        } else {
                            console.log(coloredLine) // Imprimir la línea completa si no se puede dividir
                        }
                    }
                })
            } else {
                console.log("Archivo de registro no encontrado")
            }
        } catch (error) {
            console.error("Error al obtener los registros:", error)
        }
    }

    async start() {
        const spinner = createSpinner()
        try {
            console.log(figlet.textSync("Manager"))
            while (true) {
                const answer = await inquirer.prompt(this.#options_manager)
                switch (answer.option) {
                    case 1:
                        await this.show_slices()
                        break
                    case 2:
                        await this.pre_create_slice()
                        break
                    case 3:
                        break
                    case 4:
                        break
                    case 5:
                        await this.monitor_resources()
                        break
                    case 6:
                        break
                    case 7:
                        break
                    case 8:
                        await this.displayLogs()
                        break
                    case 0:
                        this.TOKEN = null
                        console.clear()
                        return
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
        try {
            const response = await this.fetch_slices()

            const slices = response.slices
            console.log(`Se encontraron ${slices.length} slices`)
            console.table(slices)
        } catch (error) {
            if (error.message === "StopStartLoop") {
                throw error
            }
            else {
                console.error(error);
            }
        }
    }

    async pre_create_slice() {
        await this.set_draft_slices();
        let answer = await inquirer.prompt(this.#options_create_slice);
        switch (answer.option) {
            case 0: // CREATE NEW SLICE
                await this.create_slice(); // TODO: ADD FUNCTION TO COMPLETE OR EMPTY VMS OPTIONS
                break;
            case -1: // BACK
                break;
            default: // CONTINUE CREATE SLICE
                this.create_slice_from_draft(answer.option); // TODO: ADD FUNCTION TO COMPLETE OR EMPTY VMS OPTIONS
                break;
        }
    }

    async create_slice_from_draft(slice_option) {
        let SLICE = await this.fetch_draft_slice(slice_option);
        this.set_vms_and_links_delete_options(SLICE);
        let creation_response = await this.create_slice_from_scratch(SLICE);
        if (creation_response) {
            let DEFINED_SLICE = creation_response;
            console.log(JSON.stringify(DEFINED_SLICE));
            console.log("Desplegar slice...");
            // await this.deploy_slice(DEFINED_SLICE);
        }
    }

    async create_slice() {
        this.clear_vms_and_links_delete_options();
        let SLICE = {};
        let answer = await inquirer.prompt(this.#options_create_slice_start);
        SLICE.deployment = {
            platform: answer.platform,
            details: {
                project_name: answer.slice_name,
                network_name: "Network",
                subnet_name: "Subnet",
                cidr: "",
                zone: answer.zone
            }
        };

        let creation_response;
        switch (answer.method) {
            case "from_scratch":
                creation_response = await this.create_slice_from_scratch(SLICE);
                break;
            case "from_topology":
                creation_response = await this.create_slice_from_topology(SLICE);
                break;
            case "from_template":
                creation_response = await this.create_slice_from_template(SLICE);
                break;
        }

        if (creation_response) {
            let DEFINED_SLICE = creation_response;
            console.log(JSON.stringify(DEFINED_SLICE));
            console.log("Desplegar slice...");
            // await this.deploy_slice(DEFINED_SLICE);
        }

    }

    async create_slice_from_scratch(SLICE) {
        SLICE.deployment.details.topology = "custom";
        while (true) {
            const response = await this.create_vms_and_links(SLICE);
            console.log("response_creation: ", response);

            if (response === "guardar" || response === "cancelar") {
                console.log("Saliendo de la creación de slice");
                return;
            }

            const answer = await inquirer.prompt(this.#options_pre_deploy_slice);
            if (answer.option === "Regresar") {
                continue;
            }

            return response;
        }
    }

    async create_slice_from_topology(SLICE) {
        console.log("create_slice_from_topology")
        const answer = await inquirer.prompt(this.#options_slice_topology)
        if (!this.valid_topology(answer.topology, answer.nodes)) {
            console.log("Topología inválida")
            return
        }
        SLICE.deployment.details.topology = answer.topology
        const SLICE_WITH_TOPOLOGY = await this.create_topology(SLICE, answer.topology, answer.nodes)
        const DEFINED_SLICE = await this.create_vms_and_links(SLICE_WITH_TOPOLOGY)
    }

    valid_topology(topology, nodes) {
        return true
    }

    async create_topology(SLICE, topology, nodes) {
        switch (topology) {
            case "Lineal":
                return this.create_topology_lineal(SLICE, nodes)
            case "Malla":
                return this.create_topology_malla(SLICE, nodes)
            case "Árbol":
                return this.create_topology_arbol(SLICE, nodes)
            case "Anillo":
                return this.create_topology_anillo(SLICE, nodes)
            case "Bus":
                return this.create_topology_bus(SLICE, nodes)
        }
        return SLICE
    }

    create_topology_lineal(SLICE, nodes) { }

    create_topology_malla(SLICE, nodes) { }

    create_topology_arbol(SLICE, nodes) { }

    create_topology_anillo(SLICE, nodes) { }

    create_topology_bus(SLICE, nodes) { }

    async create_slice_from_template(SLICE) {
        console.log("create_slice_from_template")
    }

    async deploy_slice(SLICE) {
        console.log("Desplegando slice...");

        const url_deploy = this.BASE_URL + this.#ENDPOINT_DEPLOY;
        const response = await fetch(url_deploy, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
            body: JSON.stringify(SLICE),
        });
        const result = await response.json();
        console.log(`El slice ${SLICE.deployment.details.project_name} ha sido desplegado con éxito`);
    }

    async create_vms_and_links(SLICE, structure_created) {
        let STRUCTURE = structure_created ? structure_created : { visjs: { nodes: {}, edges: {} }, metadata: { edge_node_mapping: {} } };

        let allow_delete_or_edit_vm = false
        let allow_delete_links_available = false
        let allow_create_link = false
        let allow_save_structure = false

        let vms_number;
        let links_number;

        while (true) {
            let answer = await inquirer.prompt(this.#options_vms_and_links);
            switch (answer.option) {
                case 1: // CREATE VM
                    await this.create_vm(STRUCTURE);
                    break
                case 2: // CREATE LINK
                    if (!allow_create_link) {
                        console.log("Primero debe agregar más de una máquina virtual");
                        break;
                    }
                    await this.create_link(STRUCTURE);
                    break;
                case 3: // EDIT VM
                    if (!allow_delete_or_edit_vm) {
                        break
                    }
                    await this.edit_vm();
                    break;
                case 4: // DELETE VM
                    if (!allow_delete_or_edit_vm) {
                        break;
                    }
                    await this.delete_vm(STRUCTURE);
                    break;
                case 5: // DELETE LINK
                    if (!allow_delete_links_available) {
                        console.log("Primero debe agregar un enlace");
                        break;
                    }
                    await this.delete_link(STRUCTURE);
                    break;
                case 6: // ASSIGN USER
                    await this.assign_user(SLICE);
                    break;
                case 7: // SAVE ADVANCE AND EXIT
                    if (!allow_save_structure) {
                        console.log("No hay cambios para guardar");
                        break;
                    }
                    const response = await this.save_advance(SLICE);
                    if (response.message === "success") {
                        console.log("Avance guardado correctamente");
                    }
                    return "guardar";
                case 8: // NEXT
                    return SLICE;
                case 0: // CANCEL
                    return "cancelar";
            }

            // UPDATING SLICE OBJECT
            SLICE.structure = STRUCTURE;
            vms_number = Object.keys(STRUCTURE.visjs.nodes).length;
            links_number = Object.keys(STRUCTURE.visjs.edges).length;

            // CHECK VMS AND LINKS TO ALLOW OR DISALLOW ACTIONS
            if (vms_number > 0) {
                allow_delete_or_edit_vm = true
            } else {
                allow_delete_or_edit_vm = false
            }

            if (links_number > 0) {
                allow_delete_links_available = true
            } else {
                allow_delete_links_available = false
            }

            if (vms_number > 1) {
                allow_create_link = true
            } else {
                allow_create_link = false
            }

            if (vms_number > 0) {
                allow_save_structure = true
            } else {
                allow_save_structure = false
            }

            console.log(`structure: ${JSON.stringify(STRUCTURE)}`);
        }
    }

    async assign_user(SLICE) {
        await this.set_assignable_users();
        const answer = await inquirer.prompt(this.#options_assign_user);
        SLICE.user = answer.user;
    }

    async save_advance(SLICE) {
        console.log("Guardando avance...");
        SLICE.deployment.details.status = "not_deployed";
        const url_save_advance = this.BASE_URL + this.#ENDPOINT_DRAFT_SLICE;
        const response = await fetch(url_save_advance, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
            body: JSON.stringify(SLICE),
        });
        return await response.json();
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
        STRUCTURE.visjs.nodes[new_vm.vm_name] = {
            label: new_vm.vm_name,
            image: new_vm.vm_image,
            flavor: new_vm.flavor,
            figure: "server",
        };
        STRUCTURE.metadata.edge_node_mapping[new_vm.vm_name] = [];
    }

    async create_link(STRUCTURE) {
        const new_link = await inquirer.prompt(this.#options_create_link);
        // UPDATING CREATE OPTIONS
        this.#options_delete_link[0].choices.unshift({
            name: new_link.link_name,
            value: new_link.link_name,
        });
        // UPDATE SLICE STRUCTURE
        STRUCTURE.visjs.edges[new_link.link_name] = { label: new_link.link_name, color: "purple" };
        STRUCTURE.metadata.edge_node_mapping[new_link.node_1].push(new_link.link_name);
        STRUCTURE.metadata.edge_node_mapping[new_link.node_2].push(new_link.link_name);
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
        const urlSlices = this.BASE_URL + this.#ENDPOINT_LIST_SLICES;
        const response = await fetch(urlSlices, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        })

        if (response.status === 411) {
            console.clear()
            throw new Error("StopStartLoop")
        }
        const result = await response.json();
        return result;
    }

    async set_draft_slices() {
        const urlDraftSlices = this.BASE_URL + this.#ENDPOINT_DRAFT_SLICE;
        const response = await fetch(urlDraftSlices, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        })
        const result = await response.json();
        if (result.slices.length === 0) return;

        this.#options_create_slice[0].choices = [
            { name: "Crear slice nuevo", value: 0 },
            { name: "Regresar", value: -1 }
        ];
        for (let slice of result.slices) {
            this.#options_create_slice[0].choices.unshift(
                { name: "Continuar con slice: " + slice.deployment.details.project_name, value: slice._id }
            )
        }

        let formated_draft_slices = result.slices.map((slice) => {
            return {
                nombre: slice.deployment.details.project_name,
                topología: slice.deployment.details.topology,
                vms: Object.keys(slice.structure.visjs.nodes).length,
                plataforma: slice.deployment.platform,
                visualizar: slice.deployment.details.graph_url
            }
        })

        console.table(formated_draft_slices);
    }

    async set_assignable_users() {
        const urlUsers = this.BASE_URL + this.#ENDPOINT_LIST_REGULAR_USERS;
        const response = await fetch(urlUsers, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        });
        const result = await response.json();

        this.#options_assign_user[0].choices = [];
        for (let user of result.users) {
            this.#options_assign_user[0].choices.push({ name: user.username, value: user.id });
        }
    }

    async fetch_draft_slice(slice_id) {
        const urlDraftSlice = this.BASE_URL + this.#ENDPOINT_DRAFT_SLICE + "/" + slice_id;
        const response = await fetch(urlDraftSlice, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        });
        const result = await response.json();
        return result.slice;
    }

    clear_vms_and_links_delete_options() {
        this.#options_delete_vm[0].choices = [{ name: "Cancelar", value: 0 }];
        this.#options_delete_link[0].choices = [{ name: "Cancelar", value: 0 }];
    }

    set_vms_and_links_delete_options(SLICE) {
        this.#options_delete_vm[0].choices = [{ name: "Cancelar", value: 0 }];
        this.#options_delete_link[0].choices = [{ name: "Cancelar", value: 0 }];

        for (let vm in SLICE.structure.visjs.nodes) {
            this.#options_delete_vm[0].choices.unshift({ name: vm.label, value: vm.label });
            this.#options_create_link[1].choices.unshift({ name: vm.label, value: vm.label });
            this.#options_create_link[2].choices.unshift({ name: vm.label, value: vm.label });
        }

        for (let link in SLICE.structure.visjs.edges) {
            this.#options_delete_link[0].choices.unshift({ name: link.label, value: link.label });
        }
    }

}

export default ManagerFlow
