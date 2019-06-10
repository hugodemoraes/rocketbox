import React, { Component } from "react";
import { MdInsertDriveFile } from "react-icons/md";
import { distanceInWords } from "date-fns";
import DropZone from "react-dropzone";
import socket from "socket.io-client";

import api from "../../services/api";

import logo from "../../assets/logo.svg";
import "./styles.css";

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const {
      match: {
        params: { id }
      }
    } = this.props;

    const { data: box } = await api.get(`/boxes/${id}`);

    this.setState({ box });
  }

  subscribeToNewFiles = () => {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const io = socket(process.env.REACT_APP_API_URL);

    io.emit("connectRoom", id);

    io.on("file", data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = files => {
    const {
      box: { _id }
    } = this.state;

    files.forEach(file => {
      const data = new FormData();

      data.append("file", file);

      api.post(`/boxes/${_id}/files`, data);
    });
  };

  render() {
    const {
      box: { title, files }
    } = this.state;

    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{title}</h1>
        </header>

        <DropZone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Drop you file or click here</p>
            </div>
          )}
        </DropZone>

        <ul>
          {files &&
            files.map(file => (
              <li key={file._id}>
                <a
                  className="fileInfo"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdInsertDriveFile size={24} color="#A5CFFF" />
                  <strong>{file.title}</strong>
                </a>
                <span>{distanceInWords(file.createdAt, new Date())}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
