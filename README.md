# Instalación
La CLI App para Cloud computing se podrá emplear haciendo uso de los archivos que incluye este repositorio. Para estos pasos, se deberá clonar la información como usuario **root**.

Podrá seguir los siguientes pasos para la descarga:
```bash
sudo -i
git clone https://github.com/smavend/CLI-App_CloudComputing
cd CLI-App_CloudComputing
```
Una vez que se encuentre en la ruta del directorio creado, podrá continuar con los próximos pasos.

# Pasos para arranque

Deberá ejecutar el srcipt ```init.sh```, el cual validará que se cumplan con los siguientes requerimientos:

- Node.js versión 16.0.0 en adelante
- npm versión 7.0.0 en adelante

Para ello debe correr el siguiente comando en el directorio en el que clonó el repositorio:
```bash
bash init.sh
```
Finalmente, cuando se obtenga un _setup_ exitoso, se debe ejecutar el siguiente comando para abrir la CLI app:
```bash
node index.js
```
