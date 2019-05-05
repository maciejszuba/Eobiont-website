const canvas = document.getElementById("chart_canvas")
canvas.width = 600;
canvas.height = 400;
let chartInputData = [];

function PieChartSlice(name, value, color) {
    this.name = name;
    this.value = value;
    this.color = color;
}

Piechart = function (options) {
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.data.map(a => a.color);

    this.draw = function () {
        let totalValue = 0;
       
        options.data.forEach(a => {
            totalValue += a.value;
        });

        let startAngle = 0;
        let sliceAngle = 0;

        options.data.forEach(a => {
            sliceAngle = 2 * Math.PI * a.value / totalValue;

            drawPieSlice(
                this.ctx, this.canvas.width/2, 
                this.canvas.height/2, 
                Math.min(this.canvas.width/2, this.canvas.height/2),
                startAngle, 
                startAngle + sliceAngle, 
                a.color
            );

            startAngle += sliceAngle;
        });

        //drawing a white circle over the chart
        //to create the doughnut chart
        
        if (this.options.doughnutHoleSize) {
            drawPieSlice(
                this.ctx,
                this.canvas.width / 2,
                this.canvas.height / 2,
                this.options.doughnutHoleSize * Math.min(this.canvas.width / 2, this.canvas.height / 2),
                0,
                2 * Math.PI,
                "white"
            );
        }

        startAngle = 0;

        options.data.forEach(a => {
            sliceAngle = 2 * Math.PI * a.value / totalValue;

            let pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
            let labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(startAngle + sliceAngle / 2);
            let labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(startAngle + sliceAngle / 2);

            if (this.options.doughnutHoleSize) {
                let offset = (pieRadius * this.options.doughnutHoleSize) / 2;
                labelX = this.canvas.width / 2 + (offset + pieRadius / 2) * Math.cos(startAngle + sliceAngle / 2);
                labelY = this.canvas.height / 2 + (offset + pieRadius / 2) * Math.sin(startAngle + sliceAngle / 2);
            }

            let  labelText = Math.round(10000 * a.value / totalValue)/100;
            this.ctx.fillStyle = "black";
            this.ctx.font = "bold 20px Candara";
            this.ctx.fillText(a.name + "(" + a.value + ")", labelX, labelY);
            this.ctx.fillText(labelText + "%", labelX, (labelY + 25));
            startAngle += sliceAngle;

        })

    }

}

let iteration = 0;

addInputFields();

function addInputFields(){

    let newInputDiv = document.createElement("div");
    let newNameInput = document.createElement("input");
    let newValueInput = document.createElement("input");
    let newColorSelection = document.createElement("select");
    let newSubmitInput = document.createElement("input");

    newInputDiv.setAttribute("id", "chart_input_"+iteration);
    newInputDiv.classList.add("chart_input");

    newNameInput.setAttribute("type", "text");
    newNameInput.setAttribute("name", "name");
    newNameInput.setAttribute("placeholder", "Category");

    newValueInput.setAttribute("type", "number");
    newValueInput.setAttribute("name", "value");
    newValueInput.setAttribute("placeholder", "Value");

    newColorSelection.setAttribute("name", "color");

    newSubmitInput.setAttribute("type", "submit");
    newSubmitInput.setAttribute("value", "Submit");
    newSubmitInput.setAttribute("onclick", "getDataForChart()");

    let colors = {
        "Red" : "red",
        "Yellow" : "yellow",
        "Blue" : "blue", 
        "Green" : "green",
        "Pink" : "pink",
        "Cyan" : "cyan",
        "Beige" : "beige",
        "Orange" : "orange"
    };

    for (color in colors) {
      
        let colorOption = document.createElement("option");
        colorOption.setAttribute("value", colors[color]);
        colorOption.innerHTML = color;

        newColorSelection.appendChild(colorOption);

    }
    
    document.getElementById("chart_input_fields").appendChild(newInputDiv);
    newInputDiv.appendChild(newNameInput);
    newInputDiv.appendChild(newValueInput);
    newInputDiv.appendChild(newColorSelection);
    newInputDiv.appendChild(newSubmitInput)
    iteration++;
}

function getDataForChart(){
    console.log(iteration);
    chartInputData.push(new PieChartSlice(document.getElementsByName("name")[iteration-1].value, 
                        parseInt(document.getElementsByName("value")[iteration-1].value), 
                        document.getElementsByName("color")[iteration-1].value));

    // iteration++;
    console.log(iteration);

    addInputFields();

    console.log(iteration);
    console.log(chartInputData);
    
}

function generateChart() {
    canvas.getContext("2d").clearRect(0,0,600,400);

    let myPiechart = new Piechart(
        {
            canvas: canvas,
            data: chartInputData,
            doughnutHoleSize: 0.5
        }
    );
    myPiechart.draw();
}

function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}