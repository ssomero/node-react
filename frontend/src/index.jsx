
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './assets/stylesheets/style.css';

const baseURL = process.env.ENDPOINT;
const getGreetings = async () => {
  try {
    const url = `${baseURL}/api/greetings`;
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error(error);
  }
  return { greeting: 'Could not get greetings from backend' };
};


const Greetings = (props) => {
  const GreetingList = props.greetings.map(c => <li>{c.message}</li>);
  return (
    <ul>Greetings {GreetingList}</ul>
  );
};

class App extends Component {
  state = { greetings: [] }

  async componentWillMount() {
    const response = await getGreetings();
    this.setState({ greetings: response.results });
  }

  render() {
    return <Greetings greetings={this.state.greetings} />;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
