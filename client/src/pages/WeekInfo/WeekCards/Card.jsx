import React, { Component } from "react";
import styled from "styled-components";

export default class Card extends Component {
  render() {
    const data = this.props.cardData;
    return (
      <StyledCard onClick={this.props.handleClick} isActive={data.isActive ? 1 : 0}>
        <div className="title">
          <h1>{data.nameBig}</h1>
          <p>{data.nameSmall}</p>
        </div>
        {data.icon}
        <p>{`${data.temperature[0]}°| ${data.temperature[1]}°`}</p>
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
  height: 220px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 5px;
  background-color: ${(props) => (props.isActive ? "#2D9CDB" : "#fff")};
  color: ${(props) => (props.isActive ? "#fff" : "#000")};
  transition: 0.4s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  .title {
    pointer-events: none;
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
    pointer-events: none;
    color: inherit;
    font-size: 1.4rem;
  }

  svg {
    pointer-events: none;
    color: inherit;
    font-size: 5rem;
  }
`;
