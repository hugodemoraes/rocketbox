import React, { Component } from "react";

import api from "../../services/api";

import logo from "../../assets/logo.svg";
import "./styles.css";

export default class Main extends Component {
  state = {
    newBox: ""
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { newBox: title } = this.state;
    const { history } = this.props;

    const { data } = await api.post("/boxes", {
      title
    });

    history.push(`/box/${data._id}`);
  };

  handleInputChange = e => {
    this.setState({ newBox: e.target.value });
  };

  render() {
    const { newBox } = this.state;

    return (
      <div id="main-container">
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="Logo" />
          <input
            placeholder="Your box name"
            value={newBox}
            onChange={this.handleInputChange}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
}
