import React, { Component } from "react";
import styled from "styled-components";

import DetailedInfoDrawer from "./DetailedInfoDrawer";
import TimeSelect from "./TimeSelect";
import DayInfoFooter from "./DayInfoFooter";

export default class DayInfo extends Component {
  constructor() {
    super();

    this.state = {
      backgroundDayURL: null,
      backgroundEveningURL: null,
      dayMode: null,
    };

    this.timeSelectRef = React.createRef();
  }

  componentDidMount() {
    this.setBackground(this.props.showInfo.timeMeasurement);
  }

  setBackground(time) {
    const dayMode = parseInt(time.slice(0, 2)) >= 16 ? "evening" : "day";
    const { day, evening } = this.giveBackgroundURL(dayMode);

    this.setState({
      dayMode,
      backgroundDayURL: day,
      backgroundEveningURL: evening,
    });
  }
  giveBackgroundURL(time) {
    const numDayImages = 4;
    const numEveningImages = 4;

    const eveningFileName = `evening_${
      Math.floor(Math.random() * numEveningImages) + 1
    }.jpg`;
    const dayFileName = `day_${Math.floor(Math.random() * numDayImages) + 1}.jpg`;

    return {
      day: `./client/assets/${dayFileName}`,
      evening: `./client/assets/${eveningFileName}`,
    };
  }

  render() {
    return (
      <StyledPage>
        <TimeSelect
          ref={this.timeSelectRef}
          data={this.props.showInfo}
          fullData={this.props.dateData}
          chageShowInfo={this.props.changeShowInfo}
        />
        <div className="placeholder"></div>
        <DayInfoFooter
          IconsForWeather={this.props.IconsForWeather}
          data={this.props.showInfo}
        />
        <DetailedInfoDrawer
          showWeekInfo={this.props.showWeekInfo}
          data={this.props.showInfo}
        />

        <StyledDayBackground
          className="bg_1fs5x"
          path={this.state.backgroundDayURL}
          active={this.state.dayMode === "day" ? 1 : 0}
        />
        <StyledEveningBackground
          className="bg_1fs5x"
          path={this.state.backgroundEveningURL}
          active={this.state.dayMode === "evening" ? 1 : 0}
        />
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

  > * {
    z-index: 1;
  }

  .bg_1fs5x {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    transition: 0.3s;

    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: center;
    z-index: 0;

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
