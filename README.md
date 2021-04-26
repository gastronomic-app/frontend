# Delivery Food Frontend

Aplicación de domicilios gastronómicos para la materia Proyecto 1 de la Universidad del Cauca.

Hoy en día los domicilios de gastronomía se han convertido en una necesidad para el mundo, debido a situaciones como: la pandemia del COVID-19, largas jornadas laborales o de estudio, el cuidado de los niños, entre otras. Esto ha generado que las personas no tengan tiempo para llevar a cabo las actividades culinarias, ocasionado en buena parte, que éstas sean cedidas o endosadas a otras personas, restaurantes, etc. Situación que podría afianzarse aún más en el futuro por la crisis sanitaria y las tendencias profesionales.

---

## Tecnologías

- [Vue js](https://vuejs.org/)
- [GraphQL](https://apollo.vuejs.org/)
- [Testing Library](https://testing-library.com/)

---

## Extensiones para Visual Studio Code

- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- [VS Code Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)
- [Editor Config](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [Indent Rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow)
- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
- [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)

---

## Pasos para ejecutar la aplicación

1. Se recomienda utilizar **Node js 12.22** o superior
2. Instalar las dependencias contenidas en **package.json** usando el comando `npm install` o `npm i`
3. Ejecutar el proyecto con `npm run serve`
4. Abrir el navegador e ir a la dirección <http://localhost:8080/> o <http://localhost:8081/>

---

## API GraphQL

Para iniciar la interfaz gráfica de Graph*i*QL, ir a la dirección <http://localhost:8000/graphql> o <http://127.0.0.1:8000/graphql>

### Queries

```
query consultar {
  allEnterprises {
    edges {
      node {
        id
        name
        location
        products {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
}
```

### Mutations

#### Crear establecimiento
```
mutation crear {
  createEnterprise(input: {name: "nombre del establecimiento", location: "dirección"}) {
    enterprise {
      id
      name
      location
    }
  }
}
```

#### Actualizar establecimiento
```
mutation actualizar {
  updateEnterprise(input: {id: "RW50ZXJwcmlzZU5vZGU6Mg==", name: "nuevo nombre"}) {
    enterprise {
      id
      name
    }
  }
}
```

#### Eliminar establecimiento
```
mutation eliminar {
  deleteEnterprise(input: "RW50ZXJwcmlzZU5vZGU6Mg==") {
    enterprise {
      id
      name
      location
    }
  }
}
```
