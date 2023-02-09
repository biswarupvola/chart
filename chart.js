//web Chart JS code
class webCharts {
  constructor(canvas, data) {
    /****** 
     * let data1 = [1,2,3,4,5,6,7,8]
     * data = {
     *      xAxis:{
        *          label:["Jan","feb","mar","april","may","jun","jul","august"];
        *          data:[data1,data2]
     *          },
     *      yAxis:{}
     * }
     * ******/
    this.canvasId = canvas;
    this.lineColors = ["#F44336","#01579B","#311B92","#558B2F","#3F51B5","#9E9D24","#C2185B","#E53935","#4A148C","#FFC300"];
    this.data = data;
    this.canvas;
    this.ctx;
    this.canvasXstartPoint = 50;
    this.canvasYstartPoint = 50;
    this.canvasWidth;
    this.canvasHeight;
    this.canvasActualWidth;
    this.canvasActualHeight;
    this.coordinates = [];
    this.coordinatesWithAllData = [];
    this.sortableCoordinates = [];
    this.sortableCoordinatesNumber = [];
    this.positiveVal = [];
    this.negeTiveVal = [];
    this.coordinatedDivisionArr = [];
    this.allCoords = [];
    this.dataToDraw = [];
    this.captionArr = [];
    this.devider = 40;
    this.strokeThemeColor = "#000";
    this.captionHeight = 25;

    //calling Function
    this.init();
    this.createsCoordinates();
    this.calculateBasicGrids(this.coordinates);
   
    this.drawVerticalLine(this.data.xAxis.label,this.data.xAxis.data,this.data.yAxis.label);
    this.createCaptionArr()

    //draw lineGraph
    for(let i = 0; i< this.dataToDraw.length; i++){
        let lineColour = this.lineColors[Math.floor(Math.random() * 10)]
        this.drawLineGraph(this.dataToDraw[i],lineColour);
        this.drawCirClePoint(this.dataToDraw[i]);
    }
    setTimeout(()=>{
        this.ctx.save();
    },300)
   
    this.drawZeroLine() 
  }

