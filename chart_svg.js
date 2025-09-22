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
    let label = {
        color:"#fff",
        background:"#FDD835",
        border:1,
        borderColor:"#263238"
       }
    this.canvasId = canvas;
    this.lineColors = ["#F44336","#01579B","#311B92","#558B2F","#3F51B5","#9E9D24","#C2185B","#E53935","#4A148C","#FFC300"];
    this.label = data.label || label;
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
    this.devider = 50;
    this.strokeThemeColor = "#000";
    this.captionHeight = 35;
    this.bigLenData = [];
    this.showLabelSeperateCircle = data.showLabelSeperateCircle || false;

    //calling Function
    this.init();
    this.createsCoordinates();
    this.calculateBasicGrids(this.coordinates);
    console.log(this.data.xAxis.label[0])
    let xAxisLabels = this.optimizeXAxisLables(this.data.xAxis.label)
    this.drawVerticalLine(xAxisLabels,this.data.xAxis.data,this.data.yAxis.label);
    
    //draw lineGraph
    // for(let i = 0; i< this.dataToDraw.length; i++){
    //     let lineColour = this.lineColors[Math.floor(Math.random() * 10)]
    //     this.drawLineGraphforSmallData(this.dataToDraw[i],lineColour,i);
    //     //this.drawCirClePoint(this.dataToDraw[i]);
    // }

    this.drawZeroLine();
    //setTimeout(()=>{
        if(!this.showLabelSeperateCircle){
            this.mouseEventforAlltogeather()
        }else{
            this.mouseEventforeachPoint();
        }
        
    //},30)
     
  }

  init(){
    try{
        this.canvas = document.getElementById(this.canvasId);
        
        this.canvasWidth = this.canvas.clientWidth - this.canvasXstartPoint;
        this.canvasHeight =  this.canvas.clientHeight - this.canvasYstartPoint;
        this.canvasActualWidth = this.canvas.clientWidth;
        this.canvasActualHeight =  this.canvas.clientHeight;
        this.canvas.innerHTML = `<svg width="${this.canvasActualWidth}" height="${this.canvasActualHeight}"></svg> `;

    }catch(err){
        throw err;
    }
  }

  mouseEventforAlltogeather(){
    let verticalLines = document.getElementsByClassName("verticalLines");
    console.log(verticalLines);

    for(let i = 0; i< verticalLines.length; i++){
        verticalLines[i].addEventListener("mouseover", (e) =>
        {   
            let caption = document.getElementsByClassName(verticalLines[i].getAttribute("data-caption"));
            
            if(caption){               
                for(let y =0; y< caption.length; y++){
                    caption[y].style.display = "block";
                }
            }
            
        });
        verticalLines[i].addEventListener("mouseleave", (e) =>
        {   
            let caption = document.getElementsByClassName(verticalLines[i].getAttribute("data-caption"));
            if(caption){
                for(let y =0; y< caption.length; y++){
                    caption[y].style.display = "none";
                }
            }
        });
    }
    
  }

  mouseEventforeachPoint(){
    let verticalLines = document.getElementsByClassName("verticalLines");
    for(let i = 0; i< verticalLines.length; i++){
        verticalLines[i].style.pointerEvents = "none";
    }
    let circles = document.getElementsByClassName("circle");
    console.log(circles);

    for(let i = 0; i< circles.length; i++){
        circles[i].addEventListener("mouseover", (e) =>
        {   
            let caption = document.getElementById(circles[i].getAttribute("data-id"));
            if(caption){
                caption.style.display = "block";              
            }
            
        });
        circles[i].addEventListener("mouseleave", (e) =>
        {   
            let caption = document.getElementById(circles[i].getAttribute("data-id"));
            if(caption){
                caption.style.display = "none";              
            }
        });
    }
    
  }
    // getMousePosition(event) {
    //     let rect = event.target.getBoundingClientRect();
    //     let x = event.clientX - rect.left;
    //     let y = event.clientY - rect.top;
    //     console.log(event.clientX);
    //     if(document.getElementsByClassName(y).length){
    //         console.log(document.getElementsByClassName(y))
    //     }
    // }

  createsCoordinates(){
    let data = this.coordinates.concat( ...  this.data.xAxis.data);
    data.forEach(elm =>{
        let tempData = {value:elm};
        this.coordinates.push(tempData);
    });
    let tempAr = [];
    this.data.xAxis.data.forEach((elm,ind)=>{
        tempAr.push({indx:ind,len:elm.length})
    });
    this.bigLenData = [...tempAr.sort( function ( a, b ) { return b.len - a.len; } )];
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
                                        
                                        <g fill="none" stroke="#CFD8DC" stroke-width="1">
                                                    <path stroke-dasharray="5,5" 
                                                        d="M${this.canvasYstartPoint} ${actCoords} 
                                                        ${this.canvasActualWidth} ${actCoords}" 
                                                    />
                                                </g>`;
                this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                                        <text x="${10}" y="${actCoords+2}" 
                                                        font-family="Arial, Helvetica, sans-serif"
                                                         style="font-size:12px">
                                                        ${elm}
                                                        </text>`;
            }
        });
        actCoords += smallDevider;
    }
  }

  createCaptionArr(){
    console.log("this.captionArr",this.captionArr)
  }

  optimizeXAxisLables(label){
    let optimizeLable = [];
    let verticalLine = (this.canvasWidth) / label.length;
    let incrementNumber = parseInt((this.canvasWidth) / 100);
    console.log("canvasWidth--",this.canvasWidth,"...label.length...",label.length,"..verticalLine...",verticalLine,"..incrementNumber..",incrementNumber)
    
    if(verticalLine < 40){ // too many labels can't placed.
        for(let i = 0; i< label.length; i= i+8){
            optimizeLable.push(label[i])
        }
        verticalLine = (this.canvasWidth) / optimizeLable.length;
    }else{
        optimizeLable = label;
    }
    return optimizeLable;
  }
  
  drawVerticalLine (label,data,yLabel){
    let verticalLine = (this.canvasWidth) / label.length;
    let yAxis = this.canvasYstartPoint;
    
    for(let i = 0; i< label.length; i++){
        if(i > 0){
            this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                                <g fill="none" stroke="#CFD8DC" stroke-width="1">
                                                    <path stroke-dasharray="5,5" 
                                                        d="M${yAxis} ${this.canvasYstartPoint} 
                                                        ${yAxis} ${this.canvasHeight}" 
                                                    />
                                                </g>`;
        }
        this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                            <text x="${yAxis - 5}" y="${this.canvasActualHeight - 20}"
                                            font-family="Arial, Helvetica, sans-serif"
                                            font-size = "14px"
                                            >
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

  drawLineGraphforSmallData(coordinates,lineColor,index){
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
            coordinates[i]["actCoords"] = y1;
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
        
        this.drawCirClePointWithOutLoop(x2,y2);
        this.drawCirCaptionWithText(x2,y2,
            this.data.xAxis.label[i],coordinates[i]['value'],
            this.data.yAxis.label, this.strokeThemeColor,coordinates);
        if(index == this.bigLenData[0]['indx']){
            this.drawInvisibleGridForMouseEvent(x2,coordinates)
        }
       

        x1 = coordinates[i]['verticalCoordinates'];
        y1 = y2
    }
  }

  drawCirClePointWithOutLoop(x,y){
    let dataId = parseInt(x+y)
    this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                        <g class="circle" data-caption="${x}" data-id=${dataId} style="pointer-events:auto;cursor: pointer">
                                            <circle 
                                                cx="${x}" cy="${y}" r="4" 
                                                stroke="${this.strokeThemeColor}" 
                                                stroke-width="1" 
                                                fill="${this.strokeThemeColor}" 
                                            />
                                        </g>`;
  }
  

  drawCirCaptionWithText(x,y,xLabel,yLabel,value,boxColor,coordinates){
    let text = xLabel+":"+"  "+yLabel+""+value;
    let textWidth = text.length * 8 + 5;
    let identi = parseInt(x+y)
    this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                <g style="display:none" id="${identi}" class="${x} caption">
                                    <rect x="${x}" y="${y-26}" width="${textWidth}" 
                                        height="22" rx="2"
                                        style="fill:${this.label.background};
                                        stroke-width:"${this.label.border};
                                        stroke:"${this.label.borderColor}" />
                                        
                                        <text x="${x+22}" y="${y-10}"
                                            font-size="12px"
                                            font-family="Arial, Helvetica, sans-serif"
                                            fill="${this.label.color}">
                                                ${text}
                                        </text>
                                        <rect x="${x+2}" y="${y-20}" width="15" 
                                        height="12" rx="2"
                                        style="fill:${boxColor};
                                        stroke-width:"0" />
                                </g>`;

   
  }

  drawInvisibleGridForMouseEvent(x,data){
    let length = this.canvasWidth / data.length ;
    this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                                        <g data-caption="${x}" class="verticalLines">
                                            <rect x="${x-5}" y="${0}" width="${length}" 
                                            height="${this.canvasHeight}"
                                            style="fill:#eee;fill-opacity: 0" />
                                        </g>`;
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



  drawZeroLine(){
     //Draw 0 line
     let x = this.canvasXstartPoint;
     let y;
     if(this.negeTiveVal.length > 0){
        this.allCoords.forEach((elm,ind)=>{
            if(elm.yValue == 0){
                y = elm["actCoords"];
            }
        });
        this.canvas.childNodes[0].innerHTML = `${this.canvas.childNodes[0].innerHTML}
                        <g fill="none" stroke="black" stroke-width="1">
                            <path stroke-dasharray="5,5" d="M${x-5} ${y} ${this.canvasActualWidth} ${y}" />
                        </g>`;
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