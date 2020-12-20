import React, { Component } from "react";
import styled from "styled-components";
import uuid from "react-uuid";

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";

const headCells = [
  { id: "dateMeasurement", label: "Date" },
  { id: "timeMeasurement", label: "Time", noSort: true },
  { id: "temperature", label: "Temperature" },
  { id: "tempFeelsLike", label: "Feels like" },
  { id: "windSpeed", label: "Wind speed" },
  { id: "airPressure", label: "Air pressure" },
  { id: "humidity", label: "Humidity" },
  { id: "visibility", label: "Visibility" },
  { id: "cloudiness", label: "Cloudiness" },
  // { id: "weatherDescription", label: "Weather", noSort: true },
];

export default class WeekTable extends Component {
  state = {
    activeCellId: "timeMeasurement",
    sortDirection: "desc",
  };

  handleSort(cellId, sortDirection) {
    let arrCopy = [...this.props.tableData];
    arrCopy.sort((a, b) => {
      let keyA = parseFloat(a[cellId]);
      let keyB = parseFloat(b[cellId]);

      if (cellId === "dateMeasurement" || cellId === "timeMeasurement") {
        keyA = Date.parse(`${a.dateMeasurement} ${a.timeMeasurement}`);
        keyB = Date.parse(`${b.dateMeasurement} ${b.timeMeasurement}`);
      }

      if (sortDirection === "desc") {
        return keyB - keyA;
      }
      return keyA - keyB;
    });

    return arrCopy;
  }
  handleHeadCellClick(activeCellId) {
    if (activeCellId === this.state.activeCellId) {
      const sortDirection = this.state.sortDirection === "asc" ? "desc" : "asc";
      this.setState({
        sortDirection,
      });
      return;
    }

    this.setState({
      activeCellId,
      sortDirection: "asc",
    });
  }

  render() {
    return (
      <StyledContainer
        cardsContainerHeight={
          this.props.weekCardsRef.current?.cardsContainerRef.current.offsetHeight
        }
        enlargeTable={this.props.enlargeTable}
      >
        <StyledTableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.map(({ id, label, noSort }) =>
                  !noSort ? (
                    <TableCell key={id} align="center">
                      <TableSortLabel
                        active={id === this.state.activeCellId}
                        direction={this.state.sortDirection}
                        onClick={() => this.handleHeadCellClick(id)}
                      >
                        {label}
                      </TableSortLabel>
                    </TableCell>
                  ) : (
                    <TableCell key={id} align="center">
                      {label}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.handleSort(this.state.activeCellId, this.state.sortDirection).map(
                (el) => (
                  <TableRow key={uuid()}>
                    <TableCell
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >{`${el.dateMeasurement}`}</TableCell>
                    <TableCell align="center">
                      {`${el.timeMeasurement.slice(0, 5)}`}
                    </TableCell>
                    <TableCell align="center">{`${el.temperature} °C`}</TableCell>
                    <TableCell align="center">{`${el.tempFeelsLike} °C`}</TableCell>
                    <TableCell align="center">{`${el.windSpeed} m/s`}</TableCell>
                    <TableCell align="center">{`${el.airPressure} hPa`}</TableCell>
                    <TableCell align="center">{`${el.humidity} %`}</TableCell>
                    <TableCell align="center">{`${el.visibility} m`}</TableCell>
                    <TableCell align="center">{`${el.cloudiness} %`}</TableCell>
                    {/* <TableCell align="center">{`${[...el.weatherDescription]
                      .map((l, i) => (i ? l : l.toUpperCase()))
                      .join("")}`}</TableCell> */}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <Backdrop
          style={{
            zIndex: 1000,
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
          open={this.props.tableLoading}
        >
          <CircularProgress style={{ color: "#fff" }} />
        </Backdrop>
      </StyledContainer>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 5px;
  padding-bottom: 10px;
  padding: 5px 20px 10px 20px;

  transition: 0.4s margin-top;
  z-index: 10;
  margin-top: ${(props) =>
    props.enlargeTable ? `-${props.cardsContainerHeight}px` : "0"};
`;

const StyledTableContainer = styled(TableContainer)`
  overflow-y: auto;
  height: 100%;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    border-radius: 10px;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border-radius: 10px;
    background: #d7d8d6;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  .MuiTableCell-head {
    font-family: "Montserrat", sans-serif;
    font-size: 1rem;
    font-weight: 600;
  }
`;
