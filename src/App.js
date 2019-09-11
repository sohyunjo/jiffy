import React from 'react';
import clearButton from './assets/close-icon.svg';
import loader from './assets/loader.svg';
import Gif from './Gif';

const UserHint = ({ loading, hintText }) => (
  <div className='user-hint'>
    {loading ? <img className='block mx-auto' src={loader} /> : hintText}
  </div>
);

const Header = ({ clearSearch, hasResults }) => (
  <div className='header grid'>
    {hasResults ? (
      <img src={clearButton} onClick={clearSearch} />
    ) : (
      <h1 className='title'>Jiffy</h1>
    )}
  </div>
);

const randomChoice = arr => {
  const i = Math.floor(Math.random() * arr.length);
  return arr[i];
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      hintText: '',
      gifs: [],
      loading: false
    };
    this.textInput = React.createRef();
  }

  searchGiphy = async searchTerm => {
    this.setState({
      loading: true
    });
    try {
      //using await keyword to wait for the response
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=zvOylnbGt1lpXjoTktERUActtQgrRAjW&q=${searchTerm}&limit=25&offset=0&rating=G&lang=en`
      );
      //waiting for response to convert into json
      const { data } = await response.json();

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }
      const randomGif = randomChoice(data);

      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `hit enter to see more ${searchTerm}`
      }));
    } catch (e) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: e,
        loading: false
      }));
    }
  };

  handleChange = event => {
    //const value = event.target.value;
    const { value } = event.target;
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

  // when there is 2+ characters in search box, allow to run search by pressing enter key
  handleKeyPress = event => {
    const { value } = event.target;

    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value);
    }
  };

  //reset state
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    this.textInput.current.focus();
  };

  render() {
    //const searchTerm = this.state.serachTErm
    const { searchTerm, gifs } = this.state;
    const hasResults = gifs.length;
    return (
      <div className='page'>
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className='search grid'>
          {/* stack of gif images */}
          {/* only going to render when gif is not null */}
          {gifs && gifs.map(gif => <Gif {...gif} />)}
          <input
            ref={this.textInput}
            className='input grid-item'
            placeholder='Type Something.'
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
