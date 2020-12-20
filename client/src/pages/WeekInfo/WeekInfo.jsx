import React, { Component } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { GlobalDataContext } from "../../components/GlobalDataProvider";
import api from "../../tools/connect";

import WeekCards from "./WeekCards/WeekCards";
import WeekTable from "./WeekTable";

const variants = {
  open: {
    // clipPath: `circle(2200px at 50% 50%)`,
    clipPath: `circle(2200px at 100% 100%)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    // clipPath: `circle(0px at 50% 50%)`,
    clipPath: `circle(0px at 100% 100%)`,
    transition: {
      // delay: 0.5,
      type: "spring",
      stiffness: 300,
      damping: 40,
    },
  },
};

export default class WeekInfo extends Component {
  static contextType = GlobalDataContext;
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      enlargeTable: false,
      addedDates: [this.props.showInfo.dateMeasurement],

      tableLoading: false,
    };

    this.weekCardsRef = React.createRef();
  }

  componentDidMount() {
    this.prepareTableData(this.props.dateData);
  }
  async handleAddDayDataToTable(date) {
    this.setState({
      tableLoading: true,
    });
    const dayData = await api
      .getDayInfo(date)
      .catch((err) => this.context.error(err.message));
    if (!dayData) return;

    let tableData = [...this.state.tableData, ...dayData];
    let addedDates = [...this.state.addedDates];
    addedDates.push(date);
    this.setState({
      tableData,
      addedDates,
      tableLoading: false,
    });
  }
  async handleRemoveDayDataToTable(date) {
    const addedDates = [...this.state.addedDates].filter((el) => el !== date);
    const tableData = [...this.state.tableData].filter(
      (el) => el.dateMeasurement !== date
    );

    this.setState({
      tableData,
      addedDates,
    });
  }
  toggleEnlargeTable() {
    this.setState((prevState) => {
      return {
        enlargeTable: !prevState.enlargeTable,
      };
    });
  }
  prepareTableData(data) {
    this.setState({
      tableData: [...data],
    });
  }
  changeDay(date) {
    this.setState({
      addedDates: [date],
    });
    this.props.changeDay(date);
  }

  render() {
    return (
      <StyledPage
        isActive={this.props.isActive ? 1 : 0}
        initial={false}
        animate={this.props.isActive ? "open" : "closed"}
        variants={variants}
      >
        <WeekCards
          ref={this.weekCardsRef}
          changeDay={this.changeDay.bind(this)}
          showInfo={this.props.showInfo}
          closeWeekInfo={this.props.closeWeekInfo}
          IconsForWeather={this.props.IconsForWeather}
          addedDates={this.state.addedDates}
          addTableData={this.handleAddDayDataToTable.bind(this)}
          removeTableData={this.handleRemoveDayDataToTable.bind(this)}
          tableLoading={this.state.tableLoading}
          enlargeTable={this.state.enlargeTable}
          handleEnlargeTable={this.toggleEnlargeTable.bind(this)}
        />
        <WeekTable
          weekCardsRef={this.weekCardsRef}
          tableData={this.state.tableData}
          tableLoading={this.state.tableLoading}
          showInfo={this.props.showInfo}
          enlargeTable={this.state.enlargeTable}
          handleEnlargeTable={this.toggleEnlargeTable.bind(this)}
        />
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