  init(){
    try{
        this.canvas = document.getElementById(this.canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width - this.canvasXstartPoint;
        this.canvasHeight =  this.canvas.height - this.canvasYstartPoint;
        this.canvasActualWidth = this.canvas.width;
        this.canvasActualHeight =  this.canvas.height;
        this.mouseEvent();
    }catch(err){
        throw err;
    }
  }

  mouseEvent(){
    try{
        this.canvas.addEventListener("mousemove", (e) =>
        {
            this.getMousePosition(e);
        });
    }catch(err){
        throw err;
    }
    
  }

    getMousePosition(event) {
        let storeRect;
        let rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let xCaption,yCaption,xLabel,yLabel,value;
        for(let r = 0; r< this.captionArr.length; r++){
            let vertic = this.captionArr[r]['verticalCoordinates'];

            if(parseInt(vertic) -1 == parseInt(x) ){

                //this.canvas.style.cursor = "pointer";
                xCaption = parseInt(vertic);
                yCaption = this.captionArr[r]['actCoords']-this.captionHeight;
                xLabel = this.captionArr[r].xLabel;
                yLabel = this.data.yAxis.label;
                value = this.captionArr[r]['value'];
                this.drawCaption(xCaption,yCaption,xLabel,yLabel,value);

            }else if(parseInt(vertic) - 4 == parseInt(x) || parseInt(vertic) + 4 == parseInt(x)){
                //this.ctx.reset();
                //this.calculateBasicGrids(this.coordinates);
                //this.drawVerticalLine(this.data.xAxis.label,this.data.xAxis.data,this.data.yAxis.label);
                //this.createCaptionArr()
                // for(let i = 0; i< this.dataToDraw.length; i++){
                //     let lineColour = this.lineColors[Math.floor(Math.random() * 10)]
                //     this.drawLineGraph(this.dataToDraw[i],lineColour);
                //     this.drawCirClePoint(this.dataToDraw[i]);
                // }
                
            }
        }
    }

  createsCoordinates(){
    let data = this.coordinates.concat( ...  this.data.xAxis.data);
    data.forEach(elm =>{
        let tempData = {value:elm};
        this.coordinates.push(tempData);
    });
  }

  calculateBasicGrids(coordinates){

    this.sortableCoordinates = [...coordinates];
    this.sortableCoordinates = [...this.sortableCoordinates.sort( function ( a, b ) { return b.value - a.value; } )];
    this.sortableCoordinatesNumber = this.removeDuplicate(this.sortableCoordinates);
    
    this.positiveVal = [... this.posNegValStore(this.sortableCoordinatesNumber,"positive")];
    this.negeTiveVal = [... this.posNegValStore(this.sortableCoordinatesNumber,"negetive")];
    this.coordinatedDivisionArr = this.createCoordinatedDivision(this.sortableCoordinatesNumber,this.devider);
    this.allCoords = [];

    this.ctx.font = "12px Arial";

    this.drawXAxis();
    this.drawYAxis();

    //draw coordinate boxes
    let actCoords = this.canvasXstartPoint;
    let smallDevider = this.negeTiveVal.length > 0 ? (this.canvasHeight - this.canvasYstartPoint)/ (this.positiveVal[0] + Math.abs(this.negeTiveVal[this.negeTiveVal.length - 1]))
                        : (this.canvasHeight - this.canvasYstartPoint)/ (this.positiveVal[0]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#CFD8DC"; //"#00BCD4";
    let maxLen = this.negeTiveVal.length > 0 ? this.negeTiveVal[this.negeTiveVal.length - 1] : 0;
    
    for(let i = this.coordinatedDivisionArr[0]; i >= maxLen ; i--){
        this.ctx.moveTo(this.canvasYstartPoint,actCoords);
        this.allCoords.push({ yValue:i, actCoords:actCoords});
        this.coordinatedDivisionArr.forEach((elm,ind)=>{
            if(i == elm){
                this.ctx.lineTo(this.canvasActualWidth,actCoords);
                this.ctx.fillText(elm,0,actCoords+2);
            }
        });
        actCoords += smallDevider;
    }
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();
  }

  createCaptionArr(){
    console.log("this.captionArr",this.captionArr)
  }

  
  drawVerticalLine (label,data,yLabel){
    let verticalLine = (this.canvasWidth) / label.length;
    let yAxis = this.canvasYstartPoint;
    this.ctx.beginPath();
    for(let i = 0; i< label.length; i++){
        this.ctx.moveTo(yAxis,this.canvasYstartPoint);
        if(i > 0){
            this.ctx.lineTo(yAxis,this.canvasHeight);
        }
        this.ctx.lineWidth = 1;
        if(i == label.length -1){
            this.ctx.stroke();  
        }
        this.ctx.fillText(label[i], yAxis - 10,this.canvasActualHeight - 20);
        yAxis += verticalLine;
    }

    for(let f = 0; f< data.length; f++){
        let verticalCoordinates = this.canvasYstartPoint;
        let tempArr = [];
        for(let u = 0; u < data[f].length; u++){
            let tempData = {
                                value:data[f][u],
                                verticalCoordinates:verticalCoordinates,
                                xLabel:label[u],
                                yLabel:yLabel
                            }
            tempArr.push(tempData);
            this.captionArr.push(tempData)
            verticalCoordinates += verticalLine;
        }
        this.dataToDraw.push(tempArr);
    }
  }

  drawXAxis(){
    //X axis
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.moveTo(this.canvasXstartPoint,this.canvasHeight);
    this.ctx.lineTo(this.canvasActualWidth,this.canvasHeight);
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }
  drawYAxis(){
    // //Y axis
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.moveTo(this.canvasXstartPoint,this.canvasYstartPoint);
    this.ctx.lineTo(this.canvasXstartPoint,this.canvasHeight);
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawLineGraph(coordinates,lineColor){
    //stroke grapf line according to coordinates
    this.strokeThemeColor = lineColor;
    let x = this.canvasXstartPoint;
    let y;
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.strokeThemeColor;
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 2;
    for(let i = 0; i< coordinates.length; i++){
        this.allCoords.forEach((elm,ind)=>{
            if(elm.yValue == coordinates[i]['value']){
                if(i == 0){
                    this.ctx.moveTo(x,elm["actCoords"]);
                }
                y = elm["actCoords"];
            }
            coordinates[i]["actCoords"] = y
        });
        x = coordinates[i]['verticalCoordinates'];
        this.ctx.lineTo(x,y);
        this.ctx.lineTo(x,y);
        if(i == coordinates.length -1){
            this.ctx.stroke();
        }
    }
  }

  drawCirClePoint(coordinates){
    // Draw circle on each point
    let x = this.canvasXstartPoint;
    let y;
    for(let i = 0; i< coordinates.length; i++){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeThemeColor;
        this.ctx.fillStyle = this.strokeThemeColor;
        this.allCoords.forEach((elm,ind)=>{
            if(elm.yValue == coordinates[i]['value']){
                y = elm["actCoords"];
            }
        })
        x = coordinates[i]['verticalCoordinates'];
        this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
  }

  drawCaption(x,y,xLabels,yLabels,value){
    //ctx.globalAlpha = 0.5;
    //Draw captions
    let text = xLabels+":-"+yLabels+""+value;
    let textWidth = this.ctx.measureText(text).width + 20
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgb(33,33,33,0.7)";
    this.ctx.fillRect(x+2, y, textWidth, this.captionHeight);
    

    this.ctx.beginPath();
    this.ctx.fillStyle = this.strokeThemeColor;
    this.ctx.fillRect(x+5, y+7, 10, 10);
    this.ctx.fill();

    //text
    this.ctx.beginPath();
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(xLabels+":-"+yLabels+""+value, x+18,y+16);

  }

  drawZeroLine(){
     //Draw 0 line
     let x = this.canvasXstartPoint;
     let y;
     if(this.negeTiveVal.length > 0){
        this.ctx.beginPath();
        this.ctx.strokeStyle = "blue";
        this.allCoords.forEach((elm,ind)=>{
            if(elm.yValue == 0){
                this.ctx.moveTo(this.canvasXstartPoint,elm["actCoords"]);
                y = elm["actCoords"];
            }
        })
        this.ctx.lineTo(this.canvasActualWidth,y);
        this.ctx.setLineDash([5, 15]);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
  }

    removeDuplicate(obj){
        let newObj = [];
        obj.forEach((elm,ind)=>{
            if( newObj.indexOf(elm.value) < 0 ){
                newObj.push(elm.value)
            }
        });
        return newObj;
    }

    createCoordinatedDivision(coords,devider){
        let newObj = [];
        for(let i = coords[0]; i >= coords[coords.length - 1]; i -= devider){
            newObj.push(i)
        }
        if(newObj.indexOf(coords[coords.length - 1]) < 0){
            newObj.push(coords[coords.length - 1])
        }
        return newObj;
    }

    posNegValStore(arr,unit){
        let newObj = [];
        arr.forEach((elm) =>{
            if(unit == "positive"){
                if(elm > 0){
                    newObj.push(elm)
                }
            }else if(unit == "negetive"){
                if(elm < 0){
                    newObj.push(elm)
                }
            }
        })
        return newObj;
    }
}