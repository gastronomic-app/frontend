<template>
    <div>
    <form>
        <div class="form-group">
            <label for="input-name">Nombre Establecimiento</label>
            <input
            type="text"
            class="form-control"
            id="enterpriseInputName"
            aria-describedby="nameEnterpise"
            placeholder="Nombre del establecimiento"
            v-model="name"
        />
        </div>
        <div class="form-group">
        <label for="location">Direccion Establecimiento</label>
        <input
            type="text"
            class="form-control"
            id="enterpriseInputLocation"
            placeholder="Ubicación del establecimiento"
            readonly
            v-model="location"
        />
        <Geolocation required v-on:value= "ral_Location" showmap="True"/>
        <br />
        </div>
        <!--TODO Habilitar Imagen -->
        <!--
        <div class="input-group">
            <div class="custom-file">
                <input type="file" @change="uploadFiles" multiple accept="image/*" />
            </div>
        </div>
        <div class="form-group">
        <button
            @click="saveImages"
            variant="success"
            class="btn btn-success mb-2 mt-2 mr-2"
        >
            Guardar imagenes
        </button>
        <button
            @click="clearImages"
            variant="danger"
            class="btn btn-danger mb-2 mt-2 mr-2"
        >
            Borrar selección
        </button>
        <button @click="previewImages" class="btn btn-primary mb-2 mt-2 mr-2">
            {{ show_images ? "Ocultar imagenes" : "Visualizar imagenes" }}
        </button>
        </div>
        <div v-if="show_images">
        <img
            v-for="url in images_urls"
            v-bind:key="url"
            v-bind:src="url"
            class="rounded w-25"
            height="200"
            alt="..."
        />
        </div>
        -->
        <!--Horario-->
        <div class="form-group">
        <label for="input-name">Horario de atencion</label>
        <table class="table text-center">
            <thead>
                <th  id="thead__H">Dia de la semana</th>
                <th  id="thead__H">Estado</th>
                <th  id="thead__H">Hora Inicio</th>
                <th  id="thead__H">Hora cierre</th>
            </thead>
            <tbody>
            <tr>
                <th scope="row " id="thead__H">Lunes</th>
                <td>
                    <label class="custom-checkbox" tab-index="0">
                        <input id="CheckboxLunes" type="checkbox" checked />
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td>
                    <input type="time" id="lunesInicio" class="form-control" >
                </td>
                <td>
                    <input type="time" id="lunesCierre" class="form-control" >
                </td>
            </tr>
            <tr>
                <th scope="row" id="thead__H">Martes</th>
                <td>
                    <label class="custom-checkbox" tab-index="1">
                    <input id="CheckboxMartes" type="checkbox" checked />
                    <span class="checkmark"></span>
                </label>
                </td>
                <td>
                    <input type="time" id="martesInicio" class="form-control">
                </td>
                <td>
                    <input type="time" id="martesCierre" class="form-control">
                </td>
            </tr>
            <tr>
                <th scope="row" id="thead__H">Miércoles</th>
                <td>
                    <label class="custom-checkbox" tab-index="2">
                    <input id="CheckboxMiercoles" type="checkbox" checked />
                    <span class="checkmark"></span>
                </label>
                </td>
                <td>
                    <input type="time" id="miercolesInicio" class="form-control">
                </td>
                <td>
                    <input type="time" id="miercolesCierre" class="form-control">
                </td>
            </tr>
            <tr>
                <th scope="row" id="thead__H">Jueves</th>
                <td>
                <label class="custom-checkbox" tab-index="3">
                    <input id="CheckboxJueves" type="checkbox" checked />
                    <span class="checkmark"></span>
                </label>
                </td>
                <td>
                    <input type="time" id="juevesInicio" class="form-control">
                </td>
                <td>
                    <input type="time" id="juevesCierre" class="form-control">
                </td>
            </tr>
            <tr>
                <th scope="row" id="thead__H">Viernes</th>
                <td>
                    <label class="custom-checkbox" tab-index="4">
                    <input id="CheckboxViernes" type="checkbox" checked />
                    <span class="checkmark"></span>
                </label>
                </td>
                <td>
                    <input type="time" id="viernesInicio" class="form-control">
                </td>
                <td>
                    <input type="time" id="viernesCierre" class="form-control">
                </td>
            </tr>
            <tr>
                <th scope="row" id="thead__H">Sábado</th>
                <td>
                    <label class="custom-checkbox" tab-index="5">
                    <input id="CheckboxSabado" type="checkbox" checked />
                    <span class="checkmark"></span>
                </label>
                </td>
                <td>
                    <input type="time" id="sabadoInicio" class="form-control">
                </td>
                <td>
                    <input type="time" id="sabadoCierre" class="form-control">
                </td>
            </tr>
            <tr>
                <th scope="row" id="thead__H">Domingo</th>
                <td>
                    <label class="custom-checkbox" tab-index="6">
                    <input id="CheckboxDomingo" type="checkbox" checked />
                    <span class="checkmark"></span>
                </label>
                </td>
                <td>
                    <input type="time" id="domingoInicio" class="form-control">
                </td>
                <td>
                    <input type="time" id="domingoCierre" class="form-control">
                </td>
            </tr>
        </tbody>
        </table>
    </div>
    <div>
        <label for="input-name">Reseña Establecimiento</label>
        <div class="input-group">
            <div class="input-group-prepend"></div>
            <textarea class="form-control" v-model="historicalReview"></textarea>
        </div>
    </div>
    <br/>
    <button
        v-if="id == null"
        type="button"
        class="btn btn-primary"
        :disabled="inputsEmpty"
        @click="addEnterprise"
    >
        Editar Establecimiento
    </button>
    <button
        v-if="id !== null"
        type="button"
        class="btn btn-primary"
        :disabled="inputsEmpty"
        @click="editEnterprise"
    >
        Actualizar empresa
    </button>
        <button
        v-if="id !== null"
        id="buttonBack"
        type="button"
        class="btn btn-black"
        :disabled="inputsEmpty"
        @click="ReturnEnterprises"
    >
        Volver
    </button>
    </form>
    <br>
