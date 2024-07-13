var cal1=0 
var cal2=0
var cal3=0
var cal4=0
var cal_w1=0
var cal5=0
var total = 0;

function Energy_Calulation(){
    cal1 = (parseFloat(document.getElementById("Input1").value)*0.815+parseFloat(document.getElementById("Input2").value)*1.612+parseFloat(document.getElementById("Input3").value)* 2.676+parseFloat(document.getElementById("Input4").value)*2.272).toFixed(3);
    //document.getElementById("output1").innerHTML= cal1;
    document.getElementById("concealE").value= cal1+" kg CO2";
}
function Travel_Calculation(){
    cal2 = (parseFloat(document.getElementById("input5").value)*0.170+parseFloat(document.getElementById("input6").value)*0.089+parseFloat(document.getElementById("input7").value)* 0.231+parseFloat(document.getElementById("input8").value)*0.170).toFixed(3);
    document.getElementById("concealT").value= cal2 +" kg CO2";
}
function Waste_Calculation() {
    
    if (document.getElementById("inputr1").checked) {
        cal3=0
    }
    if (document.getElementById("inputr2").checked) {
        cal3=1
    }
    if (document.getElementById("inputr3").checked) {
        cal4=0
    }
    if (document.getElementById("inputr4").checked) {
        cal4=1
    }
    cal_w1= cal3*184 +cal4*166 
    document.getElementById("concealW").value=cal_w1+" kg CO2";
}
function Diet_Calculator() {
    var a = document.getElementById("age");
    var age = a.options[a.selectedIndex].value;
    var b = document.getElementById("diet");
    var diet = b.options[b.selectedIndex].value;
    if (age=1){
        if(diet=1){cal5=255.5}
        else if(diet=2){cal5=219}
        else{cal5=365}
    }
    if(age=2){
        if(diet=1){cal5=803}
        else if(diet=2){cal5=693.5}
        else{cal5=1168}
    }
    if (age=3){
        if (diet=1){cal5=949}
        else if(diet=2){cal5=839.5}
        else{cal5=1460}
    }
    document.getElementById("concealD").value= cal5 +" kg CO2" ;
}

function compare(){
    total = document.getElementById("totals").innerHTML;
    
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Global Average", "India's Average" , "Your Footprints"],
        datasets: [
        { label: 'EMISSION',
            data: [4.73,1.95,total],
            backgroundColor :['rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
    ],

    borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
    borderWidth : 1
        }
        ]
    },
    options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}