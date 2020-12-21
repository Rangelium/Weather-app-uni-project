import React, { Component } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { GlobalDataContext } from "../../../components/GlobalDataProvider";
import api from "../../../tools/connect";

import { PrevDateCard, NextDateCard } from "./Card";
import { CustomButton } from "../../../components/CustomInputs";
import { IconButton } from "@material-ui/core";

// Icons
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

export default class WeekCards extends Component {
  static contextType = GlobalDataContext;
  constructor() {
    super();

    this.state = {
      prevDatesData: [],
      nextDatesData: [],
    };

    this.cardsContainerRef = React.createRef();
  }

  async componentDidMount() {
    const prevDatesData = await api
      .getPrevDatesInfo(this.props.showInfo.dateMeasurement)
      .then((res) => this.prepareData(res))
      .catch((err) => this.context.error(err.message));

    let activeIndex;
    prevDatesData.forEach((dateDataArr, i) => {
      if (!dateDataArr.length) return;
      if (dateDataArr[0].dateMeasurement === this.props.showInfo.dateMeasurement) {
        activeIndex = i;
      }
    });

    const nextDatesData = await api
      .getNextDatesInfo(this.props.showInfo.dateMeasurement)
      .catch((err) => this.context.error(err.message));

    this.setState(
      {
        prevDatesData,
        nextDatesData,
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
    // Calculate unique length
    let uniqueLength = 0;
    let tmp;
    givenData.forEach((el) => {
      if (el.dateMeasurement !== tmp) {
        tmp = el.dateMeasurement;
        uniqueLength++;
      }
    });

    const resArr = [...Array(uniqueLength)].map(() => []);

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
          {this.state.prevDatesData.map((dateDataArr) => {
            const dateDataArrSortedByTimeASC = [...dateDataArr].sort(
              (a, b) =>
                dayjs(`${a.dateMeasurement} ${a.timeMeasurement}`).unix() -
                dayjs(`${b.dateMeasurement} ${b.timeMeasurement}`).unix()
            );

            return (
              <PrevDateCard
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
                  icon: this.props.IconsForWeather[dateDataArr[0].weatherMain],
                  temperature: [
                    dateDataArrSortedByTimeASC[0].temperature,
                    dateDataArrSortedByTimeASC[dateDataArr.length - 1].temperature,
                  ],
                  isActive:
                    dateDataArr[0].dateMeasurement ===
                    this.props.showInfo.dateMeasurement,
                }}
              />
            );
          })}
          {this.state.nextDatesData.map((dateInfo) => (
            <NextDateCard
              key={dateInfo.dateMeasurement}
              dateData={dateInfo}
              icon={this.props.IconsForWeather[dateInfo.weatherDescription]}
            />
          ))}
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
    padding-bottom: 20px;
    /* display: grid;
    grid-template-columns: repeat(6, 1fr); */
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 10px;

    overflow-x: auto;
    overflow-y: hidden;
    justify-items: center;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */

    &::-webkit-scrollbar {
      height: 8px;
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
