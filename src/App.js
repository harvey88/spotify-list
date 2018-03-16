import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let defaultTextColor = '#fff';
let defaultStyle ={
  color : defaultTextColor
};
let fakeServerData = {
  user:{
    name: 'Elijah',
    playlists: [
      {
        name: 'My favorites playlist',
        songs: [
          {name: 'whatever it takes', duraction: 1488},
          {name: 'Demons', duraction: 1488},
          {name: 'Monster', duraction: 1488}
        ]
      },
      {
        name: 'My daily playlist',
        songs: [
          {name: 'whatever it takes', duraction: 1488},
          {name: 'Demons', duraction: 1488},
          {name: 'Monster', duraction: 1488}
        ]
      },
      {
        name: 'My favorites',
        songs: [
          {name: 'whatever it takes', duraction: 1488},
          {name: 'Demons', duraction: 1488},
          {name: 'Monster', duraction: 1488}
        ]
      },
      {
        name: 'My favorites',
        songs: [
          {name: 'whatever it takes', duraction: 1488},
          {name: 'Demons', duraction: 1488},
          {name: 'Monster', duraction: 1488}
        ]
      }
    ]
  }
};

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width:'40%', display:'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    } , [])
    let totalDuraction = allSongs.reduce((sum, eachSongs) => {
      return sum + eachSongs.duraction
    } , 0)
    return (
      <div style={{...defaultStyle, width:'40%', display:'inline-block'}}>
        <h2>{Math.round(totalDuraction/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render(){
    return(
      <div style={defaultStyle}>
        <img src="" alt=""/>
        <input type="text" onKeyUp={event => 
            this.props.onTextChange(event.target.value)}/>
      </div>
    )
  }
}

class Playlist extends Component {
  render(){
      let playlist = this.props.playlist
    return (
      <div style={{...defaultStyle,display:'inline-block', width: '25%'}}>
        <img src="" alt=""/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor(){
    super();
    this.state ={
      serverDate: {},
      filterString: ''
    }
  }
  componentDidMount(){
    setTimeout (()=>{
      this.setState({serverDate: fakeServerData});
    }, 1000);
  }
  render() {
    let name ='Elijah'
    let green = '#FF1212'
    let headerStyle ={color:green, 'font-size':'50px'}
    let playlistToRender = this.state.serverDate.user ? this.state.serverDate.user.playlists
          .filter(playlist => playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())
    ) : [] 
    return (
      <div className="App">
        {this.state.serverDate.user ? 
        <div>
          <h1>
            {this.state.serverDate.user.name}'s Playlists
          </h1>
          <PlaylistCounter playlists={playlistToRender}/>
          <HoursCounter playlists={playlistToRender}/>
          <Filter onTextChange={text => this.setState({filterString: text})}/>
          {playlistToRender.map(playlist =>
              <Playlist playlist={playlist}/>
              // переберает массив и возвращает плейлист(4 знаение);
          )}
        </div> : <h1>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;
