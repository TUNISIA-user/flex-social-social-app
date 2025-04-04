import React from 'react';
import ReactSiriwave from 'react-siriwave';
import styled from 'styled-components';

const FlexSiri = () => {
  return (
    <> 
   
    <StyledWrapper>
      <button>
        <span style={{position:"relative",top:"3px"}} > 

        <ReactSiriwave
    amplitude={2} // Controls the wave's height
    speed={0.1} // Controls the wave's animation speed
    color="#ff0077" // Sets the color of the wave
    width={60} // Width of the wave canvas
    height={40} // Height of the wave canvas
    style={{ margin: "0 auto" }}
  />

        </span>
        <div className="line" />
        <div className="line-2" />
        <div className="speak" />
        <div className="speak one" />
        <div className="speak two" />
        <div className="speak three" />
      </button>
    </StyledWrapper>
    </>
  );
}

const StyledWrapper = styled.div`
  button {
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 199px;
    border-radius: 50px;
    border-width: 0;
    background-color: black;
    color: white;
    font-size: 16px;
    letter-spacing: 3px;
    position: relative;
    overflow: hidden;
    padding: 10px 20px;
    width: 190px;
    cursor: pointer;
  }

  button span {
    position: relative;
    width: max-content;
    z-index: 99;
    display: block;
  }

  .line,.line-2 {
    position: absolute;
    width: calc(100% - 20px);
    left: 0;
    right: 0;
    margin: 0 auto;
    height: 1px;
    border-radius: 100%;
    background-color: hsla(240, 100%, 50%, 0.39);
    bottom: 5px;
    animation: line .5s infinite linear;
    box-shadow: 0 0 10px 2px rgb(0, 60, 255);
    z-index: 9;
  }

  @keyframes line {
    0% {
      height: 1px;
      background-color: hsla(240, 100%, 50%, 0.285);
    }

    50% {
      transform: scaleY(5);
      background-color: hsla(0, 59%, 41%, 0.032);
      box-shadow: 0 0 100px 20px rgb(0, 60, 255);
    }

    100% {
      height: 2px;
      background-color: rgb(255, 255, 255)
    }
  }

  .line-2 {
    animation: line-2 .5s infinite linear;
    bottom: 1px;
    box-shadow: 0 0 10px 2px rgb(0, 60, 255);
  }

  @keyframes line-2 {
    0% {
      height: 1px;
      background-color: hsl(327, 100%, 50%);
    }

    50% {
      height: 2px;
      background-color: hsl(0, 0%, 85%)
    }

    100% {
      height: 2px;
      background-color: rgb(255, 255, 255)
    }
  }

  .speak {
    position: absolute;
    width: 330px;
    height: 10px;
    background-color: pink;
    bottom: 1px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 100%;
    animation: speak .8s infinite linear;
  }

  .speak.one {
    left: calc(50% + 20px);
    animation: speak 6s infinite linear;
    background-color: hsl(284deg 79% 55%);
  }

  .speak.two {
    left: calc(50% + 10px);
    animation: speak .6s infinite linear;
    background-color: hsl(284deg 79% 55%);
  }

  .speak.two {
    left: calc(50% + -10px);
    animation: speak .6s infinite linear;
    background-color: rgb(0, 255, 149);
  }

  @keyframes speak {
    0% {
      transform: translateX(-50%) scale(.10);
    }
  }`;

export default FlexSiri;
