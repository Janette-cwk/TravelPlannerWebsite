jQuery(document).ready(function(){
    "use strict";
    //Manage the carousel slider
    $('#slider-carousel').carouFredSel({
        responsive:true,
        width:'100%',
        circular:true,
        scroll:{
            items:1,
            duration: 500, 
            pauseOnHover : true
        },
        auto:true,
        items:{
            visible:{
                min:1,
                max:1,
            },
            //height: "variable"
        },
        pagination:{
            container:".sliderpager",
            pageAnchorBuilder:false
        }
    });
    //Manage the header when scrolling
    //'secondary' class in javascript
    $(window).scroll(function () {
        let top = $(window).scrollTop();
        if (top >= 60) {
            $("header").addClass('secondary');
        } else
            if ($("header").hasClass('secondary')) {
                $("header").removeClass('secondary');
            }
    });
});

let btnGenerate = document.getElementById("btn-generate");
let container = document.getElementById("result");
let btnRow = document.getElementById('btn-row');
let budget_box = document.getElementById('budget');
let result_block = document.createElement('div');
//Declare state object
let state = [];

//When the button "generate" is clicked, fetch the data and call renderHTML to display result
btnGenerate.addEventListener("click", function () {
    fetch("https://janette-cwk.github.io/json/travel_data.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (travel_data) {
            renderHTML(travel_data);
        })

        $(btnGenerate).attr('disabled', true);
    
});


//Render the result according to users' selections
function renderHTML(data) {
    let purpose = $(".purpose-radio:checked").val();
    let flightDuration = $(".flight-radio:checked").val();
    let budget = document.getElementById('budget').value;
    let start_date = new Date($('#start').val());
    let month = start_date.getMonth();
    let weather = document.getElementById('weather-slider').value;
    let match = false;

    createDisplayFrame();
    createClearBtn();
    ensureInput(budget);


    //Create title and sub_heading on result block
    let h2 = document.createElement('h2');
    h2.innerText = "Below is what we recommend according to your travel preferences:"
    h2.style.textAlign = "center";
    h2.style.marginTop = "0px";
    let sub_heading = document.createElement('div');
    sub_heading.classList = "sub-heading";
    sub_heading.innerText = "Click ` CLEAR RESULT ` if you would like to adjust your selections and get a new recommendation list";
    sub_heading.style.marginTop = "20px";
    sub_heading.style.textAlign = "center";
    result_block.appendChild(h2);
    result_block.appendChild(sub_heading);

    //loop through the json data and search for data that match the user inputs
    for (let i = 0; i < data.length; i++) {
        if (purpose == data[i].purpose && data[i].flightDuration < flightDuration && data[i].month == month &&
            budget > data[i].budget && parseInt(weather) + 3 > data[i].weather && data[i].weather > parseInt(weather) - 3) {
            state.push(data[i].city);
            let p = document.createElement('p');
            let h3 = document.createElement('h3');
            let displayCity = "\n" + data[i].city;
            let msg = "\n" + "The flight duration is " + data[i].flightDuration + " hours." + "\n" +
                "The average daily cost is $" + data[i].budget + " USD." + "\n" +
                "The average temperature of the month you selected is " + data[i].weather + " °C.";
            //Create elements to display data
            h3.innerText = displayCity;
            h3.style.textAlign = "center";
            h3.style.fontWeight = "bold";
            h3.style.fontFamily = "Arial, Helvetica, sans-serif";
            h3.style.textDecoration = "underline"
            p.innerText = msg;
            p.style.fontSize = "20px";
            p.style.textAlign = "center";
            result_block.appendChild(h3);
            result_block.appendChild(p);
            match = true;
        }
    }
    //ensureMatch(); //Doesn't work
    if (match != true) {
        createNoMatchWarning();
    }
    
    //track all the destinations that the system has generated
    let record = document.createElement('div');
    record.innerText = "\n" + "The destination that we have recommended so far: " + JSON.stringify(state);
    record.style.fontSize = "20px";
    record.style.textAlign = "center";
    record.style.color = "#f29898";
    result_block.appendChild(record)

}

//Create a frame to display the result inside <div id="result">
function createDisplayFrame() {
    result_block.classList = "result-block";
    result_block.style.backgroundColor = "snow";
    result_block.style.borderRadius = "4px";
    result_block.style.margin = "50px 50px 0px";
    result_block.style.padding = "70px 35px 40px";
    result_block.style.height = "1750px"
    container.appendChild(result_block);
}

//Create a Clear Result button that will delete the result block and the Restart button
function createClearBtn() {
    let btnRestart = document.createElement('a');
    btnRestart.text = "CLEAR RESULT";
    btnRestart.style.float = "right";
    btnRestart.style.marginTop = "20px";
    btnRestart.style.marginRight = "20px";
    btnRestart.style.padding = "6px 12px";
    btnRestart.style.paddingBottom = "20px";
    btnRestart.style.color = "black";
    btnRestart.style.background = "#f29898";
    btnRestart.style.width = "200px";
    btnRestart.style.height = "34px";
    btnRestart.style.borderRadius = "4px";
    btnRestart.style.textAlign = "center";
    btnRestart.style.border = "1px solid transparent";
    btnRestart.style.cursor = "pointer";
    btnRestart.style.textDecoration = "none";
    btnRow.appendChild(btnRestart);

    btnRestart.addEventListener("click", function () {
        //delete result frame, delete btnRestart, enable btnGenerate, clear budget input
        result_block.innerText = " ";
        container.removeChild(result_block);
        btnRow.removeChild(btnRestart)
        $(btnGenerate).attr('disabled', false);
        budget_box.value = " ";
    });
}

//Make sure the users are inputting in every fields, otherwise, display a warning
function ensureInput(budget) {
    if (budget.length === 0) {
        let warning = document.createElement('div');
        warning.classList = "alert alert-danger";
        warning.role = "alert";
        warning.innerText = "Oh snap!";
        let link = document.createElement('a');
        link.href = "#";
        link.classList = "alert-link";
        link.innerText = " Please enter all fields to generate the recommendation list! Click ` CLEAR RESULT ` and start over!";
        result_block.appendChild(warning);
        warning.appendChild(link);
    }
}

//When there is no matching result, display a no match found statement and guide the users of what should they do
function createNoMatchWarning() {
    let noMatch = document.createElement('h4');
    noMatch.innerText = "< Sorry! No match found! Please Click ` CLEAR RESULT ` and adjust your selection! >";
    noMatch.style.color = "red";
    noMatch.style.textAlign = "center";
    result_block.appendChild(noMatch);
}

