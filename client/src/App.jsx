import React, { Component } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { GlobalDataContext } from "./components/GlobalDataProvider";
import api from "./tools/connect";

import DayInfo from "./pages/DayInfo/DayInfo";
import WeekInfo from "./pages/WeekInfo/WeekInfo";

// Icons
import { FaCloud } from "react-icons/fa";
import {
  WiCloudy,
  WiDaySunny,
  WiSnow,
  WiRain,
  WiNightFog,
  WiThunderstorm,
  WiShowers,
  WiDayHaze,
  WiStrongWind,
} from "react-icons/wi";

const IconsForWeather = {
  Thunderstorm: <WiThunderstorm />,
  Drizzle: <WiShowers />,
  Rain: <WiRain />,
  Snow: <WiSnow />,
  Clouds: <WiCloudy />,
  Clear: <WiDaySunny />,
  Fog: <WiNightFog />,
  Haze: <WiDayHaze />,
  Squall: <WiStrongWind />,
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

      loading: false,

      isWeekInfoActive: false,
    };

    this.DayInfoRef = React.createRef();
    this.WeekInfoRef = React.createRef();
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
    const date = new Date();
    const timestamp = dayjs(
      `${dateData[0].dateMeasurement} H${date.getHours()}:${date.getMinutes()}:00`
    ).unix();

    let closestIndex;
    let lowestDiffence = Infinity;
    dateData.forEach((data, i) => {
      let dataTimestamp = dayjs(
        `${data.dateMeasurement} H${data.timeMeasurement}`
      ).unix();
      let tmpDifference = Math.abs(timestamp - dataTimestamp);

      if (tmpDifference < lowestDiffence) {
        lowestDiffence = tmpDifference;
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
  async getDayData(date) {
    if (date === this.state.showInfo.dateMeasurement) {
      this.context.error("Already selected");
      return;
    }
    this.setState({
      loading: true,
    });

    const dateData = await api.getDayInfo(date).catch((err) => {
      this.context.error(err.message);
    });
    const showInfo = this.giveNearestToCurrentDateInfo(dateData);

    this.WeekInfoRef.current.prepareTableData(dateData);

    this.setState(
      {
        dateData,
        showInfo,
      },
      () => {
        this.DayInfoRef.current.timeSelectRef.current.prepareSliderData();
        this.setState({
          loading: false,
        });
      }
    );
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
              ref={this.WeekInfoRef}
              showInfo={this.state.showInfo}
              dateData={this.state.dateData}
              IconsForWeather={IconsForWeather}
              isActive={this.state.isWeekInfoActive}
              closeWeekInfo={this.closeWeekInfo.bind(this)}
              changeDay={this.getDayData.bind(this)}
            />
          </>
        )}

        <StyledBackdrop open={!Boolean(this.state.showInfo) || this.state.loading}>
          <FaCloud id="cloudsSVG" />
          <WiDaySunny id="sunSVG" />
          <div className="rain">
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>

            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
          </div>
          <p>LOOKING OUTSIDE FOR YOU...</p>
        </StyledBackdrop>
      </>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledBackdrop = styled.div`
  --bg: rgb(239, 239, 239);
  /* --bg: rgba */
  --stroke: #797b7c;

  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${(props) => (props.open ? "all" : "none")};
  opacity: ${(props) => (props.open ? "1" : "0")};
  z-index: 10000000;
  transition-duration: 0.6s;
  background-color: rgb(239, 239, 239, 0.8);

  svg {
    position: absolute;
    /* left: 50%;
    right: 50%; */
  }

  #sunSVG {
    left: calc(50% + 50px);
    top: calc(50% - 95px);
    transform: scale(8);
    z-index: 0;
    fill: var(--stroke);
    /* stroke: var(--stroke); */

    /* animation-name: ${(props) => (props.open ? "rotate" : "unset")}; */
    animation-name: "rotate";
    animation-duration: 10000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @keyframes rotate {
      0% {
        transform: scale(8) rotateZ(0deg);
      }

      100% {
        transform: scale(8) rotateZ(360deg);
      }
    }
  }

  #cloudsSVG {
    top: calc(50% - 70px);
    left: 50%;

    transform: scale(10);
    stroke: var(--stroke);
    stroke-width: 16;
    fill: var(--bg);
    z-index: 1;
  }

  .rain {
    width: 100px;
    height: 70px;
    position: absolute;
    top: calc(50% - 5px);
    left: 50%;
    transform: translateX(-50%);

    .drop {
      opacity: 1;
      background: var(--stroke);
      display: block;
      float: left;
      width: 3px;
      height: 10px;
      margin-left: 4px;
      border-radius: 0px 0px 6px 6px;

      animation-name: "drop";
      animation-duration: 450ms;
      animation-iteration-count: infinite;
      &:nth-child(1) {
        animation-delay: -130ms;
      }
      &:nth-child(2) {
        animation-delay: -240ms;
      }
      &:nth-child(3) {
        animation-delay: -390ms;
      }
      &:nth-child(4) {
        animation-delay: -525ms;
      }
      &:nth-child(5) {
        animation-delay: -640ms;
      }
      &:nth-child(6) {
        animation-delay: -790ms;
      }
      &:nth-child(7) {
        animation-delay: -900ms;
      }
      &:nth-child(8) {
        animation-delay: -1050ms;
      }
      &:nth-child(9) {
        animation-delay: -1130ms;
      }
      &:nth-child(10) {
        animation-delay: -1300ms;
      }
      &:nth-child(11) {
        animation-delay: -1400ms;
      }
      &:nth-child(12) {
        animation-delay: -1500ms;
      }
      &:nth-child(13) {
        animation-delay: -1600ms;
      }
      &:nth-child(14) {
        animation-delay: -1700ms;
      }
      &:nth-child(15) {
        animation-delay: -1800ms;
      }

      @keyframes drop {
        50% {
          height: 45px;
          opacity: 0;
        }

        51% {
          opacity: 0;
        }

        100% {
          height: 1px;
          opacity: 0;
        }
      }
    }
  }

  p {
    position: absolute;
    top: 65%;
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
  }
`;
