import logo from './logo.svg';
import './App.css';
import React from 'react'
import Branch from './Branch'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {treeCmd: '', rootDirName: '', result: '', result64: ''};

    this.handleChangeTreeCmd = this.handleChangeTreeCmd.bind(this);
    this.handleChangeRootDirName = this.handleChangeRootDirName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChangeTreeCmd(event) {
    this.setState({treeCmd: event.target.value});
  }

  handleChangeRootDirName(event) {
    this.setState({rootDirName: event.target.value});
  }

  base64(json) {
    return Buffer.from(json).toString('base64').slice(0, -2);
  }

  handleSubmit() {
    let json = this.treeToMermaid(this.state.treeCmd, this.state.rootDirName);
    this.setState({result: json, result64: this.base64(json)});
  }

  getMermaidConfig(branches) {
    let result = {
        code: "graph TD\n",
        mermaid: "{\n  \"theme\": \"default\"\n}",
        updateEditor: false, 
        autoSync: false, 
        updateDiagram: false};
    
    result.code += this.generateGraphElements(branches);
    
    return result;
  }

  generateGraphElements(branches) {
    let result = ""
    
    if (branches.length == 0) {
        return result;
    }

    branches.forEach(element => {
        element.branches.forEach(el2 => {
            result += "    " + element.id + "[" + element.name + "] --> " + el2.id + "[" + el2.name + "]" + '\n';
        })
    });
    result += " ";
    console.log(result);
    return result;
  }

  treeToMermaid(treeCmd, rootDirName) {
    let branch = new Branch(rootDirName, treeCmd);
    let branches = branch.loadBranches();
    console.log(branch);
    console.log(branches);
    let result = JSON.stringify(this.getMermaidConfig(branches));
    console.log(result);
    return result;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleSubmit}>
            <p>
              Input root dir name:
            </p>
            <textarea value={this.state.rootDirName} onChange={this.handleChangeRootDirName} />
            <p>
              Input tree command text:
            </p>
            <textarea value={this.state.treeCmd} onChange={this.handleChangeTreeCmd} /><br/>
            <input readOnly={true} className='btn' value="Convert" style={{marginBottom: '2em'}} onClick={this.handleSubmit} />
            <p>
            Result mermaid input:
            </p>
            <textarea value={this.state.result} readOnly={true}/>
            <p>
            B64ed:
            </p>
            <textarea value={this.state.result64} readOnly={true}/><br/>
            <a className='btn' href={'https://mermaid-js.github.io/mermaid-live-editor/edit#' + this.state.result64}>See diagram</a>
          </form>
        </header>



      </div>
    );
  }
  
}

export default App;
