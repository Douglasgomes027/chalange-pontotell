<template>
  <div>
    <template>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            label="Pesquisar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="events"
          :search="search"
        ></v-data-table>
      </v-card>
    </template>
  </div>
</template>

<script>
import DataService from "../services/DataService";
import moment from "moment";
export default {
  data() {
    return {
      search: "",
      headers: [
        { text: "Dia", value: "day" },
        { text: "Funcionário", value: "employee" },
        { text: "Entrada", value: "entry" },
        { text: "Início da pausa", value: "beginStop" },
        { text: "Retorno da pausa", value: "returnStop" },
        { text: "Saída", value: "exit" },
        { text: "Horas Trabalhadas", value: "workedHours" },
        { text: "Horas de pausa", value: "workedStop" },
      ],
      events: [],
    };
  },
  methods: {
    getDay(day) {
      const week = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo",
      ];
      return `${moment(day).format("DD/MM/YYYY")} - ${
        week[moment(day).weekday()]
      }`;
    },
    getTimeKind(pontos, kind) {
      const result = pontos.filter((ponto) => ponto.kind == kind);
      if (result[0]) {
        return moment(result[0].time)
          .utc()
          .format("HH:mm");
      } else {
        return null;
      }
    },
    getEmployeName(employees, id) {
      const result = employees.filter((employe) => employe.id == id);
      return result[0].name;
    },
    getDiffHours(firstTime, secondTime) {
      return moment
        .utc(moment(secondTime, "HH:mm").diff(moment(firstTime, "HH:mm")))
        .format("HH:mm");
    },
    sumHours(firstTime, secondTime) {
      return moment(firstTime, "HH:mm")
        .add(moment.duration(secondTime))
        .format("HH:mm");
    },
    getWorkedHours(entry, beginStop, returnStop, exit) {
      const firstInterval = this.getDiffHours(entry, beginStop);
      const workedStop = this.getDiffHours(beginStop, returnStop);
      const secondInterval = this.getDiffHours(returnStop, exit);
      const workedHours = this.sumHours(firstInterval, secondInterval);
      return { workedHours, workedStop };
    },
    retrieveemployees() {
      DataService.getAll()
        .then((response) => {
          const { days, employees } = response.data;
          let events = days.map((event) => {
            return {
              day: this.getDay(event.day),
              employee: this.getEmployeName(employees, event.employee),
              entry: this.getTimeKind(event.pontos, "entrada"),
              beginStop: this.getTimeKind(event.pontos, "inicio da pausa"),
              returnStop: this.getTimeKind(event.pontos, "retorno da pausa"),
              exit: this.getTimeKind(event.pontos, "saida"),
            };
          });
          events = events.map((event) => {
            const { entry, beginStop, returnStop, exit } = event;
            const { workedHours, workedStop } = this.getWorkedHours(
              entry,
              beginStop,
              returnStop,
              exit
            );
            return {
              ...event,
              workedHours,
              workedStop,
            };
          });
          this.events = events;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrieveemployees();
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>
