import React, { Component } from "react";
import styled, { css } from "styled-components";
import dayjs from "dayjs";

// Icons
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

export class PrevDateCard extends Component {
  render() {
    const data = this.props.cardData;
    const dayData = this.props.dayData;

    if (this.props.noInfo) {
      return (
        <StyledCard empty>
          <h1>No info</h1>
          <p>
            No info about
            <br />
            this day in database
          </p>
        </StyledCard>
      );
    }

    return (
      <StyledCard
        isActive={data.isActive ? 1 : 0}
        tableLoading={this.props.tableLoading}
        isToday={dayData.dateMeasurement === dayjs().format("YYYY-MM-DD")}
      >
        <span title="Add this days data to table" className="addToTable">
          {this.props.tableInfoAdded ? (
            <RemoveIcon onClick={this.props.removeTableData} />
          ) : (
            <AddIcon onClick={this.props.addTableData} />
          )}
        </span>
        <div
          title="Click to change date"
          className="wrapper"
          onClick={this.props.handleClick}
        >
          <div className="title">
            <h1>{dayjs(dayData.dateMeasurement).format("dddd")}</h1>
            <p>{dayjs(dayData.dateMeasurement).format("MMMM DD")}</p>
          </div>
          {data.icon}
          <p>{`${data.temperature[0]}° | ${data.temperature[1]}°`}</p>
        </div>
      </StyledCard>
    );
  }
}

export class NextDateCard extends Component {
  render() {
    const data = this.props.dateData;

    return (
      <StyledCard isActive={0} nextDate>
        <div title="Click to change date" className="wrapper">
          <div className="title">
            <h1>{dayjs(data.dateMeasurement).format("dddd")}</h1>
            <p>{dayjs(data.dateMeasurement).format("MMMM DD")}</p>
          </div>
          {this.props.icon}
          <p>{`${data.tempMin}° | ${data.tempMax}°`}</p>
        </div>
      </StyledCard>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledCard = styled.div`
  width: 100%;
  min-width: 185px;
  max-width: 200px;
  height: 200px;
  border-radius: 15px;
  background-color: ${(props) =>
    props.isActive ? "#ffaa00" : props.isToday ? "#2F80ED" : "#fff"};
  color: ${(props) => (props.isActive || props.isToday ? "#fff" : "#000")};
  transition: 0.4s;
  cursor: pointer;
  position: relative;
  /* 
  > * {
    transition: 0.4s;
  } */

  &:hover {
    transform: scale(1.05);
  }

  .addToTable {
    z-index: 1;
    position: absolute;
    color: inherit;
    bottom: 5px;
    right: 8px;

    svg {
      pointer-events: ${(props) => (props.tableLoading ? "none" : "all")};
      border-radius: 20%;
      font-size: 2rem;
      transition: 0.3s;

      &:hover {
        background-color: ${(props) =>
          props.isActive ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"};
        color: ${(props) => (props.isActive ? "#000" : "#fff")};
      }
    }
  }

  .wrapper {
    z-index: 0;
    padding: 15px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .title {
      display: inherit;
      flex-direction: column;
      align-items: center;

      h1 {
        color: inherit;
        font-size: 1.6rem;
      }

      p {
      }
    }

    > p {
      color: inherit;
      font-size: 1.4rem;
    }

    svg {
      color: inherit;
      font-size: 5rem;
    }
  }

  ${(props) =>
    props.nextDate
      ? css`
          cursor: default;
          opacity: 0.7;

          &:hover {
            transform: unset;
          }
        `
      : null}

  ${(props) =>
    props.empty
      ? css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          opacity: 0.6;
          cursor: default;

          &:hover {
            transform: unset;
          }

          h1 {
          }
        `
      : null}
`;
