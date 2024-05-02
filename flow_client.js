import inquirer from "inquirer";

class ClientFlow{

    #options_client = [
        {
            type: 'rawlist',
            name: 'res',
            message: 'Seleccione una opción: ',
            choices: [
                {name: 'Listar slices', value: 1},
                {name: 'Cambiar contraseña', value: 2},
                {name: 'Ayuda', value: 3},
                {name: 'Cerrar sesión', value: 4}
            ]
        }
    ]

    async start(){
        let answer;
        do{
            answer = await inquirer.prompt(this.#options_client);
            switch(answer.res){
                case 1: // list slices
                    break;
                case 2: // update passwd
                    break;
                case 3: // help
                    break;
            }
          } while(answer.res !== 4);
    }
}

export default ClientFlow;