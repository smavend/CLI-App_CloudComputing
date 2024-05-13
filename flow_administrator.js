import inquirer from "inquirer";

class AdministratorFlow{

  #USERS = [
    {
      id: 1, 
      usuario: 'Willy Huallpa', 
      contraseña: 'willy', 
      rol: 'regular', 
    }, 

  ]

    #options_admin = [
        {
            type: 'rawlist',
            name: 'res',
            message: 'Seleccione una opción:',
            choices: [
                {name: 'Listar usuarios', value: 1},
                {name: 'Crear nuevo usuario', value: 2},
                {name: 'Editar permisos de usuario', value: 3},
                {name: 'Cerrar cesión', value: 4}
            ]
        }
    ]

    #show_users_options = [
      {
        type: 'list',
        name: 'res',
        message: 'Selecciona una opción:',
        choices: [
          {name: 'Ver slices de usuario', value: 1},
          {name: 'Regresar', value: 2}
        ]
      }
    ]

    async show_users(){
      console.log(`Se encontraron ${this.#USERS.length} slices`);
      console.table(this.#USERS);
      let answer;
      do {
        answer = await inquirer.prompt(this.#show_users_options);
        console.log(answer);
      } while (answer.res != 2)
    }

    async start(){
        let answer;
        do{
            answer = await inquirer.prompt(this.#options_admin);
            switch(answer.res){
                case 1:
                  await this.show_users();
                  break;
                case 2:
                    break;
                case 3:
                    break;
            }
        } while(answer.res !== 4);
        console.log('Administrator Flow started');
    }
}

export default AdministratorFlow;