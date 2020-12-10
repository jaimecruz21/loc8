import React, { Component} from "react";
import "./App.css";
import 'antd/dist/antd.css'; 
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import MainContainer from './containers/mainScreen/';

class App extends Component{
  render(){
    return(
      <div className="App">
        <Layout>
            <Content>
              <MainContainer />
            </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
