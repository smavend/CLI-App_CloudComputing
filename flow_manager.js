import inquirer from "inquirer";
import figlet from 'figlet';

class ManagerFlow{
    
    constructor(TOKEN){
        this.TOKEN = TOKEN;
    }

    #options_manager = [
        {
            type: 'list',
            name: 'option',
            message: 'Seleccione una opción',
            choices: [
                {name: 'Lista de slices', value: 1},
                {name: 'Crear slice', value: 2},
                {name: 'Editar slices', value: 3},
                {name: 'Borrar slices', value: 4},
                {name: 'Monitoreo de recursos', value: 5},
                {name: 'Cambiar contraseña', value: 6},
                {name: 'Ayuda', value: 7},
                {name: 'Cerrar sesión', value: 0}
            ]
        }
    ]

    #show_slices_options = [
        {
            type: 'list',
            name: 'res',
            message: 'Selecciona una opción:',
            choices: [
                {name: 'Ver detalles de slice', value: 1},
                {name: 'Regresar', value: 2}
            ]
        }
    ]

    #options_create_slice_start = [
        {
            type: 'input',
            name: 'slice_name',
            message: 'Ingrese el nombre del slice:'
        },
        {
            type: 'list',
            name: 'method',
            message: 'Seleccione el medio para crear el slice:',
            choices: [
                {name: 'Crear desde cero', value: 'from_scratch'},
                {name: 'Crear desde topología', value: 'from_topology'},
                {name: 'Crear desde plantilla', value: 'from_template'}
            ]
        }
    ]

    #options_vms_and_links = [
        {
            type: 'list',
            name: 'option',
            message: 'Seleccione una opción',
            choices: [
                {name: 'Agregar máquina virtual', value: 1},
                {name: 'Agregar enlace', value: 2},
                {name: 'Editar máquina virtual', value: 3},
                {name: 'Borrar máquina virtual', value: 4},
                {name: 'Borrar enlace', value: 5},
                {name: 'Siguiente', value: 0}
            ]
        }
    ]

    #options_create_vm = [
        {
            type: 'input',
            name: 'vm_name',
            message: 'Ingrese el nombre de la máquina virtual: '
        },
        {
            type: 'list',
            name: 'vm_os',
            message: 'Seleccione el sistema operativo de la máquina virtual: ',
            choices: [
                {name: 'Windows', value: 'windows'},
                {name: 'Linux', value: 'linux'},
                {name: 'MacOS', value: 'macos'}
            ]
        },
        {
            type: 'input',
            name: 'vm_cpu',
            message: 'Ingrese la cantidad de CPUs para la máquina virtual: '
        },
        {
            type: 'input',
            name: 'vm_memoria',
            message: 'Ingrese la memoria RAM para la máquina virtual: '
        },
        {
            type: 'input',
            name: 'vm_storage',
            message: 'Ingrese el almacenamiento disponible para la máquina virtual: '
        },
        {
            type: 'confirm',
            name: 'vm_internet',
            message: '¿La máquina virtual tiene acceso a internet?'
        }
    ]

    #options_create_link = [
        {
            type: 'input',
            name: 'link_name',
            message: 'Ingrese el nombre del enlace: '
        },
        {
            type: 'list',
            name: 'node_1',
            message: 'Seleccione el punto de conexión 1: ',
            choices: [
                {name: 'Nodo 1', value: 'node_1'},
                {name: 'Nodo 2', value: 'node_2'}
            ]
        },
        {
            type: 'list',
            name: 'node_2',
            message: 'Seleccione el punto de conexión 2: ',
            choices: [
                {name: 'Nodo 1', value: 'node_1'},
                {name: 'Nodo 2', value: 'node_2'}
            ]
        }
    ]

    #options_delete_vm = [
        {
            type: 'list',
            name: 'vm_name',
            message: 'Seleccione la máquina virtual a borrar: ',
            choices: [ // TODO: fetch actual vms
                {name: 'VM1', value: 'vm1'},
                {name: 'VM2', value: 'vm2'}
            ]
        }
    ]

    #options_delete_link = [
        {
            type: 'list',
            name: 'link_name',
            message: 'Seleccione el enlace a borrar: ',
            choices: [ // TODO: fetch actual links
                {name: 'Link1', value: 'link1'},
                {name: 'Link2', value: 'link2'}
            ]
        }
    ]

    async start(){
        console.log(figlet.textSync('Manager'));
        while (true) {
            const answer = await inquirer.prompt(this.#options_manager);
            switch(answer.option){
                case 1:
                    await this.show_slices();
                    break;
                case 2:
                    await this.create_slice();
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    break;
                case 0:
                    console.clear();
                    return;
            }
        }
    }

    async show_slices(){
        const response = await this.fetch_slices(this.TOKEN);
        const slices = response.slices;
        console.log(`Se encontraron ${slices.length} slices`);
        console.table(slices);
        let answer;
        do {
            answer = await inquirer.prompt(this.#show_slices_options);
            console.log(answer);
        } while (answer.res != 2)
    }

    async create_slice(){
        let SLICE = {};
        let answer = await inquirer.prompt(this.#options_create_slice_start);
        SLICE.name = answer.slice_name;

        switch(answer.method){
            case 'from_scratch':
                answer = await this.create_slice_from_scratch();
                break;
            case 'from_topology':
                answer = await this.create_slice_from_topology();
                break;
            case 'from_template':
                answer = await this.create_slice_from_template();
                break;
        }
    }

    async create_slice_from_scratch(){
        console.log('create_slice_from_scratch');
        await this.create_vms_and_links();
    }

    async create_slice_from_topology(){
        console.log('create_slice_from_topology');
    }

    async create_slice_from_template(){
        console.log('create_slice_from_template');
    }

    async create_vms_and_links(vms_created, links_created, structure_created){
        let VMS = vms_created ? vms_created : [];
        let LINKS = links_created ? links_created : [];
        let STRUCTURE = structure_created ? structure_created : [];

        while (true){
            let answer = await inquirer.prompt(this.#options_vms_and_links);
            switch (answer.option){
                case 1:
                    const vm = await this.create_vm();
                    VMS.push(vm);
                    break;
                case 2:
                    const link = await this.create_link();
                    LINKS.push(link);
                    break;
                case 3:
                    await this.edit_vm();
                    break;
                case 4:
                    VMS = await this.delete_vm(VMS);
                    break;
                case 5:
                    LINKS = await this.delete_link(LINKS);
                    break;
                case 0:
                    return {VMS, LINKS, STRUCTURE};
            }
            console.log(`vms: ${JSON.stringify(VMS)}`)
            console.log(`links: ${LINKS}`)
        }
    }

    async create_vm(){
        return await inquirer.prompt(this.#options_create_vm);
    }

    async create_link(){
        return await inquirer.prompt(this.#options_create_link);
    }

    async delete_vm(VMS){
        const answer = await inquirer.prompt(this.#options_delete_vm);
        UPDATED_VMS = VMS.filter(vm => vm.name != answer.vm_name);
        return UPDATED_VMS;
    }

    async delete_link(LINKS){
        const answer = await inquirer.prompt(this.#options_delete_vm);
        UPDATED_LINKS = LINKS.filter(link => link.name != answer.link_name);
        return UPDATED_LINKS;
    }

    async fetch_slices(TOKEN){
      const response = await fetch('http://127.0.0.1:5000/slices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': TOKEN
        }
      });
      const result = await response.json();
      return result;
    }
}

export default ManagerFlow;