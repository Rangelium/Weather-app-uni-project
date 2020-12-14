import React, { Component } from "react";
import dayjs from "dayjs";
import { GlobalDataContext } from "./components/GlobalDataProvider";
import api from "./tools/connect";

import DayInfo from "./pages/DayInfo/DayInfo";
import WeekInfo from "./pages/WeekInfo/WeekInfo";
import { Backdrop, CircularProgress } from "@material-ui/core";

// Icons
import {
  WiCloudy,
  WiDaySunny,
  WiSnow,
  WiRain,
  WiNightFog,
  WiCloudyWindy,
} from "react-icons/wi";

const IconsForWeather = {
  Sunny: <WiDaySunny />,
  Cloudly: <WiCloudy />,
  Windy: <WiCloudyWindy />,
  Snowy: <WiSnow />,
  Rainy: <WiRain />,
  Foggy: <WiNightFog />,
};

export default class App extends Component {
  static contextType = GlobalDataContext;
  constructor() {
    super();
    this.state = {
      dateData: null,
      showInfo: null,
      backgroundURL: null,
      dayMode: null,

      loading: true,

      isWeekInfoActive: false,
    };

    this.DayInfoRef = React.createRef();
  }

  async componentDidMount() {
    const dateData = await api.getDayInfo(dayjs().format("YYYY-MM-DD")).catch((err) => {
      this.context.error(err.message);
    });
    const showInfo = this.giveNearestToCurrentDateInfo(dateData);

    this.setState({
      dateData,
      showInfo,
    });
  }
  changeShowInfo(showInfo) {
    this.DayInfoRef.current.setBackground(showInfo.timeMeasurement);

    this.setState({
      showInfo,
    });
  }
  giveNearestToCurrentDateInfo(dateData) {
    const timestamp = dayjs().unix();

    let closestIndex;
    let lowestDiffence = Infinity;
    dateData.forEach((data, i) => {
      let dataTimestamp = dayjs(
        `${data.dateMeasurement} H${data.timeMeasurement}`
      ).unix();
      let tmpDiffence = Math.abs(timestamp - dataTimestamp);

      if (tmpDiffence < lowestDiffence) {
        lowestDiffence = tmpDiffence;
        closestIndex = i;
      }
    });

    return dateData[closestIndex];
  }
  showWeekInfo() {
    this.setState({
      isWeekInfoActive: true,
    });
  }
  closeWeekInfo() {
    this.setState({
      isWeekInfoActive: false,
    });
  }

  render() {
    return (
      <>
        {this.state.showInfo && (
          <>
            <DayInfo
              ref={this.DayInfoRef}
              showInfo={this.state.showInfo}
              dateData={this.state.dateData}
              IconsForWeather={IconsForWeather}
              showWeekInfo={this.showWeekInfo.bind(this)}
              changeShowInfo={this.changeShowInfo.bind(this)}
              loaded={() => this.setState({ loading: true })}
            />
            <WeekInfo
              showInfo={this.state.showInfo}
              IconsForWeather={IconsForWeather}
              isActive={this.state.isWeekInfoActive}
              closeWeekInfo={this.closeWeekInfo.bind(this)}
            />
          </>
        )}

        <Backdrop
          style={{
            zIndex: 1000,
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          }}
          open={this.state.loading && !Boolean(this.state.showInfo)}
        >
          <CircularProgress style={{ color: "#fff" }} />
        </Backdrop>
      </>
    );
  }
}
