#!/usr/bin/env node

import inquirer from 'inquirer';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

// for loading animation
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// registered users -> must be from a bd
const credentials = [
    {
        username: 'mavend',
        email: 'beatriz.manrique@pucp.edu.pe',
        password: 'mavend',
        role: 'client'
    },
    {
        username: 'branko',
        email: 'amanrique068@gmail.com',
        password: 'branko',
        role: 'admin'
    }
]

// login inputs
const login = [
    {
        name: 'username',
        message: 'Usuario: ',
        validate: (answer) => {
            if(!answer){
                return 'Ingresar nombre de usuario';
            }
            return true;
        }
    },
    {
        type: 'password',
        name: 'password',
        message: "Contraseña: ",
        mask: '*',
        validate: (answer) => {
            if(!answer){
                return 'Ingresar contraseña';
            }
            return true;
        }
    }
]

// list after invalid credentials
const login2 = {
    type: 'list',
    name: 'option',
    message: 'Escoja una opción para continuar',
    choices: [
        {name: 'Intentar nuevamente', value: 1},
        {name: 'Olvidé mi contraseña', value: 2},
        {name: 'Salir', value: 0}
    ],
}

// call menu after invalid credentials
function retry_login(){
    inquirer.prompt(login2).then(answers => {
        switch(answers.option){
            case 1:
                validate();
                break;
            case 2:
                // funcion para cambiar de contraseña con correo asociado
                break;
            case 0:
                console.log("...Cerrando programa")
                process.exit(1)
                break;
        }
    })
}

// options for admin menu
export const options_admin = [
    {
        type: 'rawlist',
        name: 'options_admin',
        choices: [
            {name: 'Listar slices', value: 'list_slice'},
            {name: 'Crear nuevo slice', value: 'new_slice'},            
            {name: 'Crear nuevo usuario', value: 'new_user'},
            {name: 'Editar permisos de usuario', value: 'edit_rules'},
            {name: 'Imprimir logs de troubleshooting', value: 'trbshoot'},
            {name: 'Listar consumo de recursos del sistema', value: 'list_consumption'},
            {name: 'Cambiar contraseña', value: 'update_pswd'},
            {name: 'Cerrar sesión', value: 'logout'},
            {name: 'Ayuda', value: 'help'}
        ]
    }
]

// actions if admin user
function menu_admin(user){
    inquirer
    .prompt(options_admin).then(answers => {
        switch(answers.options_admin){
            case "list_slice":
                break;
            case "new_slice":
                break;
            case "new_user":
                break;
            case "edit_rules":
                break;
            case "trbshoot":
                break;
            case "list_consumption":
                break;
            case "update_pswd":
                break;
            case "logout":
                break;
            case "help":
                break;
        }
    })
}

// options for client menu
const options_client = [
    {
        type: 'rawlist',
        name: 'options_client',
        choices: [
            {name: 'Listar slices', value: 'list_slice'},
            {name: 'Cambiar contraseña', value: 'update_pswd'},
            {name: 'Cerrar sesión', value: 'logout'},
            {name: 'Ayuda', value: 'help'}
        ]
    }
]

// actions if client user
function menu_client(user){
    inquirer
    .prompt(options_client).then(answers => {
        switch(answers.options_client){
            case "list_slice":
                break;
            case "update_pswd":
                break;
            case "logout":
                break;
            case "help":
                break;
        }
    })
}

// options for manager menu
const options_manager = [
    {

    }
]

// actions if manager user
function menu_manager(user){
    // menu para manager
}

// validation of credentials
function validate(){
    console.log("Ingrese sus credenciales\n\n");
    inquirer.prompt(login).then(async answers => {
        const valid_usr = credentials.find(usr => usr.username === answers.username);
        const spinner = createSpinner('Validando credenciales...').start();

        await sleep();
        if(valid_usr){
            if(valid_usr.password === answers.password){

                // valid user
                spinner.success({text: 'Credenciales correctas'});
                figlet(valid_usr.role,(err1, data1) => {
                    console.log(data1);
                    console.log('Seleccione una opción para continuar:');

                    // redirecting according role
                    switch (valid_usr.role){
                        case 'client':
                            menu_client(valid_usr);
                            break;
                        case 'manager':
                            menu_manager(valid_usr);
                            break;
                        case 'admin':
                            menu_admin(valid_usr);
                            break;
                    }
                })
            }

            // invalid user
            else{
                spinner.error({text: 'Credenciales incorrectas'});
                retry_login();
            }
        }

        // invalid user
        else{
            spinner.error({text: 'Credenciales incorrectas'});
            retry_login();
        }
    })
}

// main app
function launch() {
    figlet("Orquestator", (err, data) => {
        console.log(data);
        console.log("¡Bienvenido a la app CLI del orquestador Cloud!");        
        validate();
    });
}

launch();