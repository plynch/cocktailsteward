var React = require('react')
var ReactDOM = require('react-dom')
var R = require('ramda')
var recipes = require('./recipes')
require('./bootstrap/css/bootstrap.css')
require('./app.css')

class MainApp extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showPrompt: true,
      showResult: false,
      showList: false,
      chosenDrink: null,
      searchInput: '',
    }
  }

  handleSearchInput(event){
    if (event) event.preventDefault()
    this.setState({searchInput: event.currentTarget.value})
  }

  togglePanes(event){
    if (event) event.preventDefault()
    this.setState({showPrompt: !this.state.showPrompt,
                   showResult: !this.state.showResult})
  }

  pickDrink(event){
    if (event) event.preventDefault()
    let choices = this.getDrinkOptions();
    if (choices.length === 0) {
      this.chooseRandomDrink();
    } else {
      let rand = Math.floor((Math.random() * choices.length));
      let choice = choices[rand];
      this.setState({chosenDrink: choice});
    }
    this.togglePanes();
  }

  pickAnything(event){
    if (event) event.preventDefault()
    this.chooseRandomDrink();
    this.togglePanes();
  }

  reRoll(event){
    if (event) event.preventDefault()
    let choices = this.getDrinkOptions();
    let doneFlag = false;

    if (choices.length < 2) {
      this.chooseRandomDrink();
    } else {
      let oldDrink = this.state.chosenDrink;
      let counter = 0;
      while (doneFlag === false && counter < 3) {
        let rand = Math.floor((Math.random() * choices.length));
        let choice = choices[rand]
        if (choice !== oldDrink){
          this.setState({chosenDrink: choice});
          doneFlag = true;
        }

        counter++;
      }
      if (doneFlag === false) {
        this.chooseRandomDrink();
      }
    }
  }

  startOver(event){
    if (event) event.preventDefault()
    this.state.chosenDrink = null;
    this.togglePanes();
  }

  getDrinkOptions(){
    return R.filter(this.isAnOption.bind(this), recipes);
  }

  chooseRandomDrink(){
    let rand = Math.floor((Math.random() * recipes.length));
    let choice = recipes[rand]
    this.setState({chosenDrink: choice, searchInput: ''});
  }

  getDrinkName(drink){
    return drink.name
  }

  getIngredientList(drink){
    return drink.ingredients.map(this.getIngredientString).join(' ').toLowerCase();
  }

  getIngredientString(item) {
    if (item.special)    return item.special;
    if (item.label)      return item.label;
    if (item.ingredient) return item.ingredient;
    return '';
  }

  isAnOption(drink){
    if (this.state.searchInput === '') return true;
    return this.getIngredientList.call(this, drink)
             .indexOf(this.state.searchInput.toLowerCase()) !== -1;
  }

  render() {
    return (
        <div>
          <h1>Cocktail Steward</h1>
          {this.state.showPrompt
            ? <PromptMenu
                handleSearchInput={this.handleSearchInput.bind(this)}
                pickDrink={this.pickDrink.bind(this)}
                pickAnything={this.pickAnything.bind(this)}
              />
            : ''}

          {this.state.showResult
            ? <ResultPane
                startOver={this.startOver.bind(this)}
                reRoll={this.reRoll.bind(this)}
                getIngredientString={this.getIngredientString}
                chosenDrink={this.state.chosenDrink}/>
            : ''}

          {this.state.showList
            ? <div>
              <h3>Recipe List</h3>
              <ol>
              {recipes.map(x => <li key={x.name}>{x.name}</li>)}
              </ol>
              </div>
            : ''}
        </div>
    )
  }
}

class PromptMenu extends React.Component {
  componentDidMount(){
    ReactDOM.findDOMNode(this.refs.drinkInput).focus();
  }

  render() {
  return <div createClass='prompt'>
    <h3>🍸What do you want in your cocktail?🍸</h3>
    <form>
      <p><input id="ingredient_name"
        ref="drinkInput"
        placeholder="for example: Gin"
        onInput={this.props.handleSearchInput}></input></p>
      <p><button id ="pickChoice"
        onClick={this.props.pickDrink}
      >💯 😄    Yeah, I want something with that    😄 💯</button></p>
      <p><button id ="pickAnything"
        onClick={this.props.pickAnything}
      >😓    Even that's too much to think about    😓</button></p>
    </form>
    </div>
  }
}

class ResultPane extends React.Component {
  componentDidMount(){
    ReactDOM.findDOMNode(this.refs.reRoll).focus();
  }

  makeListItem(str) {
    return <li key={str}>{str.toLowerCase()}</li>
  }

  render() {
    return <div createClass='result'>
      <div id="answer">
        <h5>You should order a</h5>
        <h3>{this.props.chosenDrink.name}</h3>
      </div>
      <ul id="ingredients">
        { R.map( R.compose( this.makeListItem, this.props.getIngredientString),
                            this.props.chosenDrink.ingredients)}
      </ul>
      <p><button id="reroll" ref="reRoll"
        onClick={this.props.reRoll}
      >🎲  Give me something else  🎲</button></p>
      <p><button id="startOver"
        onClick={this.props.startOver}
      >😓  Wait, let's just start over  😓</button></p>
    </div>
  }
}

ReactDOM.render(<MainApp />, document.getElementById('app'));
