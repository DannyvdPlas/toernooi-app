import './App.css';
import arrayShuffle from 'array-shuffle';
import { SingleEliminationBracket, Match, SVGViewer, createTheme} from '@g-loot/react-tournament-brackets';

function App() {
  
  var deelnemersArr = [
    {naam: "A1", groep: "A", positie: 1},
    {naam: "A2", groep: "A", positie: 2},
    {naam: "B1", groep: "B", positie: 1},
    {naam: "B2", groep: "B", positie: 2},
    {naam: "C1", groep: "C", positie: 1},
    {naam: "C2", groep: "C", positie: 2},
    {naam: "D1", groep: "D", positie: 1},
    {naam: "D2", groep: "D", positie: 2},
    {naam: "E1", groep: "E", positie: 1},
    {naam: "E2", groep: "E", positie: 2},
    {naam: "F1", groep: "F", positie: 1},
    {naam: "F2", groep: "F", positie: 2},
    {naam: "G1", groep: "G", positie: 1},
    {naam: "G2", groep: "G", positie: 2},
    {naam: "H1", groep: "H", positie: 1},
    {naam: "H2", groep: "H", positie: 2},
  ];

  var deelnemersAantal = deelnemersArr.length;

  /* ---------------------------
  Bracket maken op aantal deelnemers
  --------------------------- */

  var bracketArr = [];

  for (var i = 1; i < deelnemersAantal * 2; i = i * 2) {
    if (!bracketArr.length) {
      bracketArr.push(i);
    }
    else {
      var tempArr = [];

      bracketArr.map((e) => {
        tempArr.push(e);
        tempArr.push(i + 1 - e);
      });

      bracketArr = tempArr;
    }
  }

  /* ---------------------------
  Deelnemers indelen op eindstanden
  --------------------------- */

  /* 
  1. Maak twee arrays met nummers 1 en 2
  2. Randomize de array van de nummers 2 en splits het op
  3. Van de twee afgesplitste groepen moeten de nummers 1 ook
     ook in een zelfde groep worden opgesplitst en
     randomize deze groepen.
  4. Als de groep met nummers 1 groter is dan de nummers 2,
     dan moeten de overgebleven nummers 1 verdeeld worden over
     de opgesplitste groepen
  5. Voeg de groepen nummers 1 en 2 van bovenkant bij elkaar.
     Doe hetzelfde voor de onderkant.
  */


  // 1.
  var nr1Arr = [];
  var nr2Arr = [];

  deelnemersArr.map((deelnemer) => {
    if (deelnemer.positie == 1) {
      nr1Arr.push(deelnemer);
    } else if (deelnemer.positie == 2) {
      nr2Arr.push(deelnemer);
    }
  });

  // 2.
  nr1Arr = arrayShuffle(nr1Arr);
  nr2Arr = arrayShuffle(nr2Arr);

  const half = Math.ceil(nr2Arr.length / 2);
  var nr2ArrBoven = nr2Arr.slice(0, half);
  var nr2ArrBeneden = nr2Arr.slice(half);

  // 3 & 4
  var nr1ArrBoven = [];
  var nr1ArrBeneden = [];
  var nr1ArrLeftovers = [];

  nr1Arr.map((deelnemerNr1) => {
    var leftover = true;
    
    nr2ArrBoven.map((deelnemerNr2Boven) => {
      if (deelnemerNr1.groep == deelnemerNr2Boven.groep) {
        nr1ArrBeneden.push(deelnemerNr1);
        leftover = false;
      }
    });

    nr2ArrBeneden.map((deelnemerNr2Beneden) => {
      if (deelnemerNr1.groep == deelnemerNr2Beneden.groep) {
        nr1ArrBoven.push(deelnemerNr1);
        leftover = false;
      }
    });

    if (leftover == true) {
      nr1ArrLeftovers.push(deelnemerNr1);
    }
  });

  // 4.
  nr1ArrLeftovers.map((deelnemerNr1Leftover, index) => {
    if(index % 2 == 0) {
      nr1ArrBoven.push(deelnemerNr1Leftover);
    }
    else {
      nr1ArrBeneden.push(deelnemerNr1Leftover);
    }
  });

  nr1ArrBoven = arrayShuffle(nr1ArrBoven);
  nr1ArrBeneden = arrayShuffle(nr1ArrBeneden);

  // 5.
  var bovenArr = [].concat(nr1ArrBoven, nr2ArrBoven);
  var benedenArr = [].concat(nr1ArrBeneden, nr2ArrBeneden);

  /* ---------------------------
  Bracket invullen met deelnemers en byes
  --------------------------- */

  /*
  1. Splits de bracket op
  2. Maak twee nieuwe arrays met de lengte van de helft van de bracket.
     Alle items in de arrays moeten een bye string krijgen.
  3. Map door de bovenkant array heen. Voor elke gemapte deelnemer moet
     het laagste getal gevonden worden in de bovenste helft van het
     bracket. De index van dit getal moet gebruikt worden om de
     gemapte deelnemer in te vullen op de index van de nieuwe array.
  4. Doe stap 3 nu ook voor benedenkant
  5. Voeg de boven en benedenkant samen
  */

  // 1.
  const halfBracket = Math.ceil(bracketArr.length / 2);
  
  var bracketBovenArr = bracketArr.slice(0, halfBracket);
  var bracketBenedenArr = bracketArr.slice(halfBracket);

  // 2.
  var filledBracketBovenArr = new Array(halfBracket).fill("bye");
  var filledBracketBenedenArr = new Array(halfBracket).fill("bye");
  
  // 3 & 4
  filledBracketBovenArr = fillBracket(bovenArr, bracketBovenArr, filledBracketBovenArr);
  filledBracketBenedenArr = fillBracket(benedenArr, bracketBenedenArr, filledBracketBenedenArr);

  // 5.
  var filledBracket = [].concat(filledBracketBovenArr, filledBracketBenedenArr);

  console.log(filledBracket);

  const listItems = filledBracket.map((deelnemer) => {
    if (deelnemer == "bye") {
      return <li>BYE</li>;
    } else {
      return <li>{deelnemer.naam}</li>
    }
  });

  var matchItems = [];

  for(i = 0; i < filledBracket.length; i = i + 2) {
    
    var matchItem = {
      id: "1_" + (i / 2 + 1),
      name: "Schrijver",
      nextMatchId: "2_" + Math.ceil((i / 2 + 1) / 2),
      tournamentRoundText: 1,
      state: "SCHEDULED",
      participants: [
        {
          id: i,
          resultText: null,
          isWinner: false,
          status: null,
          name: filledBracket[i].naam
        },
        {
          id: i + 1,
          resultText: null,
          isWinner: false,
          status: null,
          name: filledBracket[i + 1].naam
        }
      ]
    }
    matchItems.push(matchItem);
  }

  fillFullBracketWithMatches(matchItems)

  // return (
  //   <div className="App">
  //     {listItems}
  //   </div>
  // );

  console.log(matchItems);

  const WhiteTheme = createTheme({
    textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
    matchBackground: { wonColor: '#daebf9', lostColor: '#96c6da' },
    score: {
      background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
      text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
    },
    border: {
      color: '#CED1F2',
      highlightedColor: '#da96c6',
    },
    roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
    connectorColor: '#CED1F2',
    connectorColorHighlight: '#da96c6',
    svgBackground: '#FAFAFA',
  });

  return (
    <SingleEliminationBracket
      matches={matchItems}
      matchComponent={Match}
      theme={WhiteTheme}
      options={{
        style: {
          roundHeader: {
            backgroundColor: WhiteTheme.roundHeader.backgroundColor,
            fontColor: WhiteTheme.roundHeader.fontColor,
          },
          connectorColor: WhiteTheme.connectorColor,
          connectorColorHighlight: WhiteTheme.connectorColorHighlight,
        },
      }}
      svgWrapper={({ children, ...props}) => (
        <SVGViewer width={1920} height={1000} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  );
}

function fillBracket(arr, bracketArr, filledBracketArr) {
  var lowest = 0;
  arr.map((deelnemerArr) => {
    var lowestSeed = Math.max(...bracketArr);
    bracketArr.map((seed) => {
      if (seed > lowest && seed < lowestSeed) {
        lowestSeed = seed;
      }
    });
    
    var index = bracketArr.findIndex(value => value == lowestSeed);
    filledBracketArr[index] = deelnemerArr;

    lowest = lowestSeed;
  });

  return filledBracketArr;
}

function fillFullBracketWithMatches(matchList) {

  var newMatchList = matchList;

  var roundCounter = 2;

  for (var matchesAmount = matchList.length; matchesAmount > 1; matchesAmount =  matchesAmount / 2) {

    for (var i = 0; i < matchesAmount / 2; i++) {
      var matchItem = {
        id: roundCounter + "_" + (i + 1),
        name: "Schrijver",
        nextMatchId: (roundCounter + 1) + "_" + Math.ceil((i + 1) / 2),
        tournamentRoundText: roundCounter,
        state: "SCHEDULED",
        participants: []
      }

      if (matchesAmount == 2) {
        matchItem.nextMatchId = null;
      }

      newMatchList.push(matchItem);
    }

    roundCounter++;

  }

  console.log(newMatchList);
}

export default App;
