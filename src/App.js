import React, { Component } from 'react';
import reset from 'reset-css';
import './App.css';
import queryString from 'query-string'

let defaultTextColor = '#fff';
let defaultStyle ={
  color : defaultTextColor,
  'font-family': 'Papyrus'
};
let counterStyle = {...defaultStyle, 
  width:'40%', 
  display:'inline-block',
  margin: '20px 0',
  fontSize: '16px'
}

function isEven (number){
   return number % 2
}

class PlaylistCounter extends Component {
  render() {
    let playlistCounterStyle = counterStyle
    return (
      <div style={playlistCounterStyle}>
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
    let totalDuractionHours = Math.round(totalDuraction/60) 
    let isTooLow = totalDuractionHours < 10
    let hoursCounterStyle = {...counterStyle,
      color : isTooLow ? 'red' : 'white'
    }
    return (
      <div style={hoursCounterStyle}>
        <h2>{totalDuractionHours} hours</h2>
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
      <div style={{...defaultStyle,
      display:'inline-block', 
      width: '25%',
      'background-color': isEven(this.props.index)
        ? '#C0C0C0'
        : '#808080'
      }}>
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
        .then(playlistData => {
          let playlists = playlistData.items
          let trackDataPromises = playlists.map(playlist => {
            let responsePromise = fetch(playlist.tracks.href, {
              headers: { 'Authorization': 'Bearer ' + accessToken }
            })
            let trackDataPromise = responsePromise
              .then(response => response.json())
            return trackDataPromise
          })  
          let allTracksDataPromises = 
            Promise.all(trackDataPromises)
            let playlistsPromise = allTracksDataPromises.then(trackDatas =>{
            trackDatas.forEach((trackData, i) =>{
              playlists[i].trackDatas = trackData.items
                .map(item => item.track)
                .map(trackData => ({
                  name: trackData.name,
                  duration: trackData.duration
                  // duration is undefined
                }))
            })
            return playlists
          })
          return playlistsPromise
        })
        .then(playlists => this.setState({
            playlists: playlists.map(item => {
              console.log(item);
              return {
                name: item.name,
                imageUrl: item.images[0].url, 
                songs: item.trackDatas.slice(0,3)
              }
            })
        }))
  }
  render() {
    let playlistToRender = 
      this.state.user && 
      this.state.playlists
        ? this.state.playlists.filter(playlist => {
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()) 
          let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()
          ))
          return matchesPlaylist || matchesSong
        }) : [] 
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
            {playlistToRender.map((playlist, i) =>
                <Playlist playlist={playlist} index={i}/>
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
