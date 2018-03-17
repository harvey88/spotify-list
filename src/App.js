import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'

let defaultTextColor = '#fff';
let defaultStyle ={
  color : defaultTextColor
};
// let fakeServerData = {
//   user:{
//     name: 'Elijah',
//     playlists: [
//       {
//         name: 'My favorites playlist',
//         songs: [
//           {name: 'whatever it takes', duraction: 1488},
//           {name: 'Demons', duraction: 1488},
//           {name: 'Monster', duraction: 1488}
//         ]
//       }
//     ]
//   }
// };

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
        <img src={playlist.imageUrl} style={{ width: '90%', marginTop: '10px'}} />
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
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if (!accessToken)
      return;

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.id
        }
      }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => this.setState({
          playlists: data.items.map(item => {
            console.log(data.items);
            return {
              name: item.name,
              imageUrl: item.images[0].url, 
              songs: []
            }
          })
      }))
  }
  render() {
    let playlistToRender = 
      this.state.user && 
      this.state.playlists
        ? this.state.playlists.filter(playlist => 
          playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase())) 
        : [] 
    return (
      <div className="App">
        {this.state.user ? 
        <div>
          <h1>
            {this.state.user.name}'s Playlists
          </h1>
            <PlaylistCounter playlists={playlistToRender}/>
            <HoursCounter playlists={playlistToRender}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {playlistToRender.map(playlist =>
                <Playlist playlist={playlist}/>
                // переберает массив и возвращает плейлист(4 знаение);
            )}
        </div> : <button onClick={() => {
          window.location = window.location.href.includes('localhost') 
            ? 'http://localhost:8888/login' 
            : 'https://dev-tips-backend.herokuapp.com/login'} 
        } className='btn-signin'>Sign in with Spotify </button>
        }
      </div>
    );
  }
}

export default App;
