#!/usr/bin/env node

import inquirer from 'inquirer';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

import AdministratorFlow from './flow_administrator.js';
import ManagerFlow from './flow_manager.js';
import ClientFlow from './flow_client.js';

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
    },
    {
        username: 'willy',
        email: 'willy@gmail.com',
        password: 'willy',
        role: 'admin'
    }
]

// main app
async function launch() {
    let answers;
    do {
        console.log(figlet.textSync("Orchestator"));
        console.log("¡Bienvenido a la app CLI del orquestador Cloud!"); 
        answers = await inquirer.prompt(start);
        switch(answers.option){
            case 1: // request login
                await validate();
                break;
            case 2: // funcion para cambiar de contraseña con correo asociado
                await update_pswd();
                break;
        }
        console.clear();
    } while (answers.option!==0)
    console.log("...Cerrando programa");
    process.exit(1);
}

// validation of credentials
async function validate(){
    console.log("Ingrese sus credenciales\n");
    const answers = await inquirer.prompt(login);
    const valid_usr = credentials.find(usr => usr.username === answers.username);
    const spinner = createSpinner('Validando credenciales...').start();
    await sleep();
    
    if(valid_usr && valid_usr.username === answers.username){
    
        spinner.success({text: 'Credenciales correctas'});

        console.clear();
        console.log(figlet.textSync(valid_usr.role));

        // redirecting according role
        let flow;
        switch (valid_usr.role){
            case 'admin':
                flow = new AdministratorFlow();
                await flow.start();
                break;
            case 'manager':
                flow = new ManagerFlow();
                await flow.start(valid_usr);
                break;
            case 'client':
                flow = new ClientFlow();
                await flow.start();
                break;
        }
    }
    // invalid user
    else{
        spinner.error({text: 'Credenciales incorrectas'});
    }
}

// update password flow
async function update_pswd(){
}

// ---------- INQUIRER PROMPTS ---------- //

// start app prompt
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

// login inputs prompt
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

launch();