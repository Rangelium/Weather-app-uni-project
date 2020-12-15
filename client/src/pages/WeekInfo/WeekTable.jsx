import React, { Component } from "react";
import styled from "styled-components";
import uuid from "react-uuid";
import dayjs from "dayjs";

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

export default class WeekTable extends Component {
  render() {
    return (
      <StyledContainer>
        <StyledTableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center" title="Temperature">
                  Temperature
                </TableCell>
                <TableCell align="center">Wind speed</TableCell>
                <TableCell align="center">Weather</TableCell>
                <TableCell align="center">Precipitation</TableCell>
                <TableCell align="center">Humidity</TableCell>
                <TableCell align="center">Air pressure</TableCell>
                <TableCell align="center">UVindex</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.tableData.map((el) => (
                <TableRow key={uuid()}>
                  <TableCell align="center">{`${el.dateMeasurement}`}</TableCell>
                  <TableCell align="center">{`${el.timeMeasurement.slice(
                    0,
                    5
                  )}`}</TableCell>
                  <TableCell align="center">{`${el.temperature}°C`}</TableCell>
                  <TableCell align="center">{`${el.windSpeed}km/h`}</TableCell>
                  <TableCell align="center">{`${el.weatherDescription}`}</TableCell>
                  <TableCell align="center">{`${el.precipitation}%`}</TableCell>
                  <TableCell align="center">{`${el.humidity}%`}</TableCell>
                  <TableCell align="center">{`${el.airPressure}mb`}</TableCell>
                  <TableCell align="center">{`${el.UVindex}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledContainer>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledContainer = styled.div`
  overflow: hidden;
  padding-top: 5px;
  padding-bottom: 10px;
  padding: 5px 20px 10px 20px;
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
