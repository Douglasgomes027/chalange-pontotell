<template>
  <v-card>
    <v-card-title>
      Eventos de Pontos
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        v-model="search"
        label="Pesquisar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="events" :search="search">
      <template v-slot:item.entry="{ item }">
        <v-chip v-show="item.entry != null" dark>{{ item.entry }}</v-chip>
      </template>
      <template v-slot:item.beginStop="{ item }">
        <v-chip v-show="item.beginStop != null" dark>{{
          item.beginStop
        }}</v-chip>
      </template>
      <template v-slot:item.returnStop="{ item }">
        <v-chip v-show="item.returnStop != null" dark>{{
          item.returnStop
        }}</v-chip>
      </template>
      <template v-slot:item.exit="{ item }">
        <v-chip v-show="item.exit != null" dark>{{ item.exit }}</v-chip>
      </template>
      <template v-slot:item.workedHours="{ item }">
        <v-chip color="#6e7b8b" v-show="item.workedHours != null">{{
          item.workedHours
        }}</v-chip>
      </template>
      <template v-slot:item.workedStop="{ item }">
        <v-chip color="#cd8162" v-show="item.workedStop != null">{{
          item.workedStop
        }}</v-chip>
      </template>
    </v-data-table>
  </v-card>
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
        { text: "Funcionário", value: "employe" },
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
    getTimeKind(points, kind) {
      const result = points.filter((ponto) => ponto.kind == kind);
      if (result[0]) {
        return moment(result[0].time)
          .utc()
          .format("HH:mm");
      } else {
        return null;
      }
    },
    getEmployeName(employes, id) {
      const result = employes.filter((employe) => employe.id == id);
      return result[0].name;
    },
    checkValidTime(time) {
      if (time.isValid()) {
        return time.format("HH:mm");
      } else {
        return null;
      }
    },
    getDiffHours(firstTime, secondTime) {
      const time = moment.utc(
        moment(secondTime, "HH:mm").diff(moment(firstTime, "HH:mm"))
      );
      return this.checkValidTime(time);
    },
    sumHours(firstTime, secondTime) {
      const time = moment(firstTime, "HH:mm").add(moment.duration(secondTime));
      return this.checkValidTime(time);
    },
    getWorkedHours(entry, beginStop, returnStop, exit) {
      const firstInterval = this.getDiffHours(entry, beginStop);
      const workedStop = this.getDiffHours(beginStop, returnStop);
      const secondInterval = this.getDiffHours(returnStop, exit);
      const workedHours = this.sumHours(firstInterval, secondInterval);
      return { workedHours, workedStop };
    },
    retrieveEmployes() {
      DataService.getAll()
        .then((response) => {
          const { days, employees } = response.data;
          let events = days.map((event) => {
            return {
              day: this.getDay(event.day),
              employe: this.getEmployeName(employees, event.employee),
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
    this.retrieveEmployes();
  },
};
</script>