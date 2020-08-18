import React from 'react';


// Sounds Array

const DATA = [
  { letter: 'Q',
    keycode: 81,
    id: 'Open-HH',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  { letter: 'W',
    keycode: 87,
    id: 'Closed-HH',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  },
  { letter: 'E',
    keycode: 69,
    id: 'Kick-and-Hat',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  },
  { letter: 'A',
    keycode: 65,
    id: 'Punchy-Kick',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
  },
  { letter: 'S',
    keycode: 83,
    id: 'Kick',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  { letter: 'D',
    keycode: 68,
    id: 'Snare',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
  },
  { letter: 'Z',
    keycode: 90,
    id: 'Side-Stick',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
  },
  { letter: 'X',
    keycode: 88,
    id: 'Clap',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  },
  { letter: 'C',
    keycode: 67,
    id: 'Shaker',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
  },
];

// Pads styles variables
const onStyle = {transform: "scale(0.95)", boxShadow: "1px 1px 4px 4px #7915d1, -1px -1px 4px 4px #7915d1"};
const offStyle = {transform: "scale(1)", boxShadow: "none"};

// Drum Pad Component
class Pad extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playing: false
    };
    this.handleKeydown = this.handleKeydown.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }  
  
  // lifecycle methods
  componentDidMount(){
    document.addEventListener("keydown", this.handleKeydown)
    window.focus()
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeydown)
  }
  
//   Handle Events
  handleKeydown = event => {
    if(event.keyCode === this.props.pad.keycode) {
      this.onPlay();
    }
  }
  
  onPlay () {
    if(this.props.power){
      const audio = document.getElementById(this.props.pad.letter);
      audio.currentTime = 0;
      audio.volume = this.props.volume;
      audio.play();
      this.props.handleDisplay(this.props.pad.id);
      this.setState({playing: true})
      setTimeout(() => {
        this.setState({playing: false})
      }, 100);
    }
  }

  render() {
    const style = !this.props.power ? {background: "#664d53"} : this.state.playing ? onStyle : offStyle;
    return (
      <div style={style} className="outer-drum-pad">
        <div
          className="drum-pad" 
          id={this.props.pad.id}
          onClick={this.onPlay}
        >
          <h1>{this.props.pad.letter}</h1>
          <audio 
            id={this.props.pad.letter}
            src={this.props.pad.src}
            className="clip"
          ></audio>
        </div>   
      </div>  
    )
  }
}

// Control Panel Component  
class ControlPanel extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const style = this.props.power ? {background: "#05a650"} : {background: "#b52838", boxShadow: "none"};
    return (
      <div className="control-panel">
        <div className="label">Drum Machine</div>
        <div style={this.props.colorStyle} className="display" id="display">
          {this.props.currentSound}</div>
          <button style={style} onClick={this.props.togglePower}><i class="fas fa-power-off"></i>        </button>
        <div>
          <p>Volume</p>
          <input value={this.props.volumeInput}
                 type="range"
                 min="1"
                 max="100"
                 onChange={this.props.changeVolume}>
          </input>
        </div>    
      </div>   
    ) 
  }  
}
  
// Main Component  
class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentSound: "",
      power: true,
      volumeInput: 50,
      volume: 0.5
     }
    this.handleDisplay = this.handleDisplay.bind(this);
    this.togglePower = this.togglePower.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
  }
  
  handleDisplay = id => this.setState({ currentSound: id })
  togglePower () {
    const message = !this.state.power && "Press a key";
    this.setState({power: !this.state.power,
                   currentSound: message});
    setTimeout(() => {
      this.setState({ currentSound: ""});
    }, 1500);
  }
  
   changeVolume (event) {
     const volume = event.target.value / 100;
     const message = "Volume: " + event.target.value;
     this.setState({volume: volume,
                    volumeInput: event.target.value,
                    currentSound: message})
      }
          
   render(){
    const colorStyle = this.state.power ? {background: "radial-gradient(#7915d1, #410163)"} : {background: "#242424"};
    // pads function
     const pads = this.props.data.map((pad, i) => {
      return <Pad key={i}
                  pad={pad}
                  handleDisplay={this.handleDisplay}
                  power={this.state.power}
                  volume={this.state.volume}
                  style={colorStyle}
               />
      });
     
     return (
      <div className="container">
        <div className="machine">
          <div className="pads">
            {pads}
          </div>
          <ControlPanel volumeInput={this.state.volumeInput}
                        togglePower={this.togglePower}
                        changeVolume={this.changeVolume}
                        currentSound={this.state.currentSound}
                        power={this.state.power}
                        colorStyle={colorStyle}
          />  
      </div>
    </div>
    )
  }
}

export default App;
