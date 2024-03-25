# APP registro camiones para SISINTE

## Project setup

### Se recomienda utilizar node en su version 20.x.x o superior

## Instalar dependencias del proyecto

- npm install

## Para desplegar el proyecto en producción

- npm run dev

## Para cosntruir el proyecto a producción

- npm run build

## Configuraciones globales

Para poder configurar el proyecto en local es necesario modificar 2 archivos

- src/main.js Cambiar las lineas del "baseUrl" de axios y configurar la url localhost
- src/stores/generalStore.js Cambiar la variable VIDEO_PATH a la local y viceversa para producción

## Actualizaciones de versión

La aplicación tiene una funcionalidad para que detecte las nuevas versiones, pero depende de la actualización manual de 3 variables

- package.json Actualizar la versión
- src/main.js Actualizar el header['app-version'] a la versión que se va a actualizar y la linwa window.appVersion

## Configuración de subdominio

Por default la configuración de Vite crea un build de la raiz donde estemos trabajando, para configurar un build en un subdominio tenemos que configurar los siguientes archivos

- package.json En la sección de Scrips "build": "vite build --base /laRutaAElejir/ --outDir dist", en caso contrario solamente dejar "vite build"
- src/routes/index.js Añadir la ruta del subdominio a las que necesitemos hacer prueba

## Liciencia

Este software fue creado en Plasticos Especiales garen S.A de C.V y no es de codigo abierto
