import React, { Component } from "react";
import styled from "styled-components";

import { Slider } from "@material-ui/core";

// Icons
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default class TimeSelect extends Component {
  state = {
    date: new Date(),
    active: false,
    marks: null,
    timeSliderValue: 0,

    activeChanged: false,
    showNotifier: false,
  };

  componentDidMount() {
    if (!this.props.data) return;
    this.prepareSliderData();

    this.timer = setInterval(() => this.setState({ date: new Date() }), 1000);

    setTimeout(() => {
      if (!this.state.activeChanged) {
        this.setState({
          showNotifier: true,
        });
      }
    }, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  handleSliderChange(e, newVal) {
    this.state.marks.forEach((mark, i) => {
      if (mark.value === newVal) {
        if (mark._data.timeMeasurement === this.props.data.timeMeasurement) return;
        this.props.chageShowInfo(mark._data);

        const step = parseInt(100 / (this.props.fullData.length - 1));
        this.setState({
          timeSliderValue: step * i > 98 ? 100 : step * i,
        });
      }
    });
  }
  prepareSliderData() {
    let data = [...this.props.fullData];
    data.reverse();
    let marks = [];
    let timeSliderValue = 0;

    if (data.length === 1) {
      marks.push({
        label: data[0].timeMeasurement.slice(0, 5),
        value: 0,
        _data: data[0],
      });
      this.setState({
        marks,
        timeSliderValue,
      });
      return;
    }

    const step = parseInt(100 / (data.length - 1));
    data.forEach((el, i) => {
      if (el.timeMeasurement === this.props.data.timeMeasurement) {
        timeSliderValue = step * i > 98 ? 100 : step * i;
      }
      marks.push({
        label: el.timeMeasurement.slice(0, 5),
        value: step * i,
        _data: el,
      });
    });

    // Ensure last value always will be 100
    marks[marks.length - 1].value = 100;

    this.setState({
      marks,
      timeSliderValue,
    });
  }

  render() {
    return (
      <StyledContainer
        active={this.state.active ? 1 : 0}
        showNotifier={this.state.showNotifier ? 1 : 0}
        onMouseLeave={() => {
          if (this.state.active) {
            this.setState({ active: false });
          }
        }}
      >
        <div
          className="time"
          onMouseOver={() => {
            if (!this.state.active) {
              this.setState({ active: true, activeChanged: true, showNotifier: false });
            }
          }}
        >
          <span className="time-time">{this.state.date.getHours()}</span>
          <span className="time-time colon">:</span>
          <span className="time-time">
            {this.state.date.toLocaleTimeString().split(":")[1]}
          </span>
        </div>

        <div className="notifier">
          <ArrowBackIosIcon />
          <p>Hover on time</p>
        </div>

        <div className="rangeInput">
          <p>Select which time to show</p>
          {this.state.marks && (
            <Slider
              disabled={!this.state.active}
              // defaultValue={this.state.selectedValue}
              value={this.state.timeSliderValue}
              onChange={this.handleSliderChange.bind(this)}
              step={null}
              valueLabelDisplay="off"
              marks={this.state.marks}
            />
          )}
        </div>
      </StyledContainer>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  position: relative;
  transition: 0.3s background-color;
  backdrop-filter: ${(props) => (props.active ? "blur(5px)" : "unset")};
  background-color: ${(props) => (props.active ? "rgba(0,0,0,0.4)" : "transparent")};

  .time {
    padding: 15px 0 15px 15px;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    color: white;
    cursor: default;
    transition: 0.4s;
    /* background-color: ${(props) => (props.active ? "#fff" : "transparent")}; */

    .time-time {
      /* color: ${(props) => (props.active ? "#000" : "inherit")}; */
      font-size: 4rem;
      transition: 0.4s;
    }

    .colon {
      position: relative;
      top: -3px;
      font-size: 4.2rem;
      margin: 0 5px;
      animation: blink 1s ease-in-out infinite;

      @keyframes blink {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    }
  }

  .notifier {
    position: absolute;
    left: 184px;
    padding-left: 35px;
    color: rgba(255, 255, 255, 0.7);
    display: ${(props) => (props.active ? "none" : "flex")};
    align-items: center;
    opacity: ${(props) => (props.showNotifier ? "1" : 0)};
    animation: ${(props) =>
      props.showNotifier ? "animate 0.4s ease-in-out 3 forwards" : "unset"};
    transition: 0.3s;

    svg {
      color: inherit;
      font-size: 2.4rem;
    }

    p {
      color: inherit;
      font-size: 1.8rem;
    }

    @keyframes animate {
      0% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(-5deg);
      }
      50% {
        transform: rotate(0deg);
      }
      75% {
        transform: rotate(5deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  }

  .rangeInput {
    flex-grow: 1;
    transition: 0.4s;
    /* background-color: #fff; */
    height: 100%;
    opacity: ${(props) => (props.active ? "1" : "0")};
    pointer-events: ${(props) => (props.active ? "all" : "none")};
    /* border-left: 1px solid rgba(0, 0, 0, 0.2); */

    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    align-items: center;
    padding: 0 25px;
    padding-bottom: 5px;

    p {
      color: white;
      font-size: 1.4rem;
      white-space: nowrap;
    }

    .MuiSlider-root {
      width: 99%;
      grid-area: 2 / 1 / 2 / 3;
      color: #fff;

      .MuiSlider-markLabel {
        color: inherit;
        font-size: 1.2rem;
      }

      .MuiSlider-markLabelActive {
        color: inherit;
        font-size: 1.2rem;
      }
    }
  }
`;
