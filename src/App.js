import React, { Component } from 'react';
import './App.css';
import { config } from './config'
//ask Jon Wong for config file

class App extends Component {

  componentDidMount() { //functions to call when page loads
  	console.log("why are you here")
  	console.log("you're not supposed to open the console")
    document.title = "Sola Scriptura"
    this.getPicture();
    this.getVerse();
    console.log(config["UNSPLASH_CLIENT_ID"])
  }

  constructor(props) {
    super(props);
    this.state = {
      verseText: '',
      verseReference: '',
      pictureURL: '',
      authorCredit: '',
      authorCreditURL: '',
      appCreditURL: 'https://unsplash.com/?utm_source=solascriptura&utm_medium=referral',
      location: '',
      coordinates: ''
    };
  }


  getVerse() {
    console.log("getVerse")
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cors-anywhere.herokuapp.com/https://beta.ourmanna.com/api/v1/get/?format=json&order=random");
    xhr.onload = function(e) {
          if ((xhr.readyState === 4) && (xhr.status === 200))
            {
             var verseJSON = JSON.parse(xhr.responseText);
             var verseText = verseJSON.verse.details.text;
             var verseReference = verseJSON.verse.details.reference;
             console.log(JSON.parse(xhr.responseText));
             this.setState({verseText: verseText});
             this.setState({verseReference: verseReference});   //successfully works
            }
        else
          { console.log("nope. nothing was sent.") }
      }.bind(this);
      xhr.send();
  }

  getPicture() {
    var xhr = new XMLHttpRequest();
    var potentialQuery = ["nature", "mountains", "snow", "cloud", "sky"]
    var querySearch = potentialQuery[Math.floor(Math.random() * potentialQuery.length)];
    console.log("QUERY:", querySearch);
    var API = `https://api.unsplash.com/photos/random/?query=${querySearch}&orientation=landscape&client_id=${config["UNSPLASH_CLIENT_ID"]}`;
    xhr.open("GET", API);
    xhr.onload = function(e) {
         if ((xhr.readyState === 4) && (xhr.status === 200)){
            var pictureJSON= JSON.parse(xhr.responseText)
            var pictureURL = pictureJSON.urls.regular;
            this.setState({pictureURL: pictureURL}, function() {
              document.getElementById("everything").style.backgroundImage = "url(" + this.state.pictureURL +  ")";
            });
            console.log("here's the link to the picture if you're interested " + this.state.pictureURL);

            var authorName = pictureJSON.user.name;
            this.setState({authorCredit: authorName});

            var authorCredit = pictureJSON.user.username;
            var authorCreditURL =`https://unsplash.com/@${authorCredit}?utm_source=solascriptura&utm_medium=referral` //link to 'username' text
            this.setState({authorCreditURL: authorCreditURL});

            if (pictureJSON.hasOwnProperty('location')) {
              var picLocation = pictureJSON.location;
              var picLocTitle = picLocation.title;
              this.setState({location: picLocTitle});
              //format: https://www.google.com/maps?q[lat],[long]
              var googleMapsEndpoint = "https://www.google.com/maps?q="
              var latitude = picLocation.position.latitude;
              var longitude = picLocation.position.longitude;
              this.setState({coordinates: googleMapsEndpoint + latitude + "," + longitude});
            }
            else { //console.log("NO LOCATION!")
        		}
          }
          else { console.log("nope. nothing was sent.") }
      }.bind(this);
      xhr.send();
  }

  render() {
    return (
      <div className="App" id="everything">
          <div id = "timeSlot"> </div>
          <div id = "verse">
            <div className="verseText">
              { this.state.verseText } <br/>
              <div className = "verseReference"> {this.state.verseReference} </div>
            </div>
          </div>

          <br/>

          <div className = "liability" id="liability">
            Photo by {" "}
            <a href = {this.state.authorCreditURL}>{this.state.authorCredit}</a> on {" "}
            <a href = {this.state.appCreditURL}>Unsplash</a>
          </div>

          <div className = "location" id="location">
           <a href = {this.state.coordinates}> {this.state.location} </a>
          </div>
            <div id="picture">
              <div>  </div>
            </div>
      </div>
    );
  }
}

export default App;
