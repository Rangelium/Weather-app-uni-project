import axios from "axios";

axios.defaults.baseURL = "http://localhost/test/api";

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

  getNearDatesInfo(date) {
    return new Promise(async (resolve, reject) => {
      let res = await axios({
        method: "GET",
        url: `/weekInfo.php?date=${date}`,
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
