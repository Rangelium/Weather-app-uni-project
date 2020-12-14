import React, { Component } from "react";
import styled from "styled-components";
import api from "../../tools/connect";
import dayjs from "dayjs";
import { GlobalDataContext } from "../../components/GlobalDataProvider";

import DetailedInfoDrawer from "./DetailedInfoDrawer";
import TimeSelect from "./TimeSelect";
import DayInfoFooter from "./DayInfoFooter";

import { Backdrop, CircularProgress } from "@material-ui/core";

export default class DayInfo extends Component {
  static contextType = GlobalDataContext;
  state = {
    dateData: null,
    showInfo: null,
    backgroundURL: null,
    dayMode: null,

    loading: true,
  };

  async componentDidMount() {
    const dateData = await api.getDayInfo("2020-04-05").catch((err) => {
      this.context.error(err.message);
    });
    const showInfo = this.giveNearestToCurrentDateInfo(dateData);

    const backgroundURL = this.giveBackgroundURL(showInfo.timeMeasurement);

    this.setState(
      {
        dateData,
        showInfo,
        backgroundURL,
        dayMode: backgroundURL.search("day") !== -1 ? "day" : "evening",
      },
      () => {
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 400);
      }
    );
  }
  changeShowInfo(showInfo) {
    const backgroundURL = this.giveBackgroundURL(showInfo.timeMeasurement);

    this.setState({
      showInfo,
      backgroundURL,
      dayMode: backgroundURL.search("day") !== -1 ? "day" : "evening",
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
  giveBackgroundURL(time) {
    const numDayImages = 3;
    const numEveningImages = 1;
    let fileName;

    if (parseInt(time.slice(0, 2)) > 16) {
      fileName = `evening_${Math.floor(Math.random() * numEveningImages) + 1}.jpg`;
    } else {
      fileName = `day_${Math.floor(Math.random() * numDayImages) + 1}.jpg`;
    }

    return `./client/assets/${fileName}`;
  }

  render() {
    return (
      <StyledPage>
        {this.state.showInfo ? (
          <TimeSelect
            data={this.state.showInfo}
            fullData={this.state.dateData}
            chageShowInfo={this.changeShowInfo.bind(this)}
          />
        ) : (
          <div className="placeholder"></div>
        )}
        <div className="placeholder"></div>
        <DayInfoFooter data={this.state.showInfo} />
        <DetailedInfoDrawer data={this.state.showInfo} />

        <StyledDayBackground
          className="bg_1fs5x"
          path={this.state.backgroundURL}
          active={this.state.dayMode === "day" ? 1 : 0}
        />
        <StyledEveningBackground
          className="bg_1fs5x"
          path={this.state.backgroundURL}
          active={this.state.dayMode === "evening" ? 1 : 0}
        />

        <Backdrop
          style={{
            zIndex: 1000,
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          }}
          open={this.state.loading}
        >
          <CircularProgress style={{ color: "#fff" }} />
        </Backdrop>
      </StyledPage>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledPage = styled.section`
  width: 100%;
  height: 100%;
  display: grid;

  grid-template-columns: 70% 1fr;
  grid-template-rows: auto 1fr auto;

  .bg_1fs5x {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    transition: 0.3s;

    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: center;
    z-index: -1;

    filter: brightness(70%);
  }
`;
const StyledDayBackground = styled.div`
  background-image: url(${(props) => props.path});
  opacity: ${(props) => props.active};
`;
const StyledEveningBackground = styled.div`
  background-image: url(${(props) => props.path});
  opacity: ${(props) => props.active};
`;
