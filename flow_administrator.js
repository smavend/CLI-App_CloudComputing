import inquirer from "inquirer";
import figlet from "figlet";
import fetch from "node-fetch";
import crypto from "crypto"; // Importa el módulo crypto para hashing

class AdministratorFlow {
    constructor(TOKEN, URL) {
        this.TOKEN = TOKEN;
        this.URL = URL;
        this._USERS = []; // Uso de convención de nombre con prefijo de guión bajo para indicar privacidad
    }

    #options_admin = [
        {
            type: "rawlist",
            name: "res",
            message: "Seleccione una opción:",
            choices: [
                { name: "Listar usuarios", value: 1 },
                { name: "Crear nuevo usuario", value: 2 },
                { name: "Editar permisos de usuario", value: 3 },
                { name: "Cerrar sesión", value: 4 },
            ],
        },
    ];

    #options_create_user = [
        {
            type: "input",
            name: "usuario",
            message: "Ingrese el nombre del usuario: ",
            validate: (answer) => {
                if (!answer) {
                    return "Ingrese un nombre de usuario";
                }
                return true;
            },
        },
        {
            type: "password",
            name: "password",
            message: "Ingrese la contraseña del usuario: ",
            validate: (answer) => {
                if (!answer) {
                    return "Ingrese una contraseña";
                }
                return true;
            },
        },
        {
            type: "rawlist",
            name: "rol",
            message: "Seleccione el rol del usuario: ",
            choices: [
                { name: "Regular", value: "regular" },
                { name: "Manager", value: "manager" },
            ],
        },
    ];

    async start() {
        console.log(figlet.textSync("Administrador"));
        while (true) {
            let answer = await inquirer.prompt(this.#options_admin);
            switch (answer.res) {
                case 1:
                    await this.show_users();
                    break;
                case 2:
                    await this.post_user();
                    break;
                case 3:
                    break;
                case 4:
                    this.TOKEN = null;
                    console.clear();
                    return;
            }
        }
    }

    async show_users() {
        const response = await this.get_users();
        console.log(`Se encontraron ${response.users.length} usuario(s)`);
        console.table(response.users);
    }

    async post_user() {
        const userData = await inquirer.prompt(this.#options_create_user);
        const hashedPassword = this.hashPassword(userData.password); // Calcula el hash SHA-256 de la contraseña

        const new_user = {
            username: userData.usuario,
            passwordHash: hashedPassword, // Utiliza una variable diferente para el hash de la contraseña
            role: userData.rol,
        };

        const ENDPOINT = `${this.URL}/users`;
        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
            body: JSON.stringify(new_user),
        });

        if (response.status === 411) {
            console.clear();
            return;
        }

        const data = await response.json();
        console.log("Usuario creado exitosamente:", data);
        return data;
    }

    async get_users() {
        const ENDPOINT = `${this.URL}/users`;
        const response = await fetch(ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.TOKEN,
            },
        });

        if (response.status === 411) {
            await handleSessionTimeout();
            return;
        }

        const data = await response.json();
        this._USERS = data.users; // Almacena los usuarios en el campo privado convencional
        return data;
    }

    hashPassword(password) {
        const hash = crypto.createHash("sha256");
        hash.update(password, "utf8"); // Especifica la codificación UTF-8 explícitamente
        return hash.digest("hex");
    }
}

export default AdministratorFlow;
