// let increBox1 = document.getElementById("spot1")
// let increBox2 = document.getElementById("spot2")
// let increBox3 = document.getElementById("spot3")
// let increBox4 = document.getElementById("spot4")
// let increBox5 = document.getElementById("spot5")
// let increBox6 = document.getElementById("spot6")

let valueIncrement1 = document.getElementById("index1")
let valueIncrement2 = document.getElementById("index2")
let leads = document.getElementById("leads")

let homeScore = 12
let guestScore = 5

function increment(valueHome, value){
    if (valueHome === "HOME"){
        homeScore += value
        valueIncrement1.textContent = homeScore
    }
     if (valueHome === "GUEST"){
        guestScore += value
        valueIncrement2.textContent = guestScore
    }
   
}

function reset(){
    homeScore = 0
    guestScore = 0
    valueIncrement1.textContent = homeScore
    valueIncrement2.textContent = guestScore 
}

function whoLeads(){
    if (homeScore>guestScore){
        leads.textContent = "Home leads"
    }
    else{
        leads.textContent = "guest leads"
    }
}