import axios from "axios";

export default axios.create({
  baseURL: "https://s3-sa-east-1.amazonaws.com",
  headers: {
    "Content-type": "application/json"
  }
});