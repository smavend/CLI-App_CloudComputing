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

// 
const start = [
    {
        type: 'list',
        name: 'option',
        message: 'Escoja una opción para continuar',
        choices: [
            {name: 'Iniciar sesión', value: 1},
            {name: 'Olvidé mi contraseña', value: 2},
            {name: 'Salir', value: 0}
        ],
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

// options for admin menu
const options_manager = [
    {
        type: 'rawlist',
        name: 'options_admin',
        message: 'Seleccione una opción:',
        choices: [
            {name: 'Ver detalle slice', value: 'show_slice'},
            {name: 'Crear slice', value: 'new_slice'},            
            {name: 'Gestionar slices', value: 'manage_slices'},
            {name: 'Monitoreo', value: 'monitoring'},
            {name: 'Configuración', value: 'config'},
            {name: 'Cambiar contraseña', value: 'update_pswd'},
            {name: 'Cerrar sesión', value: 'logout'},
            {name: 'Ayuda', value: 'help'}
        ]
    }
]

// actions if admin user
function menu_admin(user){
   // admin menu 
}

// options for client menu
const options_client = [
    {
        type: 'rawlist',
        name: 'options_client',
        message: 'Seleccione una opción: ',
        choices: [
            {name: 'Listar slices', value: 'list_slice'},
            {name: 'Cambiar contraseña', value: 'update_pswd'},
            {name: 'Cerrar sesión', value: 'logout'},
            {name: 'Ayuda', value: 'help'}
        ]
    }
]

// actions if client user
async function menu_client(user){
    let answers;
    do {
        answers = await inquirer.prompt(options_client);
        switch(answers.options_client){
            case "list_slice":
                break;
            case "update_pswd":
                await update_pswd();
                break;
            case "logout":
                console.clear();
                await launch();
                break;
            case "help":
                break;
        }
    } while(answers.options_client !== 'logout')
}

// options for manager menu
const options_admin = [
    {
        type: 'rawlist',
        name: 'options_admin',
        message: 'Seleccione una opción:',
        choices: [
            {name: 'Crear nuevo usuario', value: 'new_user'},
            {name: 'Editar permisos de usuario', value: 'edit_rules'},
        ]
    }
]

// actions if manager user
async function menu_manager(user){
    // menu para manager
    let answers;
    do {
        answers = await inquirer.prompt(options_manager);
        switch(answers.options_admin){
            case "show_slice":
                break;
            case "new_slice":
                break;
            case "manage-slices":
                break;
            case "monitoring":
                break;
            case "config":
                break;
            case "update_pswd":
                await update_pswd();
                break;
            case "help":
                break;
            case "logout":
                console.clear();
                await launch();
                break;
        }
    } while(answers.options_admin !== 'logout')
}

async function update_pswd(){
}

// validation of credentials
async function validate(){
    console.log("Ingrese sus credenciales\n");
    const answers = await inquirer.prompt(login);
    const valid_usr = credentials.find(usr => usr.username === answers.username);
    const spinner = createSpinner('Validando credenciales...').start();
    await sleep();
    
    if(valid_usr){
        if(valid_usr.password === answers.password){
            // valid user
            spinner.success({text: 'Credenciales correctas'});

            console.clear();
            console.log(figlet.textSync(valid_usr.role));
            // redirecting according role
            switch (valid_usr.role){
                case 'client':
                    await menu_client(valid_usr);
                    break;
                case 'manager':
                    await menu_manager(valid_usr);
                    break;
                case 'admin':
                    await menu_admin(valid_usr);
                    break;
            }
        }
        // invalid user
        else{
            spinner.error({text: 'Credenciales incorrectas'});
        }
    }
    // invalid user
    else{
        spinner.error({text: 'Credenciales incorrectas'});
    }
}

// main app
async function launch() {
    console.log(figlet.textSync("Orchestator"));
    console.log("¡Bienvenido a la app CLI del orquestador Cloud!"); 
    let answers;
    do {
        answers = await inquirer.prompt(start);
        switch(answers.option){
            case 1:
                await validate();
                break;
            case 2:
                // funcion para cambiar de contraseña con correo asociado
                await update_pswd();
                break;
            case 0:
                console.log("...Cerrando programa");
                process.exit(1);
                break;
        }
    } while (answers.option!==0)
}

launch();