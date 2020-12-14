import React, { Component} from "react";
import "./App.css";
import 'antd/dist/antd.css'; 
import { Layout, Row, Col,  } from 'antd';
const { Header, Footer, Content } = Layout;
import MainContainer from './containers/mainScreen/';

class App extends Component{
  render(){
    return(
        <Layout>
          <Header></Header>
          <Content >
            <Row>
              <Col>
                <MainContainer />
              </Col>
            </Row>
          </Content>
          <Footer></Footer>
        </Layout>
    );
  }
}

export default App;
