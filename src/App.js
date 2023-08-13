import "./App.css";
import { useEffect, useState } from "react";
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const colors=[ blueCandy,orangeCandy,purpleCandy,redCandy,yellowCandy,greenCandy];
const width=8;

function App(){
    const[currentColor,setcurrentColor]=useState([]);
    const[squareBeingDragged,setSquareBeingDragged]=useState(null);
    const[squareBeingReplaced,setSquareBeingReplaced]=useState(null)

    const createBoard=()=>{
        const randomColorArrangements=[];
        for(let i=0;i<width*width;i++){
            const randomColor=colors[Math.floor(Math.random()*colors.length)]
            randomColorArrangements.push(randomColor)
        }
        setcurrentColor(randomColorArrangements)
    }

    useEffect(()=>{
        createBoard();
    },[])

    const checkForColumnOfThree=()=>{
        for(let i=0;i<=47;i++){
            const columnOfThree=[i,i+width,i+width*2]
            const decidedColor=currentColor[i];
            if(columnOfThree.every(square=>currentColor[square]===decidedColor)){
                columnOfThree.forEach(square=>currentColor[square]=blank)
            }
        }
    }
    const checkForColumnOfFour=()=>{
        for(let i=0;i<=39;i++){
            const columnOfFour=[i,i+width,i+width*2,i+width*3]
            const decidedColor=currentColor[i];
            if(columnOfFour.every(square=>currentColor[square]===decidedColor)){
                columnOfFour.forEach(square=>currentColor[square]=blank)
            }
        }
    }
    const checkForRowOfThree=()=>{
        for(let i=0;i<64;i++){
            const RowOfThree=[i,i+1,i+2]
            const decidedColor=currentColor[i];
            const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]

            if(notValid.includes(i)) continue
            
            if(RowOfThree.every(square=>currentColor[square]===decidedColor)){
                RowOfThree.forEach(square=>currentColor[square]=blank)
            }
        }
    }
    const checkForRowOfFour=()=>{
        for(let i=0;i<64;i++){
            const RowOfFour=[i,i+1,i+2,i+3]
            const decidedColor=currentColor[i];
            const notValid=[5,6,713,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63]

            if(notValid.includes(i)) continue

            if(RowOfFour.every(square=>currentColor[square]===decidedColor)){
                RowOfFour.forEach(square=>currentColor[square]=blank)
            }
        }
    }
    const moveBelowSquare=()=>{
        for(let i=0;i<=64-width;i++){
            const firstRow=[0,1,2,3,4,5,6,7]

            const isFirstRow=firstRow.includes(i);
            if(isFirstRow && currentColor[i]===blank){
               const randomNumber=Math.floor(Math.random()*colors.length)
               currentColor[i]=colors[randomNumber]
            }
            if(currentColor[i+width]===blank){
                currentColor[i+width]=currentColor[i];
                currentColor[i]=blank;
            }
        }
    }

    useEffect(()=>{
        const timer=setInterval(()=>{
            moveBelowSquare()
            checkForColumnOfFour();
            checkForRowOfFour();
            checkForColumnOfThree();
            checkForRowOfThree();
            setcurrentColor([...currentColor])
        },100)
        return ()=>clearInterval(timer)
    },[checkForColumnOfFour,checkForRowOfFour,moveBelowSquare,checkForColumnOfThree,checkForRowOfThree,currentColor])

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }
    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target)
    }
    const dragEnd = () => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

        currentColor[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
        currentColor[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        const isAColumnOfFour = checkForColumnOfFour()
        const isARowOfFour = checkForRowOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfThree = checkForRowOfThree()

        if (squareBeingReplacedId &&
            validMove &&
            (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
        } else {
            currentColor[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            currentColor[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setcurrentColor([...currentColor])
        }
    }
    return(
        <div className="app">
            <div className="game">
            {currentColor.map((candyColor,index)=>{
                return(
                    <div key={index}>
                        <img 
                            src={candyColor} 
                            alt=""
                            data-id={index}
                            draggable="true"
                            onDragEnter={e=>e.preventDefault()}
                            onDragOver={e=>e.preventDefault()}
                            onDragLeave={e=>e.preventDefault()}
                            onDragStart={dragStart}
                            onDrop={dragDrop}
                            onDragEnd={dragEnd}
                        />
                    </div>
                )
            })}
            </div>
        </div>
    )
}
export default App;