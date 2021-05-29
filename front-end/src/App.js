import React from 'react';
import './App.css';
import { CATEGORIES } from './data'
import DisplayTask from "./components/DisplayTask"

class App extends React.Component {

  state = {
    categoryDisplay: "",
    newTask: "",
    chooseCategory: "Code",
    tasks: []
  }

  componentDidMount(){
    fetch("http://localhost:9393/tasks")
    .then(res => res.json())
    .then(tasks => this.setState({
      tasks
    }))
  }

  handleClick =(event) => {
    event.target.innerText === "All" ? 
    this.setState({categoryDisplay: ""}) :
    this.setState({categoryDisplay: event.target.innerText})
  }

  handleDelete  = (deleteTask) => {

    fetch("http://localhost:9393/tasks/"+deleteTask.id, {
      method: "DELETE",
      headers: {'Content-Type': 'application/json'}
    })

    this.setState({
      tasks: this.state.tasks.filter(task => task !== deleteTask)
    })
  }

  handleAddTask = (e) => {
    e.preventDefault()

    fetch("http://localhost:9393/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: this.state.newTask, 
        category: this.state.chooseCategory
      })
    })
    .then(res => res.json())
    .then(addedTask => {
      this.setState({
        tasks: [...this.state.tasks, addedTask], 
        newTask: ""
      })
    })
  }

  render() {
      
    let filterTasks = this.state.tasks.filter(task => task.category.includes(this.state.categoryDisplay))
    
    return (
      <div className="App">
        <h2>My tasks</h2>
        <div className='categories'>
          <h5>Category filters</h5>
          {CATEGORIES.map((category, i) => <button key={i} onClick={this.handleClick}>{category}</button>)}
        </div>
        <div className="tasks">
          <h5>Tasks</h5>
          <form className="new-task-form">
            <input onChange={(e) => this.setState({newTask: e.target.value})} placeholder="New task details" type="text" value={this.state.newTask}></input>
              <select onChange={(e) => this.setState({chooseCategory: e.target.value})}>
                <option>Code</option>
                <option>Food</option>
                <option>Money</option>
                <option>Misc</option>
              </select>
            <input onClick={this.handleAddTask} type="submit" value="Add task"></input>
          </form>
          {filterTasks.map((task,i) => <DisplayTask key={i} task={task} handleDelete={this.handleDelete}/>)}
        </div>
      </div>
    );
  }
}


export default App;
