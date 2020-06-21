import http from "../http-common";

class DataService {
  getAll() {
    return http.get("/lar21css/desafio_frontend.json");
  }
}

export default new DataService();