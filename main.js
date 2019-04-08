document.getElementById("chart_canvas").width = 600;
document.getElementById("chart_canvas").height = 400;
let chartInputData = [];

trial();

function trial() {
    chartInputData.push(new PieChartSlice("dupa", 30, "blue"));
    chartInputData.push(new PieChartSlice("gunwo", 77, "red"));
    chartInputData.push(new PieChartSlice("giśka", 59, "pink"));
    console.log(chartInputData.map(a => a.name));
}


function PieChartSlice(name, value, color) {
    this.name = name;
    this.value = value;
    this.color = color;
}

// var chartInputData = {
//     "Classical music": 10,
//     "Alternative rock": 14,
//     "Pop": 2,
//     "Jazz": 12
// };

let Piechart = function (options) {
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.data.map(a => a.color);

    this.draw = function () {
        let total_value = 0;
       
        options.data.forEach(a => {
            total_value += a.value;
        });
        console.log(total_value);

        let start_angle = 0;
        let slice_angle = 0;

        options.data.forEach(a => {
            slice_angle = 2 * Math.PI * a.value / total_value;

            drawPieSlice(
                this.ctx, this.canvas.width/2, 
                this.canvas.height/2, 
                Math.min(this.canvas.width/2, this.canvas.height/2),
                start_angle, 
                start_angle + slice_angle, 
                a.color
            );

            start_angle += slice_angle;
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

        start_angle = 0;

        options.data.forEach(a => {

            let pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
            let labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
            let labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);

            if (this.options.doughnutHoleSize) {
                let offset = (pieRadius * this.options.doughnutHoleSize) / 2;
                labelX = this.canvas.width / 2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
                labelY = this.canvas.height / 2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);
            }

            let labelText = Math.round(100 * a.value / total_value);
            this.ctx.fillStyle = "black";
            this.ctx.font = "bold 20px Candara";
            this.ctx.fillText(a.name + "(" + a.value + ")", labelX, labelY);
            this.ctx.fillText(labelText + "%", labelX, (labelY + 25));
            start_angle += slice_angle;

        })

    }

}

let myPiechart = new Piechart(
    {
        canvas: document.getElementById("chart_canvas"),
        data: chartInputData,
        doughnutHoleSize: 0.5
    }
);
myPiechart.draw();


function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}