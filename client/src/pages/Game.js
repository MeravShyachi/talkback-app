import "../style/game.css";
import { ToastContainer, toast } from "react-toastify";
import { gameToasts, errorGameToasts, toastOptions } from "../utils/toast";
import DiceBoard from "../components/game/DiceBoard";
import ButtonSelector from "../components/game/ButtonSelector";
import OpponentBid from "../components/game/OpponentBid.js";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import {useSocket} from "../context/SocketContext.js";
import { useNavigate, useLocation } from "react-router-dom";
import {getGameState, createGame, updateGameState, deleteGame} from "../api/gameApi.js";
import GameRulesButton from "../components/game/GameRulesButton.js";
import { setSessionAuthToken, removeSessionAuthToken } from "../utils/sessionToken.js";


const Game = () => {
    const location = useLocation(); // Get the current route
    const {currentUser, otherUser: opponent, room} = useAuth();
    const {socket, isConnected} = useSocket();
    const [numDice, setNumDice] = useState(5); // Start with 6 dice
    const [opponentNumDice, setOpponentNumDice] = useState(5);
    const [yourTurn, setYourTurn] = useState(true);
    const [opponentTimes, setOpponentTimes] = useState(null);
    const [opponentNumber, setOpponentNumber] = useState(null);
    const [diceArray, setDiceArray] = useState(Array(numDice).fill(1)); // Default dice state
    const [rolling, setRolling] = useState(false);
    const [opponentRollDice, setOpponentRollDice] = useState(false);
    const [gameStarted, setGameStarted] = useState(null); // Track if game has started
    const [showGameOverPopup, setShowGameOverPopup] = useState(null);
    const [isWaiting, setIsWaiting] = useState(null);
    const [turnTimer, setTurnTimer] = useState(40);
    const navigate = useNavigate(); 
    
    const handleNavigate = () => {
        if(location.pathname === "/chat/game"){
            navigate(`/chat?room=${room}`); 
        } else {
            navigate("/home");
        }
    }

    // Handle leaving the game page
    useEffect(() => {
        const handleLeaveGame = async() => {
            if (socket && room) {
                if(location.pathname !== "/chat/game"){
                    socket.emit("leave room", {room, username: currentUser.username});
                }
                socket.emit("leave game", {room});
                await deleteGame(room, currentUser._id);
            }
        };
    
        window.addEventListener("leaveGame", handleLeaveGame);
    
        return () => {
            window.removeEventListener("leaveGame", handleLeaveGame);
        };
    }, [socket, room, currentUser]);

    // Handle login/logout across tabs
    useEffect(() => {
        const handleLoginLogout = (event) => {
            if (event.key === "logout") {
                const logoutData = JSON.parse(event.newValue);
                if (currentUser?._id === logoutData.userId) {
                    toast.error("You've been logged out. Please log in again.", toastOptions);
                    window.dispatchEvent(new Event("leaveGame"));
                    
                    setTimeout(() => {
                        window.dispatchEvent(new Event("leaveGame"));
                        removeSessionAuthToken();

                        if(location.pathname === "/chat/game"){
                            window.close();
                        } else {
                            navigate("/");
                        }
                    }, 4000);}
            }
            if (event.key === "login") {
                const loginData = JSON.parse(event.newValue);
                if (currentUser?._id === loginData.userId) {
                    setSessionAuthToken(loginData.token, loginData.userId);
                    toast.info("You've been logged in.", toastOptions)
                }
            }
        };

        window.addEventListener("storage", handleLoginLogout);
        return () => window.removeEventListener("storage", handleLoginLogout);
    }, [currentUser]);

    // Set starter or fetch game data from DB when first render 
    useEffect(() => {
        const starter = room.split(" ")[0];
        const fetchGameState = async() => {
            const response = await getGameState(room, currentUser._id);
            if (response?.error) {
                // Show user a toast if an error occurs
                handleServerError(response.error);
                return; // Stop execution
            }

            if(response?.notExists){
                if(currentUser._id !== starter){
                    setYourTurn(false);
                    toast.info(`${opponent.username} will start`, gameToasts);
                } else {
                    toast.info(`You'r turn`, gameToasts);
                }
                return;
            }

            setNumDice(response.numDice);
            setOpponentNumDice(response.opponentNumDice);
            setYourTurn(response.yourTurn);
            setOpponentTimes(response.opponentTimes);
            setOpponentNumber(response.opponentNumber);
            setDiceArray(response.diceArray);
            setGameStarted(response.gameStarted);
            setTurnTimer(response.turnTimer);
            setShowGameOverPopup(response.showGameOverPopup);
            setIsWaiting(response.isWaiting);
        }

        fetchGameState();
    },[])

    // Manage timer for turn
    useEffect(() => {
        let timer;
        let exitTimeout;

        const saveTimerToDB = async (newTime) => {
            const updatedData = { player: currentUser._id ,turnTimer: newTime };
            const res = await updateGameState(room, updatedData); // 🔥 Save timer to DB
            if(res?.error){
                handleServerError(res.error);
            }
        };
        
        if (yourTurn && gameStarted && !showGameOverPopup && !isWaiting) {
            timer = setInterval(() => {
                setTurnTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timer); // Stop the timer
                        socket.emit("turn timeout", { room, userId: currentUser._id });
                        setShowGameOverPopup("Time's up! You lost.");
                        setYourTurn(false);
                        return 0; // Set timer to 0
                    }
                    saveTimerToDB(prev - 1);
                    return prev - 1;
                });
            }, 1000); // Update every second
        }

        if (showGameOverPopup || !gameStarted) {
            // Wait 30 seconds for a response
            exitTimeout = setTimeout(() => {
                setShowGameOverPopup(false);
                setIsWaiting("No response... Leaving the game.");
                socket.emit("leave room", {room, username: currentUser.username});
                socket.emit("leave game", {room});
                setTimeout(() => handleNavigate(), 3000); // Redirect after 3s
            }, 30000); // 30s timeout
        }
    
        return () => {
            clearInterval(timer); // Cleanup timer
            clearTimeout(exitTimeout); // Cleanup if popup closes
        }
    }, [yourTurn, gameStarted, showGameOverPopup, turnTimer]);

    // Reset opponent's times and number when game start again
    useEffect(() => {

        const updateGameStartedToDB = async() => {

            const res = await updateGameState(room, {
                player: currentUser._id,
                gameStarted: false,
                turnTimer: 40,
                opponentNumber: null,
                opponentTimes: null
            })

            if(res?.error){
                handleServerError(res.error);
                return;
            }
            
            setOpponentNumber(null);
            setOpponentTimes(null);
        }

        if(gameStarted === false){
            updateGameStartedToDB();
        }


    },[gameStarted])

    // Let the user know when its his turn
    useEffect(() => {
        const updateYourTurnToDB = async() => {
            const res = await updateGameState(room, {player: currentUser._id, yourTurn});
            if(res?.error){
                handleServerError(res.error);
                return;
            } else {
                return res;
            }
        }

        if(gameStarted !== null){
            const res = updateYourTurnToDB();
            if(res && yourTurn){
                toast.info(`You'r turn`, gameToasts);
            }
        }
    },[yourTurn])

    useEffect(() => {
        const updateNumDiceToDB = async() => {
            const newArray = Array(numDice).fill(1);
            const response = await updateGameState(room, { player: currentUser._id, numDice})
            if(response?.error){
                handleServerError(response.error);
                return;
            }

            if(!gameStarted){
                setDiceArray(newArray);
                const res = await updateGameState(room, {player: currentUser._id, diceArray: newArray});
                if(res?.error){
                    handleServerError(res.error);
                }
                console.log("diceArray changed, updating in DB:", newArray);

            }
        }

        if(0 < numDice && numDice < 5){
            updateNumDiceToDB();
            socket.emit("opponent number of dice", { room, opponentNumDice: numDice });
        }

    },[numDice]);

    useEffect(() => {
        const updatePopupDataToDB = async(updatedData) => {
            const res = await updateGameState(room, updatedData)

            if(res?.error){
                handleServerError(res.error);
                return;
            }
            console.log("data saved successfull.");

        }
        
        if(isWaiting){
            updatePopupDataToDB({player: currentUser._id, isWaiting});
        }

        if(showGameOverPopup !== null){
            updatePopupDataToDB({player: currentUser._id, showGameOverPopup});
        }

    },[isWaiting, showGameOverPopup]);

    useEffect(()=>{
        if (!socket || !isConnected) return; 

        socket.emit("join game", ({roomId: room, sender: currentUser}));

        socket.on("roll dice", ()=> {

            setOpponentRollDice(true);

            setTimeout(() => {
                setOpponentRollDice(false);
            }, 1000)
        })

        socket.on("turn timeout", ({ loserId }) => {
            if (loserId !== currentUser._id) {
                setYourTurn(true);
                setShowGameOverPopup(`${opponent.username} didn't play for 40 seconds. You win!`);
            }
        });

        socket.on("opponent left", async({msg}) => {
            setShowGameOverPopup(false);
            setIsWaiting(msg);
            socket.emit("leave room", {room, username: currentUser.username});
            await deleteGame(room, currentUser._id);
            setTimeout(() => handleNavigate(), 3000); // Exit after 3s
        });

        socket.on("opponent choice", async ({selectedTimes, selectedNumber}) => {
            const res = await updateGameState(room, {
                player: currentUser._id, 
                opponentTimes: selectedTimes, 
                opponentNumber: selectedNumber 
            });
            if(res?.error){
                handleServerError(res.error);
                return;
            }
            setOpponentNumber(selectedNumber);
            setOpponentTimes(selectedTimes);
        })

        socket.on("turn ended", ()=>{
            setYourTurn(prevTurn => !prevTurn);
            setTurnTimer(40);
        })

        socket.on("you lost", ({typeOfLost}) => {
            toast.error(`${typeOfLost} button bressed!\nYou lost..`, errorGameToasts);
            handleLost(typeOfLost)
        });

        socket.on("you won", async({typeOfLost}) => {
            toast.info(`${typeOfLost} button bressed!\nYou won!`, errorGameToasts);
            setYourTurn(false);
            setTurnTimer(40);
            const res = await updateGameState(room, {player: currentUser._id, gameStarted: false});
            if(res?.error){
                handleServerError(res.error);
                return;
            }
            setGameStarted(false);

        });

        socket.on("game over", () => {
            setShowGameOverPopup("You are the winner!!");
            setYourTurn(true);
        });

        socket.on("start new game", async() => {
            const res = await updateGameState(room, {
                player: currentUser._id,
                numDice: 5,
                opponentNumDice: 5,
                turnTimer: 40,
                diceArray: Array(5).fill(1),
                isWaiting: null,
                showGameOverPopup: null
            })
            if(res?.error){
                handleServerError(res.error);
                return;
            }
            resetGame(); // Restart game if both players agree

        });

        socket.on("player reconnected", () => {
            console.log(`Player ${opponent.username} rejoined the game!`);
            toast.info("Your opponent reconnected!", gameToasts);
        });

        return () => {
            socket.off("roll dice");
            socket.off("turn timeout");
            socket.off("opponent left");
            socket.off("opponent choice");
            socket.off("turn ended");
            socket.off("you lost");
            socket.off("you won");
            socket.off("game over");
            socket.off("quit game");
            socket.off("start new game");
            socket.off("player reconnected");
        }

    },[isConnected])

    // Handle Liar events
    useEffect(() => {

        // Function to count total occurrences of the target numbers
        const countTotalOccurrences = (arr, numbers) => {
            return arr.filter(value => numbers.includes(value)).length;
        };

        socket.on("liar", ({opponentDiceArray, times, num}) => { 

            const targetNumbers = [1, num]; 

            // Count occurrences in both arrays and sum them up
            const totalCount = countTotalOccurrences(opponentDiceArray, targetNumbers) + 
            countTotalOccurrences(diceArray, targetNumbers);

            if(times > totalCount){ //you lost
                handleLost("Liar");
                toast.error(`Liar button bressed!\nYou lost..`, errorGameToasts);
            } else { //you won
                socket.emit("set winner", {room, won: false, typeOfLost: "Liar"});
                setYourTurn(false);
                setGameStarted(false);
            }
        
        })

        socket.on("exact", ({opponentDiceArray, times, num}) => { 

            const targetNumbers = [1, num]; 

            // Count occurrences in both arrays and sum them up
            const totalCount = countTotalOccurrences(opponentDiceArray, targetNumbers) + 
            countTotalOccurrences(diceArray, targetNumbers);
            
            if(times === totalCount){ //you lost
                handleLost("Exact");
                toast.error(`Exact button pressed!\nYou lost..`, errorGameToasts);
            } else { //you won
                socket.emit("set winner", {room, won: false, typeOfLost: "Exact"});
                setYourTurn(false);
                setGameStarted(false);
                setTurnTimer(40);
            }
        
        })

        socket.on("opponent number of dice", async({num}) => {
            const res = await updateGameState(room, {
                player: currentUser._id, 
                opponentNumDice: num 
            });
            if(res?.error){
                handleServerError(res.error);
                return;
            }
            setOpponentNumDice(num);

        })

        return () => {
            socket.off("liar");
            socket.off("exact");
            socket.off("opponent number of dice");
        }
    },[diceArray, opponentNumber, opponentTimes])


    const handleLost = async(typeOfLost) => {
        setNumDice(prev => {
            if(prev > 1){
                setGameStarted(false);
                setYourTurn(true);
                setTurnTimer(40);
                socket.emit("set winner", { room, won: true, typeOfLost});
                return prev-1;
            } else {
                setYourTurn(false);
                setShowGameOverPopup("You lost this time..");
                socket.emit("game over", { room });
            }

        })
    }

    const rollDice = async() => {
        if (!socket || !isConnected) {
            console.error("Socket is not connected! Cannot roll dice.");
            return;
        }
        if (rolling) return; // Prevent spamming the roll button

        const newDiceArray = diceArray.map(() => Math.floor(Math.random() * 6) + 1);

        // Call API to create a game entry in the database
        const response = await createGame(room, currentUser._id, yourTurn, newDiceArray);

        if (response?.error) {
            // Show user a toast if an error occurs
            handleServerError(response.error);
            return; // Stop execution
        }

        // Update UI after a successful game creation
        socket.emit("roll dice", {room});
        setRolling(true);
        setTimeout(() => {
            setDiceArray(newDiceArray);
            setRolling(false);
            setGameStarted(true);
        }, 1000); 

    };

    const handlePlayAgain = async(response) => {
        if(response === "no"){
            socket.emit("quit game", {room, username: opponent.username})
            socket.emit("leave room", {room, username: currentUser.username});
            await deleteGame(room, currentUser._id);
            handleNavigate();
        } else {
            setIsWaiting(`Waiting for ${opponent.username} to answer...`);
            setShowGameOverPopup(false);
            socket.emit("play again", {room, userId: currentUser._id})
        }
    }

    const handleServerError = (error) => {
        toast.error(error, errorGameToasts)

        setTimeout(() => {
            window.dispatchEvent(new Event("leaveGame"));
            handleNavigate();
        }, 4000);
    }

    const resetGame = () => {
        setNumDice(5);
        setOpponentNumDice(5)
        setOpponentTimes(null);
        setOpponentNumber(null);
        setDiceArray(Array(5).fill(1));
        setGameStarted(false);
        setTurnTimer(40);
        setShowGameOverPopup(false);
        setIsWaiting(null);
    };
    
    return ( 
        <div>
            <GameRulesButton />
            {showGameOverPopup && showGameOverPopup !== "false" && (
                <div className="game-over-popup">
                    <h3>{showGameOverPopup}</h3>
                    <p>Do you want to play again?</p>
                    <button onClick={() => handlePlayAgain("yes")}>Yes</button>
                    <button onClick={() => handlePlayAgain("no")}>No</button>
                </div>
            )}
            {isWaiting && (
                <div className="game-over-popup">
                    <p>{isWaiting}</p>
                </div>
            )}
            {!gameStarted && !isWaiting && !showGameOverPopup &&(
                <div className="start-game-popup">
                    <p>Press Start to roll the dice</p>
                    <button onClick={rollDice} disabled={rolling}>
                        {rolling ? "Rolling..." : "Start"}
                    </button>
                </div>
            )}
            {opponentTimes && 
                <OpponentBid 
                socket={socket} 
                room={room}
                opponent={opponent}                 
                opponentTimes={opponentTimes} 
                opponentNumber={opponentNumber}
            />
            }
            <DiceBoard 
                diceArray={diceArray} 
                rolling={rolling} 
                opponentNumDice={opponentNumDice} 
                opponentRollDice={opponentRollDice} 
            />
            <ButtonSelector 
                socket={socket} 
                room={room} 
                yourTurn={yourTurn} 
                opponentTimes={opponentTimes} 
                opponentNumber={opponentNumber}
                diceArray={diceArray}
                numDice={numDice}
                opponentNumDice={opponentNumDice}
            />
            {yourTurn && gameStarted && (
                <div className="timer">
                    <p>Time left: {turnTimer}s</p>
                </div>
            )}    
            <ToastContainer />        
        </div>
     );
}
 
export default Game;