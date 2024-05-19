#!/usr/bin/env node

import inquirer from 'inquirer';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import jwt from 'jsonwebtoken';

import AdministratorFlow from './flow_administrator.js';
import ManagerFlow from './flow_manager.js';
import ClientFlow from './flow_client.js';

let TOKEN;

async function loginUser(username, password){
  const response = await fetch('http://localhost:5000/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, password})
  });
  const result = await response.json();
  return result;
}

// main app
async function launch() {
    let answers;
    do {
        console.log(figlet.textSync("Slice Manager"));
        console.log("¡Bienvenido a la app CLI del orquestador Cloud!"); 
        answers = await inquirer.prompt(start_options);
        switch(answers.option){
            case 1: // request login
                await login();
                break;
            case 2: // funcion para cambiar de contraseña con correo asociado
                await update_pswd();
                break;
        }
    } while (answers.option!==0)
    console.log("Cerrando programa...");
}

// validation of credentials
async function login(){
    console.log("Ingrese sus credenciales\n");
    const answers = await inquirer.prompt(login_options);
    const spinner = createSpinner('Validando credenciales...').start();

    const response = await loginUser(answers.username, answers.password);

    if (response.message === 'success'){
      spinner.success({text: 'Credenciales correctas'});

      TOKEN = response.token;
      const decoded = jwt.verify(TOKEN, 'secret');

      console.clear();
      let flow;
      switch(decoded.role){
        case 'admin':
          flow = new AdministratorFlow(TOKEN);
          await flow.start();
          break;
        case 'manager':
          flow = new ManagerFlow(TOKEN);
          await flow.start();
          break;
        case 'client':
          flow = new ClientFlow(TOKEN);
          await flow.start();
          break;
      } 
    }else {
      console.clear();
      spinner.error({text: 'Credenciales incorrectas'});
    }
}

// update password flow
async function update_pswd(){
}

// start app prompt
const start_options = [
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
const login_options = [
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