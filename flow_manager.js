import inquirer from "inquirer"
import figlet from "figlet"

class ManagerFlow {
    constructor(TOKEN, BASE_URL) {
        this.TOKEN = TOKEN
        this.BASE_URL = BASE_URL
    }

    // IMPOSIBLE TO CONATENATE STRING HERE UU
    #ENDPOINT_LIST_SLICES = "/slices";
    #ENDPOINT_DEPLOY = "/slices";
    #ENDPOINT_DRAFT_SLICE = "/slices/draft";

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
            choices: [
                { name: "Crear slice nuevo", value: 0 },
                { name: "Regresar", value: -1 }
            ]
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
                { name: "Bus" }
            ]
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
            ]
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
                { name: "Guardar avance y salir", value: 6 },
                { name: "Siguiente", value: 7 },
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
        const urlWorkerMetrics = `${this.BASE_URL}/monitoreo/${worker}`;
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
                    await this.pre_create_slice()
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
                    this.TOKEN = null;
                    console.clear()
                    return
            }
        }
    }

    async show_slices() {
        const response = await this.fetch_slices();
        const slices = response.slices;
        console.log(`Se encontraron ${slices.length} slices`);
        console.table(slices);
        // let answer
        // do {
        // 	answer = await inquirer.prompt(this.#show_slices_options)
        // 	console.log(answer)
        // } while (answer.res != 2)
    }


    async pre_create_slice() {
        await this.fetch_draft_slices();
        let answer = await inquirer.prompt(this.#options_create_slice);
        switch (answer.option) {
            case 0: // CREATE NEW SLICE
                await this.create_slice();
                break;
            case -1: // BACK
                break;
            default: // CONTINUE CREATE SLICE
                break;
        }
    }

    async create_slice() {
        let SLICE = {};
        let answer = await inquirer.prompt(this.#options_create_slice_start);
        SLICE.manager = this.TOKEN;
        SLICE.deployment = {
            platform: answer.platform,
            details: {
                project_name: answer.slice_name,
                network_name: "Network",
                subnet_name: "Subnet",
                cidr: "",
                zone: answer.zone
            }
        }

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
        SLICE.deployment.details.topology = "custom";
        while (true) {
            const DEFINED_SLICE = await this.create_vms_and_links(SLICE)
            if (DEFINED_SLICE) {

                console.log(JSON.stringify(DEFINED_SLICE));

                const answer = await inquirer.prompt(this.#options_pre_deploy_slice);
                if (answer.option === 1) {
                    await this.deploy_slice(DEFINED_SLICE);
                    break;
                }
            } else {
                console.log("La creación del slice ha sido cancelada");
                break;
            }
        }
    }

    async create_slice_from_topology(SLICE) {
        console.log("create_slice_from_topology");
        const answer = await inquirer.prompt(this.#options_slice_topology);
        if (!this.valid_topology(answer.topology, answer.nodes)) {
            console.log("Topología inválida");
            return;
        }
        SLICE.deployment.details.topology = answer.topology;
        const SLICE_WITH_TOPOLOGY = await this.create_topology(SLICE, answer.topology, answer.nodes);
        const DEFINED_SLICE = await this.create_vms_and_links(SLICE_WITH_TOPOLOGY);
    }

    valid_topology(topology, nodes) {
        return true;
    }

    async create_topology(SLICE, topology, nodes) {
        switch (topology) {
            case "Lineal":
                return this.create_topology_lineal(SLICE, nodes);
            case "Malla":
                return this.create_topology_malla(SLICE, nodes);
            case "Árbol":
                return this.create_topology_arbol(SLICE, nodes);
            case "Anillo":
                return this.create_topology_anillo(SLICE, nodes);
            case "Bus":
                return this.create_topology_bus(SLICE, nodes);
        }
        return SLICE;
    }

    create_topology_lineal(SLICE, nodes) {

    }

    create_topology_malla(SLICE, nodes) {

    }

    create_topology_arbol(SLICE, nodes) {

    }

    create_topology_anillo(SLICE, nodes) {

    }

    create_topology_bus(SLICE, nodes) {

    }

    async create_slice_from_template(SLICE) {
        console.log("create_slice_from_template");
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

        let allow_delete_or_edit_vm = false;
        let allow_delete_links_available = false;
        let allow_create_link = false;
        let allow_save_structure = false;

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
                    const UPDATED_VMS = await this.delete_vm(VMS);
                    if (UPDATED_VMS) {
                        // VMS = UPDATED_VMS;
                    }
                    break;
                case 5: // DELETE LINK
                    if (!allow_delete_links_available) {
                        console.log("Primero debe agregar un enlace");
                        break;
                    }
                    const UPDATED_LINKS = await this.delete_link(LINKS)
                    if (UPDATED_LINKS) {
                        // LINKS = UPDATED_LINKS;
                    }
                    break;
                case 6: // SAVE ADVANCE AND EXIT
                    if (!allow_save_structure) {
                        console.log("No hay cambios para guardar");
                        break;
                    }
                    const response = await this.save_advance(SLICE);
                    if (response.message === "success") {
                        console.log("Avance guardado");
                    }
                    return;
                case 7: // NEXT
                    return SLICE;
                case 0: // CANCEL
                    return;
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

            // console.log(`vms: ${JSON.stringify(VMS)}`);
            // console.log(`links: ${JSON.stringify(LINKS)}`);
            console.log(`structure: ${JSON.stringify(STRUCTURE)}`);
        }
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
        STRUCTURE.visjs.nodes[new_vm.vm_name] = { label: new_vm.vm_name, figure: "server" };
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
        const result = await response.json();
        return result;
    }

    async fetch_draft_slices() {
        const urlDraftSlices = this.BASE_URL + this.#ENDPOINT_DRAFT_SLICE;
        const response = await fetch(urlDraftSlices, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        })
        const result = await response.json();
        for (let slice of result.slices) {
            this.#options_create_slice[0].choices.unshift({ name: "Continuar con slice: " + slice.deployment.details.project_name })
        }

        let formated_draft_slices = result.slices.map((slice) => {
            return {
                nombre: slice.deployment.details.project_name,
                topología: slice.deployment.details.topology,
                plataforma: slice.deployment.platform,
                visualizar: slice.deployment.details.graph_url
            }
        })

        console.table(formated_draft_slices);
    }
}

export default ManagerFlow
