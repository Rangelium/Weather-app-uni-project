import React, { Component } from "react";
import styled from "styled-components";
import api from "../../tools/connect";
import dayjs from "dayjs";
import { GlobalDataContext } from "../../components/GlobalDataProvider";

import DetailedInfoDrawer from "./DetailedInfo/DetailedInfoDrawer";
import TimeSelect from "./TimeSelect/TimeSelect";

import { Backdrop, CircularProgress } from "@material-ui/core";

export default class DayInfo extends Component {
  static contextType = GlobalDataContext;
  state = {
    dateData: null,
    showInfo: null,
  };

  componentDidMount() {
    api
      .getDayInfo("2020-04-05")
      .then((dateData) => {
        this.setState({
          dateData,
          showInfo: this.giveNearestToCurrentDateInfo(dateData),
        });
      })
      .catch((err) => {
        this.context.error(err.message);
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

  render() {
    return (
      <StyledPage>
        {this.state.showInfo && (
          <TimeSelect
            data={this.state.showInfo}
            fullData={this.state.dateData}
            chageShowInfo={(showInfo) => {
              this.setState({
                showInfo,
              });
            }}
          />
        )}
        <DetailedInfoDrawer data={this.state.showInfo} />

        <Backdrop
          style={{
            zIndex: 1000,
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
          open={!Boolean(this.state.showInfo)}
        >
          <CircularProgress style={{ color: "#fff" }} />
        </Backdrop>

        <StyledBackground path="./client/assets/baku_evening_2.jpg" />
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
  grid-template-rows: auto 1fr 20%;
`;
const StyledBackground = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;

  background-image: url(${(props) => props.path});
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: center;
  z-index: -1;

  filter: brightness(70%);
`;
