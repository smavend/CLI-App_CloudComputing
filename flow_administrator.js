import inquirer from "inquirer";

class AdministratorFlow{

    #options_admin = [
        {
            type: 'rawlist',
            name: 'res',
            message: 'Seleccione una opción:',
            choices: [
                {name: 'Crear nuevo usuario', value: 1},
                {name: 'Editar permisos de usuario', value: 2},
                {name: 'Cerrar cesión', value: 3}
            ]
        }
    ]

    async start(){
        let answer;
        do{
            answer = await inquirer.prompt(this.#options_admin);
            switch(answer.res){
                case 1:
                    break;
                case 2:
                    break;
            }
        } while(answer.res !== 3);
        console.log('Administrator Flow started');
    }
}

export default AdministratorFlow;