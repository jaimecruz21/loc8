import React, { Component} from "react";
import "./App.css";
import 'antd/dist/antd.css'; 
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import MainContainer from './containers/mainScreen/';
import Loc8 from '../lib';
 
class App extends Component{
  render(){
    const loc8 = Loc8.init();
    return(
      <div className="App">
        <Layout>
            <Content>
              <MainContainer loc8={loc8} />
            </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