</div>
</template>

<script>

import Geolocation from "@/components/geolocation/Geolocation.vue"

export default {
    name: "EnterpriseForm",
    components: {
    Geolocation
    },
    props: {
    /**
     * Se asigna null si el formulario
     * no es de actualización
     *
     */

    id: {
        type: String,
        required: false,
        default: null,
    },
    },
    data() {
    return {
      // Nombre del establecimiento
        name: "",
      // Ubicación del establecimiento
        location: null,
      // Horario de atencion
        businessHours: "",
      // Reseña
        historicalReview: "",
      // Ciudad donde se encuentra el establecimiento
        city: null,
    };
},
/**
   * Ciclo de vida del componente
   * donde realiza la consulta si llega un id por props
   */
async mounted() {
    // Si el id existe, realiza la consulta
    if (this.id) {
        await this.$apollo
        .query({
          // Establece la consulta para recuperar la empresa
        query: require("@/graphql/enterprise/enterprise.gql"),
          // Define las variables
        variables: {
            id: this.id,
        },
        })
        // El método query devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          // En este caso se usa para cargar el formulario
          // con los datos obtenidos
        this.name = response.data.enterprise.name;
        this.location = response.data.enterprise.location;
        this.businessHours = JSON.parse(response.data.enterprise.businessHours);
        this.historicalReview = response.data.enterprise.historicalReview;

        });
        //Cambia los valores en el formulario con respecto a lo que venga del back
        document.getElementById("CheckboxLunes").checked = this.businessHours.lunes.estado;
        document.getElementById("lunesInicio").value = this.businessHours.lunes.horaI;
        document.getElementById("lunesCierre").value = this.businessHours.lunes.horaF;

        document.getElementById("CheckboxMartes").checked = this.businessHours.martes.estado;
        document.getElementById("martesInicio").value = this.businessHours.martes.horaI;
        document.getElementById("martesCierre").value = this.businessHours.martes.horaF;

        document.getElementById("CheckboxMiercoles").checked = this.businessHours.miercoles.estado;
        document.getElementById("miercolesInicio").value = this.businessHours.miercoles.horaI;
        document.getElementById("miercolesCierre").value = this.businessHours.miercoles.horaF;

        document.getElementById("CheckboxJueves").checked = this.businessHours.jueves.estado;
        document.getElementById("juevesInicio").value = this.businessHours.jueves.horaI;
        document.getElementById("juevesCierre").value = this.businessHours.jueves.horaF;

        document.getElementById("CheckboxViernes").checked = this.businessHours.viernes.estado;
        document.getElementById("viernesInicio").value = this.businessHours.viernes.horaI;
        document.getElementById("viernesCierre").value = this.businessHours.viernes.horaF;

        document.getElementById("CheckboxSabado").checked = this.businessHours.sabado.estado;
        document.getElementById("sabadoInicio").value = this.businessHours.sabado.horaI;
        document.getElementById("sabadoCierre").value = this.businessHours.sabado.horaF;

        document.getElementById("CheckboxDomingo").checked = this.businessHours.domingo.estado;
        document.getElementById("domingoInicio").value = this.businessHours.domingo.horaI;
        document.getElementById("domingoCierre").value = this.businessHours.domingo.horaF;
    }
},
methods: {
    makeToast(variant = null, title, info, time) {
        this.$bvToast.toast(info, {
            title: title,
            autoHideDelay: time,
            variant: variant,
            solid: true,
    });
    },
    ral_Location(value){
        this.location = value[0];
        this.city = value[1]
    },
    //Crea la empresa
    addEnterprise() {
        this.$apollo
        .mutate({
          // Establece la mutación de crear
        mutation: require("@/graphql/enterprise/createEnterprise.gql"),
          // Define las variables
        variables: {
            name: this.name,
            location: this.location,
        },
        })
        // El método mutate devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          console.log("creación de empresa:", response.data);
        });
        this.$router.push({ name: "EnterpriseList" });
    },
    ReturnEnterprises(){
        this.$router.push({ name: "EnterpriseList" });
    },
    /**
     * Método que crea actualiza una empresa cuando es precionado el botón
     */
    async editEnterprise() {
        this.$swal.fire({
            title: '¿Está Seguro de realizar la accion?',
            html:`Modificar Establecimiento <br> <b>${this.name}</b>`,
            type: 'warning',
            icon: 'question',
            showCancelButton:true,
            confirmButtonColor:'rgba(255, 68, 0, 0.877)',
            cancelButtonColor:'#111111',
            confirmButtonText:'Si, modificar',
            cancelButtonText:'No, modificar',
            showCloseButton:true,
            showLoaderOnConfirm:true
        }).then(async (result) => {
            if(result.isConfirmed && this.city != ""){
                /*obtener los datos del input y agregarlo a la variable Bussiness_hours*/
                let lunesStatus = document.getElementById("CheckboxLunes").checked;
                let martesStatus = document.getElementById("CheckboxMartes").checked;
                let miercolesStatus = document.getElementById("CheckboxMiercoles").checked;
                let juevesStatus = document.getElementById("CheckboxJueves").checked;
                let viernesStatus = document.getElementById("CheckboxViernes").checked;
                let sabadoStatus = document.getElementById("CheckboxSabado").checked;
                let domingoStatus = document.getElementById("CheckboxDomingo").checked;

                let lunesI = document.getElementById("lunesInicio").value;
                let lunesC = document.getElementById("lunesCierre").value;

                let martesI = document.getElementById("martesInicio").value;
                let martesC = document.getElementById("martesCierre").value;

                let miercolesI = document.getElementById("miercolesInicio").value;
                let miercolesC = document.getElementById("miercolesCierre").value;

                let juevesI = document.getElementById("juevesInicio").value;
                let juevesC = document.getElementById("juevesCierre").value;

                let viernesI = document.getElementById("viernesInicio").value;
                let viernesC = document.getElementById("viernesCierre").value;

                let sabadoI = document.getElementById("sabadoInicio").value;
                let sabadoC = document.getElementById("sabadoCierre").value;

                let domingoI = document.getElementById("domingoInicio").value;
                let domingoC = document.getElementById("domingoCierre").value;

                this.businessHours =JSON.stringify({
                        "lunes":{
                                "estado":lunesStatus,
                                "horaI":lunesI,
                                "horaF":lunesC},
                        "martes":{
                                "estado":martesStatus,
                                "horaI":martesI,
                                "horaF":martesC},
                        "miercoles":{
                                "estado":miercolesStatus,
                                "horaI":miercolesI,
                                "horaF":miercolesC},
                        "jueves":{
                                "estado":juevesStatus,
                                "horaI":juevesI,
                                "horaF":juevesC},
                        "viernes":{
                                "estado":viernesStatus,
                                "horaI":viernesI,
                                "horaF":viernesC},
                        "sabado":{
                                "estado":sabadoStatus,
                                "horaI":sabadoI,
                                "horaF":sabadoC},
                        "domingo":{
                                "estado":domingoStatus,
                                "horaI":domingoI,
                                "horaF":domingoC}
                        });
        this.$apollo
        .mutate({
          // Establece la mutación de editar
        mutation: require("@/graphql/enterprise/updateEnterprise.gql"),
          // Define las variables
        variables: {
            id: this.id,
            name: this.name,
            location: this.location,
            businessHours: this.businessHours,
            historicalReview: this.historicalReview,
            city: this.city,
        },
        })
        // El método mutate devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
        if (response.data) {
            this.makeToast(
                "success",
                "Establecimiento actualizado",
                "El Establecimiento " + this.name +" ha sido actualizado",
                4000);
        }else{
            this.makeToast(
                "warning",
                "Datos incorrectos",
                "La informacion proporcionada es incorrecta.",
                4000);
        }
        });
        this.$router.push({ name: "EnterpriseList" });
        }else if(this.city == ""){
          this.makeToast(
              "warning",
              "Datos incorrectos",
              "Por favor verifique que su direccion este completa y sea valida",
              5000);
        }
        //Si se presiona en la X o en la opcion de no modificar se queda en la pagina actual
        })
    },
    /**
    onCancel(event) {
        event.preventDefault();
        alert(JSON.stringify(this.form));
    },
    uploadFiles(event) {
        this.form.images = event.target.files;
    },

    saveImages(event) {
        event.preventDefault();
        this.images_urls = [];
        this.form.images.forEach((file) => {
        const fileImage = file;
        this.images_urls.push(URL.createObjectURL(fileImage));
        });
    },
    clearImages(event) {
        event.preventDefault();
        this.images_urls = [];
    },
    previewImages(event) {
        event.preventDefault();
        this.show_images = ~this.show_images;
    }, */
},
computed: {
    /**
     * Habilita o inhabilita el botón de crear o actualizar establecimiento
     * dependiendo si los inputs están vacios
     */
    inputsEmpty() {
        if (this.name.trim() === "" || this.location.trim() === "") {
        return true;
        }
        return false;
    },
},
};
</script>
<style scoped>
#thead__H {
    font-weight: normal;
}
#buttonBack {
    margin-left: 10px;
}
.btn-primary {
  background-color: var(--orange);
  color: whitesmoke;
  border: none;
}
.btn-black {
  background-color: var(--dark-x);
  color: whitesmoke;
}
</style>
