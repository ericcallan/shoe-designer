import React, { Component } from 'react';
import '../styles/index.css';
import * as d3 from "d3";
import axios from "axios";
import PolygonAnimator from './PolygonAnimator';

class App extends Component {

  constructor() {
    super();

    this.primaryKey = '45f72fbb4c98437893d63869bb67a48d';
    this.secondaryKey = 'ac046eadeea4416c8a010d4c15905136';

    this.setSelectedTeam = this.setSelectedTeam.bind(this);
    this.setSelectedPlayer = this.setSelectedPlayer.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);

    this.state = {
      teams: [],
      players: [],
      selectedPlayer: {},
      selectedTeam: {},
      teamID: null,
      playerInfo: {},
      selectorStatus: '',
      selectedPlayerIndex:0,
      imageStatus: false
    }
  }

  componentDidMount() {
    this.getTeams();
  }

  getTeams() {
    let config = {
      headers: {
        "Ocp-Apim-Subscription-Key": this.primaryKey,
      }
    }

    axios.get("https://api.fantasydata.net/v3/mlb/stats/JSON/teams", config)
      .then((response) => {
        this.setState({
          teams: response.data,
          selectedTeam: response.data[0],
          teamID: response.data[0].Key
        })

        this.getPlayers(response.data[0].Key)       
      });
  }

  getPlayers(id) {
    let config = {
      headers: {
        "Ocp-Apim-Subscription-Key": this.primaryKey,
      }
    }
     axios.get(`https://api.fantasydata.net/v3/mlb/stats/JSON/Players/${id}`, config)
      .then((response) => {
        response.data.sort(this.comparator);

        const toRemove = ['P'];

        const filteredPlayers = response.data.filter(function(player) { 
          return toRemove.indexOf(player.PositionCategory) < 0;
        });

        this.setState({
          players: filteredPlayers,
          selectedPlayer: filteredPlayers[0],
          selectedPlayerIndex: 0
        });

        this.getPlayer(response.data[0].PlayerID)      
    });
  }


  getPlayer(id) {
    let config = {
      headers: {
        "Ocp-Apim-Subscription-Key": this.primaryKey,
      }
    }

    axios.get(`https://api.fantasydata.net/v3/mlb/stats/JSON/PlayerSeasonStatsByPlayer/2017/${id}`, config)
      .then((response) => {

        this.setState({
          playerInfo: response.data
        })       
    });
  }

  setSelectedTeam(event){
    this.setState({
      'selectedTeam': this.state.teams[event.target.value],
      'teamID': this.state.teams[event.target.value].Key
    });

    this.setState({
      refresh: true
    });

    this.getPlayers(this.state.teams[event.target.value].Key);
  }

  setSelectedPlayer(event) {
    this.setState({
      'selectedPlayer': this.state.players[event.target.value],
      'selectedPlayerIndex': event.target.value
    });

     this.getPlayer(this.state.players[event.target.value].PlayerID);
  }

  showMenu() {
    if(this.state.selectorStatus === '') {
      this.setState({
        selectorStatus: 'active'
      });
    } else {
      this.setState({
        selectorStatus: ''
      });
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  comparator(a, b) {
    if (a.LastName < b.LastName) return -1;
    if (a.LastName > b.LastName) return 1;
    
    return 0;
  }

  handleImageLoaded() {
    console.log("loaded");
    this.setState({ imageStatus: true });
  }

  showPolygon() {
    let divStyle = {
      backgroundColor: '#' + this.state.selectedTeam.PrimaryColor
    };

    let color = {
      color: '#' + this.state.selectedTeam.PrimaryColor
    };


    console.log(this.state);
    if(this.state.imageStatus === true) {
      return (
        <div>
          <div style={divStyle} className="base"></div>
          <div className="player-number">
            <h4 style={color} >{this.state.selectedPlayer.Jersey}</h4>
            {/*<p style={{color: '#000' }}>{this.state.selectedPlayer.FirstName} {this.state.selectedPlayer.LastName}</p>*/}
          </div>
          <PolygonAnimator
              strikeOuts={this.state.playerInfo.PitchingStrikeouts}
              category={this.state.selectedPlayer.PositionCategory}
              hits={this.state.playerInfo.Hits}
              atBats={this.state.playerInfo.AtBats}
              primaryColor={this.state.selectedTeam.PrimaryColor}
              secondaryColor={this.state.selectedTeam.SecondaryColor} 
              tertiaryColor={this.state.selectedTeam.TertiaryColor}
              refresh={this.state.refresh}
           />
        </div>
      )
    } else {
      return <div></div>
    }
  }
  render() {
    d3.selectAll("polygon")
      .attr("fill", '#' + this.state.selectedTeam.SecondaryColor)
      .attr("stroke", '#' + this.state.selectedTeam.TertiaryColor)

    let onBase = this.state.playerInfo.OnBasePercentage 
    if(this.state.playerInfo.OnBasePercentage >= 0) {
      onBase = this.state.playerInfo.OnBasePercentage + "" + this.getRandomInt(0,99);
    }

    let battingAvg = this.state.playerInfo.BattingAverage 
    if(this.state.playerInfo.BattingAverage >= 0) {
      battingAvg = this.state.playerInfo.BattingAverage + "" + this.getRandomInt(0,99);
    }

    return (
      <div  >
        <div className="fake-menu">
          <img src="./images/header.png" className="menu" />
        </div>
        <img onLoad={this.handleImageLoaded} className="shoe" src="./images/BG-shoe-3.png" />
        <div className={"selector " + this.state.selectorStatus}>
          <select className="styledSelect" onChange={this.setSelectedTeam} value={this.state.selectedTeam.city} >
          {
            this.state.teams.map((item, i) => {
                return <option value={i} key={i}>{item.City} {item.Name}</option>
            }) 
          }
          </select>

          <select className="styledSelect" onChange={this.setSelectedPlayer} value={this.state.selectedPlayerIndex} >
          {
            this.state.players.map((item, i) => {
                return <option value={i} key={i}>{item.FirstName} {item.LastName}</option>
            }) 
          }
          </select>
          <h2>{this.state.selectedTeam.City} {this.state.selectedTeam.Name}</h2>
          <h3>{this.state.selectedPlayer.FirstName} {this.state.selectedPlayer.LastName}</h3>
          <h3>2017</h3>
          <ul>
            <li>At Bats: {Math.ceil(this.state.playerInfo.AtBats) || "-"}</li>
            <li>Hits: {Math.ceil(this.state.playerInfo.Hits) || "-"}</li>
            <li>On Base Percentage: {onBase || "-"}</li>
            <li>Batting Average: {battingAvg  || "-"}</li>
          </ul>
        </div>
        <img className="shopnow" src="./images/ShopNow.png" />
        {this.showPolygon()}
      </div>
    )
  }
}

export default App;
