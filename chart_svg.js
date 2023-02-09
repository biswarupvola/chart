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
    //this.createCaptionArr();

    //draw lineGraph
    for(let i = 0; i< this.dataToDraw.length; i++){
        let lineColour = this.lineColors[Math.floor(Math.random() * 10)]
        this.drawLineGraph(this.dataToDraw[i],lineColour);
        this.drawCirClePoint(this.dataToDraw[i]);
    }
   
    // this.drawZeroLine() 
  }

  init(){
    try{
        this.canvas = document.getElementById(this.canvasId);
        
        this.canvasWidth = this.canvas.clientWidth - this.canvasXstartPoint;
        this.canvasHeight =  this.canvas.clientHeight - this.canvasYstartPoint;
        this.canvasActualWidth = this.canvas.clientWidth;
        this.canvasActualHeight =  this.canvas.clientHeight;

        this.canvas.innerHTML = `<svg width="${this.canvasActualWidth}" height="${this.canvasActualHeight}"></svg> `;
        //this.mouseEvent();
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

    this.drawXAxis();
    this.drawYAxis();

    //draw coordinate boxes
    let actCoords = this.canvasXstartPoint;
    let smallDevider = this.negeTiveVal.length > 0 ? (this.canvasHeight - this.canvasYstartPoint)/ (this.positiveVal[0] + Math.abs(this.negeTiveVal[this.negeTiveVal.length - 1]))
                        : (this.canvasHeight - this.canvasYstartPoint)/ (this.positiveVal[0]);

    let maxLen = this.negeTiveVal.length > 0 ? this.negeTiveVal[this.negeTiveVal.length - 1] : 0;
    
    for(let i = this.coordinatedDivisionArr[0]; i >= maxLen ; i--){
        
        this.allCoords.push({ yValue:i, actCoords:actCoords});
       
        this.coordinatedDivisionArr.forEach((elm,ind)=>{
            if(i == elm){
                this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                        <line x1="${this.canvasYstartPoint}" y1="${actCoords}" 
                                                x2="${this.canvasActualWidth}" 
                                                y2="${actCoords}" 
                                                style="stroke:#CFD8DC;stroke-width:1" 
                                        />`;
            }
        });
        actCoords += smallDevider;
    }
  }

  createCaptionArr(){
    console.log("this.captionArr",this.captionArr)
  }

  
  drawVerticalLine (label,data,yLabel){
    let verticalLine = (this.canvasWidth) / label.length;
    let yAxis = this.canvasYstartPoint;
    for(let i = 0; i< label.length; i++){
        if(i > 0){
            this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                                    <line x1="${yAxis}" y1="${this.canvasYstartPoint}" 
                                                        x2="${yAxis}" 
                                                        y2="${this.canvasHeight}" 
                                                        style="stroke:#CFD8DC;stroke-width:1" 
                                                    />`;
        }
        this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                            <text x="${yAxis - 5}" y="${this.canvasActualHeight - 20}">
                                            ${label[i]}
                                            </text>`;
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
    this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                            <line x1="${this.canvasXstartPoint}"
                                                 y1="${this.canvasHeight}" 
                                                 x2="${this.canvasActualWidth}" 
                                                 y2="${this.canvasHeight}" 
                                            style="stroke:#000000;stroke-width:1" />`;
  }
  drawYAxis(){
    this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                        <line x1="${this.canvasXstartPoint}"
                                            y1="${this.canvasYstartPoint}" 
                                            x2="${this.canvasXstartPoint}" 
                                            y2="${this.canvasHeight}" 
                                        style="stroke:#000000;stroke-width:1" />`;
  }

  drawLineGraph(coordinates,lineColor){
    //stroke grapf line according to coordinates
    this.strokeThemeColor = lineColor;
    let x1 = this.canvasXstartPoint;
    let x2;
    let y1 = this.canvasYstartPoint;
    let y2 ;

    for(let i = 0; i< coordinates.length; i++){
        
        this.allCoords.forEach((elm,ind)=>{
            if(elm.yValue == coordinates[i]['value']){
                y2 = elm["actCoords"];
            }
            coordinates[i]["actCoords"] = y1
        });
        x2 = coordinates[i]['verticalCoordinates'];
        if(i > 0){
            this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                            <line x1="${x1}"
                                                y1="${y1}" 
                                                x2="${x2}" 
                                                y2="${y2}" 
                                            style="stroke:${this.strokeThemeColor};stroke-width:2" />`;
        }

        x1 = coordinates[i]['verticalCoordinates'];
        y1 = y2
    }
  }

  drawCirClePoint(coordinates){
    // Draw circle on each point
    let x = this.canvasXstartPoint;
    let y;
    for(let i = 0; i< coordinates.length; i++){
        this.allCoords.forEach((elm,ind)=>{
            if(elm.yValue == coordinates[i]['value']){
                y = elm["actCoords"];
            }
        })
        x = coordinates[i]['verticalCoordinates'];

        this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                                <circle 
                                                    cx="${x}" cy="${y}" r="4" 
                                                    stroke="${this.strokeThemeColor}" 
                                                    stroke-width="1" 
                                                    fill="${this.strokeThemeColor}" 
                                                />`;

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