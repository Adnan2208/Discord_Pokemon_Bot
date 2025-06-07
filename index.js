import { Client, GatewayIntentBits } from 'discord.js';
import "dotenv/config"


const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });


let PokemonName = null
let PokemonCalled = false
let Count = 0
let IntervalID = null
let Points = 0
let TotalPoints = 0
function CalcPoints(){
    if(Count <= 5){
        return Points = 30
    }
    else if (Count > 5 && Count <= 15){
        return Points = 20
    }
    else if (Count > 15 && Count <=30){
        return Points = 10
    }
    else{
        return Points = 5
    }
}

async function pokemonFetching() {
    Count = 0
    IntervalID = setInterval(() => {
        Count +=1 
    },1000)

    return await fetch(`https://pokeapi.co/api/v2/pokemon/${Math.ceil(Math.random()*100)}`)
    .then((data) => data.json())
    .then((parsedData) => {
        PokemonName = parsedData.name.toUpperCase()
        PokemonCalled = true
        return (parsedData.sprites.front_default)
    })
}

client.on("messageCreate", async (message) =>{
    if(message.content == "pokemon" && !PokemonCalled){
        message.reply(await pokemonFetching())
    }

    if(message.content.toUpperCase() == PokemonName){
        PokemonCalled = false
        TotalPoints += CalcPoints()
        message.reply(`${message.author} caught ${PokemonName} in ${Count} seconds \n Points scored is: ${CalcPoints()} & your total points are ${TotalPoints}`)
        PokemonName = null
        clearInterval(IntervalID)
    }

    if(message.content == "skip" && PokemonCalled == true){
        clearInterval(IntervalID)
        message.reply(await pokemonFetching())
    }
})

client.login(process.env.DiscordBotKey)
