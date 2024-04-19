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
        role: 'manager'
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
const options_admin = [
    {
        type: 'list',
        name: 'options_admin',
        choices: [
            {name: 'Listar slices', value: 1},
            {name: 'Intentar nuevamente', value: 1},
            {name: 'Cambiar contraseña', value: 2},
            {name: 'Cerrar sesión', value: 0}
        ]
    }
]

// actions if admin user
function menu_admin(user){
    inquirer
    .prompt(options_admin)
}

// options for client menu
const options_client = [
    {
        
    }
]

// actions if client user
function menu_client(user){
    // menu para user
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