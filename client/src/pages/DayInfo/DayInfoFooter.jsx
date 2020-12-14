import React, { Component } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import AnimatedNumber from "animated-number-react";

// Icons
import {
  WiCloudy,
  WiDaySunny,
  WiSnow,
  WiRain,
  WiNightFog,
  WiCloudyWindy,
} from "react-icons/wi";

const IconsForWeatherArr = {
  Sunny: <WiDaySunny />,
  Cloudly: <WiCloudy />,
  Windy: <WiCloudyWindy />,
  Snowy: <WiSnow />,
  Rainy: <WiRain />,
  Foggy: <WiNightFog />,
};

export default class DayInfoFooter extends Component {
  render() {
    return (
      <StyledContainer>
        <StyledWidget>
          <AnimatedNumber
            className="temp"
            value={this.props.data?.temperature}
            formatValue={(value) => `${value.toFixed(0)}°`}
          />
          <div className="info">
            <p>Azerbaijan, Baku</p>
            <div className="small-info">
              <div className="box">
                <p>{dayjs(this.props.data?.dateMeasurement).format("MMMM D, YYYY")}</p>
                <p>
                  {this.props.data
                    ? `${this.props.data.weatherDescription}`
                    : "Loading..."}
                </p>
              </div>
              {IconsForWeatherArr[this.props.data?.weatherDescription]}
            </div>
          </div>
        </StyledWidget>
      </StyledContainer>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledContainer = styled.div`
  /* display: flex;
  align-items: center; */
`;
const StyledWidget = styled.div`
  display: flex;
  padding: 5px 20px;
  align-items: center;
  color: #fff;

  .temp {
    font-size: 6rem;
    padding-right: 5px;
  }

  .info {
    flex-grow: 1;
    display: inherit;
    flex-direction: column;

    > p {
      font-size: 1.8rem;
    }

    .small-info {
      display: flex;

      .box {
        > p {
          font-size: 1.2rem;
        }
      }

      svg {
        font-size: 6rem;
        margin-bottom: -25px;
        margin-top: -20px;
        margin-left: 10px;
      }
    }
  }
`;