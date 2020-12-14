import React, { Component } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import WeekCards from "./WeekCards/WeekCards";
import WeekTable from "./WeekTable";

const variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 100%)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(1px at 100% 100%)",
    transition: {
      // delay: 0.5,
      type: "spring",
      stiffness: 200,
      damping: 40,
    },
  },
};

export default class WeekInfo extends Component {
  render() {
    return (
      <StyledPage
        isActive={this.props.isActive ? 1 : 0}
        initial={false}
        animate={this.props.isActive ? "open" : "closed"}
        variants={variants}
      >
        <WeekCards
          showInfo={this.props.showInfo}
          closeWeekInfo={this.props.closeWeekInfo}
          IconsForWeather={this.props.IconsForWeather}
        />
        <WeekTable />
      </StyledPage>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledPage = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
  background-color: #f2f2f2;
  display: grid;
  grid-template-rows: auto 1fr;

  pointer-events: ${(props) => (props.isActive ? "all" : "none")};
`;
