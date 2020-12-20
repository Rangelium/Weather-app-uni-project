import axios from "axios";

axios.defaults.baseURL = "http://localhost/backendProject/api";

const timeoutDelay = 30000;
class API {
  getDayInfo(date) {
    return new Promise(async (resolve, reject) => {
      let res = await axios({
        method: "GET",
        url: `/dayInfo.php?date=${date}`,
        timeout: timeoutDelay,
      }).catch((err) => {
        console.log(err);
        return { error: err };
      });

      if (res) {
        if (res.error) {
          reject(res);
        } else {
          resolve(res.data);
        }
        return;
      }
    });
  }

  getPrevDatesInfo() {
    return new Promise(async (resolve, reject) => {
      let res = await axios({
        method: "GET",
        url: `/prevDatesInfo.php`,
        timeout: timeoutDelay,
      }).catch((err) => {
        console.log(err);
        return { error: err };
      });

      if (res) {
        if (res.error) {
          reject(res);
        } else {
          resolve(res.data);
        }
        return;
      }
    });
  }

  getNextDatesInfo() {
    return new Promise(async (resolve, reject) => {
      let res = await axios({
        method: "GET",
        url: `/nextDatesInfo.php`,
        timeout: timeoutDelay,
      }).catch((err) => {
        console.log(err);
        return { error: err };
      });

      if (res) {
        if (res.error) {
          reject(res);
        } else {
          resolve(res.data);
        }
        return;
      }
    });
  }
}

export default new API();
