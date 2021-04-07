import React from "react";
import { Row, Col, Layout } from "antd";
import "antd/dist/antd.css";
import D3line from "./sleeeppic";
// import D3line from "./sleepslabel";




const { Content } = Layout;
class ContentMain extends React.Component {
  render() {
    return (
      <Layout key="mainLayout">
        <D3line key={'myfirst'}></D3line>
      </Layout>
    );
  }
}

export default ContentMain;
