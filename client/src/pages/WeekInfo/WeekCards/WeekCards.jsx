import React, { Component } from "react";
import styled from "styled-components";
import uuid from "react-uuid";
import dayjs from "dayjs";
import { GlobalDataContext } from "../../../components/GlobalDataProvider";
import api from "../../../tools/connect";

import Card from "./Card";
import { CustomButton } from "../../../components/CustomInputs";
import { IconButton } from "@material-ui/core";

// Icons
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

export default class WeekCards extends Component {
  static contextType = GlobalDataContext;
  state = {
    data: [],
  };

  componentDidMount() {
    api
      .getNearDatesInfo(this.props.showInfo.dateMeasurement)
      .then((res) => this.setState({ data: this.prepareData(res) }))
      .catch((err) => this.context.error(err.message));
  }
  prepareData(givenData) {
    const resArr = [...Array(6)].map(() => []);

    let index = 0;
    let curDate = givenData[0].dateMeasurement;
    givenData.forEach((date) => {
      if (date.dateMeasurement === curDate) {
        resArr[index].push(date);
      } else {
        resArr[++index].push(date);
        curDate = date.dateMeasurement;
      }
    });

    return resArr;
  }

  render() {
    return (
      <StyledContainer>
        <div className="header">
          <IconButton title="Go back" onClick={this.props.closeWeekInfo}>
            <ChevronLeftIcon />
          </IconButton>
          <h1>Days of week:</h1>
          <CustomButton onClick={() => alert("SOON")}>Enlarge table</CustomButton>
        </div>

        <div className="cards">
          {this.state.data.map((dateDataArr) => {
            return (
              <Card
                key={uuid()}
                cardData={{
                  nameBig: dayjs(dateDataArr[0].dateMeasurement).format("dddd"),
                  nameSmall: dayjs(dateDataArr[0].dateMeasurement).format("MMMM DD"),
                  icon: this.props.IconsForWeather[dateDataArr[0].weatherDescription],
                  temperature: [
                    dateDataArr[0].temperature,
                    dateDataArr[dateDataArr.length - 1].temperature,
                  ],
                  isActive:
                    dateDataArr[0].dateMeasurement ===
                    this.props.showInfo.dateMeasurement,
                }}
              />
            );
          })}
        </div>
      </StyledContainer>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledContainer = styled.div`
  .header {
    padding: 5px 20px 5px 10px;
    display: flex;
    align-items: center;

    .MuiIconButton-root {
      &:hover {
        .MuiSvgIcon-root {
          color: #000;
        }
      }

      .MuiSvgIcon-root {
        transform: scale(2);
        font-size: 2rem;
        position: relative;
        right: 1px;
        transition: 0.3s;
      }
    }

    h1 {
      flex-grow: 1;
    }
  }

  .cards {
    padding: 0 20px 20px 20px;
    display: flex;
    gap: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`;
