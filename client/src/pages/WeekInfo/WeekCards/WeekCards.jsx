import React, { Component } from "react";
import styled from "styled-components";
// import dayjs from "dayjs";
import { GlobalDataContext } from "../../../components/GlobalDataProvider";
import api from "../../../tools/connect";

import Card from "./Card";
import { CustomButton } from "../../../components/CustomInputs";
import { IconButton } from "@material-ui/core";

// Icons
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

export default class WeekCards extends Component {
  static contextType = GlobalDataContext;
  constructor() {
    super();

    this.state = {
      data: [],
    };

    this.cardsContainerRef = React.createRef();
  }

  async componentDidMount() {
    const data = await api
      .getNearDatesInfo(this.props.showInfo.dateMeasurement)
      .then((res) => this.prepareData(res))
      .catch((err) => this.context.error(err.message));

    let activeIndex;
    data.forEach((dateDataArr, i) => {
      if (dateDataArr[0].dateMeasurement === this.props.showInfo.dateMeasurement) {
        activeIndex = i;
      }
    });

    this.setState(
      {
        data,
      },
      () => {
        this.cardsContainerRef.current.childNodes[activeIndex].scrollIntoView({
          block: "center",
          inline: "center",
        });
      }
    );
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
          <CustomButton onClick={this.props.handleEnlargeTable}>
            {this.props.enlargeTable ? "Reduce table" : "Enlarge table"}
          </CustomButton>
        </div>

        <div className="cards" ref={this.cardsContainerRef}>
          {this.state.data.map((dateDataArr) => {
            const dateDataArrSortedByTempASC = [...dateDataArr].sort(
              (a, b) => a.temperature - b.temperature
            );

            return (
              <Card
                key={dateDataArr[0].dateMeasurement}
                tableLoading={this.props.tableLoading}
                tableInfoAdded={this.props.addedDates.includes(
                  dateDataArr[0].dateMeasurement
                )}
                addTableData={() =>
                  this.props.addTableData(dateDataArr[0].dateMeasurement)
                }
                removeTableData={() =>
                  this.props.removeTableData(dateDataArr[0].dateMeasurement)
                }
                handleClick={() =>
                  this.props.changeDay(
                    dateDataArr[parseInt(dateDataArr.length / 2)].dateMeasurement
                  )
                }
                cardsDate={dateDataArr[0].dateMeasurement}
                dayData={dateDataArr[0]}
                cardData={{
                  icon: this.props.IconsForWeather[dateDataArr[0].weatherDescription],
                  temperature: [
                    dateDataArrSortedByTempASC[0].temperature,
                    dateDataArrSortedByTempASC[dateDataArr.length - 1].temperature,
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
  width: 100%;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: 20px 1fr 20px;
  grid-template-rows: auto auto;

  > * {
    grid-column: 2 / -2;
  }

  .header {
    display: flex;
    align-items: center;
    padding-top: 6px;

    .MuiIconButton-root {
      padding: 6px;

      &:hover {
        .MuiSvgIcon-root {
          color: #000;
        }
      }

      .MuiSvgIcon-root {
        transform: scale(2);
        font-size: 1.8rem;
        position: relative;
        right: 1px;
        transition: 0.3s;
      }
    }

    h1 {
      flex-grow: 1;
      font-size: 1.6rem;
    }
  }

  .cards {
    width: 100%;
    padding: 7px 5px;
    padding-bottom: 15px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    overflow-x: auto;
    overflow-y: hidden;
    grid-gap: 10px;
    justify-items: center;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */

    &::-webkit-scrollbar {
      height: 5px;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
      border-radius: 15px;
      border-radius: 15px;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      border-radius: 10px;
      background: #d7d8d6;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }
  }
`;
