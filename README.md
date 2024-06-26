# Instalación

La CLI App para Cloud computing se podrá emplear haciendo uso de los archivos que incluye este repositorio. Para estos pasos, se deberá clonar la información como usuario **root**.

Podrá seguir los siguientes pasos para la descarga:

```bash {"id":"01HWB4H0QJW56YEFS5WA2VDN5V"}
sudo -i
git clone https://github.com/smavend/CLI-App_CloudComputing
cd CLI-App_CloudComputing
```

Una vez que se encuentre en la ruta del directorio creado, podrá continuar con los próximos pasos.

# Pasos para arranque

Deberá ejecutar el srcipt `init.sh`, el cual validará que se cumplan con los siguientes requerimientos:

- Node.js versión 18.0.0 en adelante
- npm versión 9.0.0 en adelante

Para ello debe correr el siguiente comando en el directorio en el que clonó el repositorio:

```bash {"id":"01HWB4H0QJW56YEFS5WD3HDZ16"}
bash init.sh
```

Finalmente, cuando se obtenga un _setup_ exitoso, se debe ejecutar el siguiente comando para abrir la CLI app:

```bash {"id":"01HWB4H0QJW56YEFS5WE4GSP7X"}
node index.js
```
A partir de dicha ejecución, se puede navegar mediante el servicio siguiendo las opciones ofrecidas en el menú de la consola.

![image](https://github.com/smavend/CLI-App_CloudComputing/assets/105998272/8e6cd7bd-fae8-4f17-99a5-75022f2a42ac)
