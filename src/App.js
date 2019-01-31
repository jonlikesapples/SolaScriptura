import React, { Component } from 'react';
import './App.css';
import {unregister} from './registerServiceWorker';
unregister();


// document.addEventListener('DOMContentLoaded', function(event) {
//   console.log("DOMContentLoaded");
//   this.testfunc();
// });


class App extends Component {

  componentDidMount() { //functions to call when page loads
  	console.log("why are you here")
  	console.log("you're not supposed to open the console")
    document.title = "Sola Scriptura"
    //console.log("mounted");
    //console.log("very beginning: pictureURL is: " + this.state.pictureURL);
    this.getPicture();
    //this.testGetPic();
    this.getVerse();
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
      //coordinates: 'https://www.google.com/maps?q=-37.866963,144.980615'
      coordinates: ''
    };
  }


  getVerse() { //'==>' handles the "this" binding
    console.log("getVerse")
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cors-anywhere.herokuapp.com/https://beta.ourmanna.com/api/v1/get/?format=json&order=random");
    xhr.onload = function(e) {
          if ((xhr.readyState === 4) && (xhr.status === 200))
            {
             var verseJSON = JSON.parse(xhr.responseText);
             var verseText = verseJSON.verse.details.text;
             var verseReference = verseJSON.verse.details.reference;
             //console.log(verseText);
             console.log(JSON.parse(xhr.responseText));
             this.setState({verseText: verseText});
             this.setState({verseReference: verseReference});   //successfully works
            }
        else
          { console.log("nope. nothing was sent.") }
      }.bind(this);
      xhr.send();
  }

  testGetPic() {
    //used only for testing
    //console.log("inside testgetpic");
    var pictureURL = 'https://images.unsplash.com/photo-1458898257815-0ec6bfaa0ade?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjI2MDg3fQ&s=872c0921c76b07a890e53c3998827899';
    this.setState({location: 'testLocation'});
    this.setState({coordinates: 'https://www.google.com/maps?q=-37.866963,144.980615'});
    this.setState({pictureURL: pictureURL}, function() {
      document.getElementById("everything").style.backgroundImage = "url(" + this.state.pictureURL +  ")";
    });
    console.log(this.state.location);
    console.log(this.state.coordinates);
  }

  getPicture() {
    //console.log("getPicture");
    var xhr = new XMLHttpRequest();
    var potentialQuery = ["wall","dark-background", "floral-background","calligraphy","rain"]
    var querySearch = potentialQuery[Math.floor(Math.random() * potentialQuery.length)];
    var API = `https://api.unsplash.com/photos/random/?query=${querySearch}&orientation=landscape&client_id=e998c0c7516d98d9f0ce345585b13dc874fce7d4f1d29f16afff8a5cb605af9a`;
    xhr.open("GET", API);
    xhr.onload = function(e) {
         if ((xhr.readyState === 4) && (xhr.status === 200)){
            var pictureJSON= JSON.parse(xhr.responseText)
            //console.log(pictureJSON)
            var pictureURL = pictureJSON.urls.regular;
            this.setState({pictureURL: pictureURL}, function() {
              document.getElementById("everything").style.backgroundImage = "url(" + this.state.pictureURL +  ")";
            });
            console.log("here's the link to the picture if you're interested " + this.state.pictureURL);

            var authorName = pictureJSON.user.name;
            this.setState({authorCredit: authorName});

            var authorCredit = pictureJSON.user.username;
            var authorCreditURL = "https://unsplash.com/@" + authorCredit + "?utm_source=solascriptura&utm_medium=referral" //link to 'username' text
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
              //console.log(this.state.location);
              //console.log(this.state.coordinates);
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
              {/* BACKGROUND IMAGE<img src = {this.state.pictureURL} /> */}
            </div>
      </div>
    );
  }
}

export default App;
