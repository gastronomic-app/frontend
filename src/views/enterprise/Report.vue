<template>
  <div>
    <br />
    <br />
    <h1>Informe de pedidos</h1>
    <b-form-group>
      <b-form-radio
        name="some-radios"
        data-toggle="modal"
        data-target="#intervalModal"
        v-on:change="isHidden = true"
        >Filtrar por fecha</b-form-radio
      >
      <b-form-radio
        name="some-radios"
        data-toggle="modal"
        data-target="#periodModal"
        v-on:change="isHidden = true"
        >Filtrar por periodo de tiempo</b-form-radio
      >
    </b-form-group>
    <div>
      <!-- Modal -->
      <div
        class="modal fade"
        id="intervalModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Filtrar por fecha
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <b-form-select
                v-model="selectedInterval"
                :options="options"
              ></b-form-select>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                :disabled="isDisabledInterval()"
                data-dismiss="modal"
                @click="intervalReport()"
              >
                Generar informe
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="periodModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Filtrar por fecha
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>De</p>
              <date-picker
                v-model="date1"
                :default-value="new Date()"
                :disabled-date="disabledAfterToday"
                type="date"
                placeholder="Seleccione un rango"
              ></date-picker>

              <p>Hasta</p>
              <date-picker
                v-model="date2"
                :default-value="new Date()"
                :disabled-date="disabledAfterToday"
                type="date"
                placeholder="Seleccione un rango"
              ></date-picker>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                :disabled="isDisabledPeriod()"
                data-dismiss="modal"
                @click="periodReport()"
              >
                Generar informe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isHidden" id="report-view">
      <div class="overflow-auto">
        <h5>Costo total de los pedidos: ${{ this.total }}</h5>
        <b-table
          id="my-table"
          :items="this.oderList"
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
          small
        ></b-table>

        <b-pagination
          id="tablePagination"
          v-model="currentPage"
          :total-rows="rows()"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </div>
      <div>
        <button id="btnPdf" class="btn btn-primary" @click="generatePDF()">
          Generar PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  name: "Report",
  components: { DatePicker },

  data() {
    return {
      fields: [
        { key: "reportDate", label: "Fecha del pedido" },
        { key: "paymentValue", label: "Costo del pedido" },
      ],
      doc: new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      }),
      oderList: [],
      total: "",
      perPage: 5,
      currentPage: 1,
      window: false,
      isHidden: true,
      selectedInterval: 0,
      reportEnterprise: "",
      date1: null,
      date2: null,
      options: [
        { value: 1, text: "Hoy" },
        { value: 2, text: "Ultimo dia" },
        { value: 3, text: "Ultima Semana" },
        { value: 4, text: "Ultimo mes" },
      ],
    };
  },
  props: {
    /**
     * Objeto establecimiento enviado
     * como prop desde una vista
     */
    //enterprise: Object,
  },
  methods: {
    generatePDF() {
      var description = this.reportEnterprise.enterprise;
      description =
        "Informe para el establecimineto: " +
        description +
        "\nEntre las fechas: " +
        this.reportEnterprise.startDate +
        " - " +
        this.reportEnterprise.finalDate +
        "\nRecaudo total: " +
        this.total;
      this.doc.setFontSize(15).text(description, 0.5, 1.0);
      this.doc.setLineWidth(0.01).line(0.5, 1.6, 8.0, 1.6);
      var dataTable = [];
      this.reportEnterprise.reportList.forEach((element) => {
        dataTable.push([element.reportDate, element.paymentValue]);
      });

      this.doc.autoTable({
        head: [["Fecha del pedido", "Costo del pedido"]],
        body: dataTable,
        margin: { left: 0.5, top: 2 },
      });
      this.doc.save("a4.pdf");
    },
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
    rows() {
      console.log(this.oderList.length);
      return this.oderList.length;
    },
    isDisabledInterval() {
      //activar el boton de generar informe solo si ha seleccionado un intervalo
      if (this.selectedInterval != 0) {
        return false;
      } else {
        return true;
      }
    },
    isDisabledPeriod() {
      //activar el boton de generar informe si ha seleccionado dos fechas
      if (this.date1 != null && this.date2 != null) {
        return false;
      }
      return true;
    },
    disabledAfterToday(date) {
      return date > new Date();
    },
    intervalReport() {
      var op = this.selectedInterval;
      const current = new Date();
      var past = new Date(current);
      var yesterday = new Date();
      yesterday.setDate(current.getDate() - 1);
      var monthLastDay;
      var monthFirstDay;
      if (op == 1) {
        var today = new Date();
        today.setUTCHours(0); //primera hora de hoy
        today.setUTCMinutes(0);
        this.consult(today.toISOString(), current.toISOString());
      } else if (op == 2) {
        var tmp1 = new Date(yesterday);
        tmp1.setUTCHours(0); //primera hora de ayer 00:00
        tmp1.setUTCMinutes(0);
        var tmp2 = new Date(yesterday);
        tmp2.setUTCHours(23); //Ultima hora de ayer 23:59
        tmp2.setUTCMinutes(59);
        this.consult(tmp1, tmp2);
      } else if (op == 3) {
        past.setDate(past.getDate() - 8);
        this.consult(past.toISOString(), current);
      } else if (op == 4) {
        monthFirstDay = new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1
        );
        monthLastDay = new Date(current.getFullYear(), current.getMonth(), 0);
        this.consult(monthFirstDay.toISOString(), monthLastDay.toISOString());
      }
    },
    periodReport() {
      this.consult(this.date1, this.date2);
      this.isHidden = false;
    },
    consult(startDate, finalDate) {
      var auxid = atob(this.idEnterprise);
      var aux = auxid.split("EnterpriseNode:")[1]
      this.$apollo
        .query({
          query: require("@/graphql/enterprise/enterpriseReport.gql"),
          variables: {
            id: aux,
            sDate: startDate,
            fDate: finalDate,
          },
        })
        .then((response) => {
          if(response.data.reports == null){
            this.makeToast(
                  //"success",
                  "primary",
                  "Resultado",
                  "La consulta no arrojo resultados",
                  5000
                );
            this.isHidden = true;
          }else{
            this.reportEnterprise = response.data.reports;
            this.oderList = this.reportEnterprise.reportList;
            this.total = this.reportEnterprise.totalValue;
            this.isHidden = false;
          }
          //this.pages = response.data.allEnterprises.edges.length;
        });
    },
  },
};
</script>

<style scoped>
#tablePagination {
  margin-left: 40%;
}
#btnPdf {
  float: right;
}
#range {
  width: 100%;
  height: 80%;
}
.btn-info {
  margin: 1%;
}
p {
  margin: 1%;
}
.form-select {
  width: 150px;
}
h5 {
  font-weight: bold;
}
</style>
