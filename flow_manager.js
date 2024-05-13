import inquirer from "inquirer";

class ManagerFlow{

    #SLICES = [
      {
        id: 1,
        nombre: "Slice1",
        usuario_id: "1",
        topologia: "lineal",
        estado: "Activo",
        numerodevms: "3",
        fechadecreacion: "2024-05-12T12:30:13",
        zonadisponibilidad: "Zona 2",
      },
      {
        id: 2,
        nombre: "Slice2",
        usuario_id: "1",
        topologia: "malla",
        estado: "Desactivo",
        numerodevms: "4",
        fechadecreacion: "2024-05-12T23:40:13",
        zonadisponibilidad: "Zona 1",
      },
    ]

    #options_manager = [
        {
            type: 'rawlist',
            name: 'options_admin',
            message: 'Seleccione una opción:',
            choices: [
                {name: 'Lista de slices', value: 1},
                {name: 'Crear slice', value: 2},
                {name: 'Gestionar slices', value: 3},
                {name: 'Monitoreo', value: 4},
                {name: 'Cambiar contraseña', value: 5},
                {name: 'Ayuda', value: 6},
                {name: 'Cerrar sesión', value: 0}
            ]
        }
    ]

    #options_create_slice = [
        {
            type: 'input',
            name: 'sliceName',
            message: 'Ingrese el nombre del slice:'
        },
        {
            type: 'list',
            name: 'topology',
            message: 'Seleccione una topología predefinida:',
            choices: ['Star', 'Tree', 'Mesh', 'Ring']
        },
        {
            type: 'list',
            name: 'securityRules',
            message: 'Seleccione una regla de acceso/salida a internet o cree una nueva:',
            choices: [
                'Permitir todo el tráfico saliente',
                'Bloquear todo el tráfico saliente',
                'Permitir todo el tráfico entrante',
                'Bloquear todo el tráfico entrante',
                'Permitir tráfico HTTP (puerto 80)',
                'Permitir tráfico HTTPS (puerto 443)',
                'Crear una nueva regla'
            ]
        },
        {
            type: 'number',
            name: 'numVM',
            message: 'Número de VMs:',
            filter: Number
        }
    ]

    #options_config_vm = [
        {
            type: 'input',
            name: 'vmCPU',
            message: 'Ingrese la configuración de CPU: '
        },
        {
            type: 'input',
            name: 'vmMemory',
            message: 'Ingrese la configuración de memoria RAM: '
        },
        {
            type: 'input',
            name: 'vmStorage',
            message: 'Ingrese la configuración de almacenamiento: '
        },
        {
            type: 'list',
            name: 'vmAvailabilityZone',
            message: 'Seleccione la zona de disponibilidad: ',
            choices: ['Zona A', 'Zona B', 'Zona C']
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

    async show_home_manager(username){
        // fetch slices data from orchestrator server
        console.log('-----\n' + username + ' > Home \n-----');
    }

    async show_create_manag(user, optionName){
        this.show_home_level1(user.username, optionName);
        const answers = await inquirer.prompt(this.#options_create_slice);
        switch(answers.create_options){
            case 1:
                console.log('Utilizando template...');
                break;
            case 2:
                const sliceConfig = await inquirer.prompt(this.#options_create_slice);
                
                const vmConfigs = [];
                for (let i = 0; i < sliceConfig.numVM; i++) {
                    console.log(`Configuración de la VM #${i + 1}`);
                    await inquirer.prompt(this.#options_config_vm);
                }

                const spinner = createSpinner('Creando Slice ...').start();
                setTimeout(() => {spinner.stop();}, 1200);
                menu_manager(user);
                break;
            case 3:
                break;
        }
    } 

    async show_home_level1(username, optionName){
      console.log('-----\n' + username + ' > Home > '+ optionName + '\n-----');
    }

    async show_slices(){
      console.log(`Se encontraron ${this.#SLICES.length} slices`);
      console.table(this.#SLICES);
      let answer;
      do {
        answer = await inquirer.prompt(this.#show_slices_options);
        console.log(answer);
      } while (answer.res != 2)
    }

    async start(user){
        let answer;
        do {
            // await this.show_home_manager(user.username);
            answer = await inquirer.prompt(this.#options_manager);
            let selectedOptionName = this.#options_manager[0].choices.find(choice => choice.value === answer.options_admin).name;

            switch(answer.options_admin){
                case 1: // show list of slices
                    await this.show_slices();
                    break;
                case 2: // create slice
                    await this.show_create_manag(user,selectedOptionName);
                    break;
                case 3: // manage slices
                    break;
                case 4: // monitoring resources
                    break;
                case 5: // update password
                    break;
                case 6: // help
                    break;
                case 0: // logout
                    break;
            }
        } while(answer.options_admin !== 0)
    }
}

export default ManagerFlow;