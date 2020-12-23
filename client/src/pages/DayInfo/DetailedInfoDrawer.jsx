import React, { Component } from "react";
import styled from "styled-components";
import AnimatedNumber from "animated-number-react";
import dayjs from "dayjs";

import { CustomButton } from "../../components/CustomInputs";
import { Divider } from "@material-ui/core";

export default class DetailedInfoDrawer extends Component {
  render() {
    return (
      <StyledDrawer>
        <h1>
          Weather
          <br />
          details
        </h1>

        <div className="details">
          <Divider />
          {this.props.data && (
            <>
              <div className="details-item date">
                <p>
                  Date:{" "}
                  <span>
                    {dayjs(this.props.data.dateMeasurement).format("MMMM D, YYYY")}
                  </span>
                </p>
              </div>
              <div className="details-item">
                <p>
                  Temperature:
                  <AnimatedNumber
                    value={this.props.data.temperature}
                    formatValue={(value) => value.toFixed(0)}
                  />
                  <span>°C</span>
                </p>
              </div>
              <div className="details-item">
                <p>
                  Feels like:
                  <AnimatedNumber
                    value={this.props.data.tempFeelsLike}
                    formatValue={(value) => value.toFixed(0)}
                  />
                  <span>°C</span>
                </p>
              </div>
              <div className="details-item">
                <p>
                  Wind speed:
                  <AnimatedNumber
                    value={this.props.data.windSpeed}
                    formatValue={(value) => value.toFixed(0)}
                  />
                  <span>m/s</span>
                </p>
              </div>
              <div className="details-item">
                <p>
                  Cloudiness:
                  <AnimatedNumber
                    value={this.props.data.cloudiness}
                    formatValue={(value) => value.toFixed(0)}
                  />
                  <span>%</span>
                </p>
              </div>
              <div className="details-item">
                <p>
                  Humidity:
                  <AnimatedNumber
                    value={this.props.data.humidity}
                    formatValue={(value) => value.toFixed(0)}
                  />
                  <span>%</span>
                </p>
              </div>
              <div className="details-item">
                <p>
                  Air pressure:
                  <AnimatedNumber
                    value={this.props.data.airPressure}
                    formatValue={(value) => value.toFixed(0)}
                  />
                  <span>hPa</span>
                </p>
              </div>
              <div className="details-item">
                <p>
                  Visibility:
                  <AnimatedNumber
                    value={this.props.data.visibility}
                    formatValue={(value) => value.toFixed(0)}
                  />
                  <span>m</span>
                </p>
              </div>
              <div className="details-item">
                <p>
                  Weather:
                  <span>
                    {[...this.props.data.weatherDescription]
                      .map((letter, i) => (i ? letter : letter.toUpperCase()))
                      .join("")}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="footer">
          <Divider />
          <CustomButton
            text_color="rgba(255, 255, 255, 0.5)"
            border_color="rgba(255, 255, 255, 0.3)"
            onClick={this.props.showWeekInfo}
          >
            SHOW WEEK INFO
          </CustomButton>
          <p>
            Created by <a href="https://github.com/Rangelium">Emin Azadov</a>
          </p>
        </div>
      </StyledDrawer>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledDrawer = styled.div`
  grid-area: 1 / 2 / 4 / 3;
  position: relative;
  backdrop-filter: blur(5px);

  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: -1;
  }

  h1 {
    color: white;
    font-size: 3.2rem;
    text-align: center;
  }

  .details {
    overflow-y: auto;
    padding-top: 20px;
    flex-grow: 1;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;

    &::-webkit-scrollbar {
      width: 8px;
      height: 5px;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
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

    hr {
      position: absolute;
      top: 5px;
      left: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.2);
    }

    .details-item {
      p {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.7);

        span {
          margin-left: 5px;
          font-size: 1.4rem;
          color: white;
        }
      }

      .time-time:not(:first-child) {
        margin-left: 0;
      }
      .time-time.colon {
        margin: 0 2px;
      }
    }
    .details-item.date {
      display: none;
    }
  }

  .footer {
    padding-top: 15px;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    hr {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.2);
    }

    p {
      margin: 10px 0 10px 0;
      color: rgba(255, 255, 255, 0.3);

      a {
        color: inherit;
        transition: 0.3s;

        &:hover {
          color: #ffaa00;
        }
      }
    }
  }

  @media only screen and (max-width: 600px) {
    .details {
      .details-item.date {
        display: block;
      }
    }
  }
`;
