//Variable to hold JSON URL
const jsonUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/\
dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function Init() {
    //.then returns the promise object, in this case the jsonUrl
    d3.json(jsonUrl).then((data) => {

        let beldat = data.names;
        //console.log(beldat);
        let dropdown = d3.select("#selDataset");
        for (var i = 0; i < beldat.length; i++) {
        dropdown.append("option").text(beldat[i]).property("value",beldat[i]);
        // console.log(beldat[i]);
        }
        let startsample = beldat[0];
        //This is called so initial dropdown value will populate the demographics panel
        panelInfo(startsample)
        chartInfo(startsample)
    });
};    

function optionChanged(sampleId){
 //buildCharts(sampleId)
 panelInfo(sampleId);
 chartInfo(sampleId)
};

function panelInfo(sampleId){
    d3.json(jsonUrl).then((data) => {
        let metadata = data.metadata;
        let mResults = metadata.filter(x=>x.id == sampleId);    
        let panel = d3.select("#sample-metadata");
        panel.html("")
        for (mItem in mResults[0]){panel.append("p").text(`${mItem}: ${mResults[0][mItem]}`)} ; 
        //will pass wfreq values to the gauge chart
        gaugeChart(mResults[0].wfreq)
    }

)

};
function gaugeChart(freq){
    let gaugeData = [{
        domain: { x:[0,1], y:[0,1] },
        value: freq,
        title: {
          text: "Belly Button Washing Frequency"
        },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: {color: 'teal'},
          axis: { range: [0,9] },
          steps: [
            { range: [0,1], color:'#FFFFE3'},
            { range: [1,2], color:'#EBFFC6'},
            { range: [2,3], color:'#CDFFA9'},
            { range: [3,4], color:'#AFFF8D'},
            { range: [4,5], color:'#91FF72'},
            { range: [5,6], color:'#73EB56'},
            { range: [6,7], color:'#54CE3A'},
            { range: [7,8], color:'#30B21A'},
            { range: [8,9], color:'#009700'},
          ]
        }
      }];
      Plotly.newPlot("gauge",gaugeData);
  };


      function chartInfo(sampleId){
        d3.json(jsonUrl).then((data) => {
            let samples = data.samples;
            var sResults = samples.filter(y=>y.id == sampleId);
            console.log(sResults);
            
            var sResults = sResults[0]
            let otuSampleValues = sResults.sample_values;
            let otuIds = sResults.otu_ids;
            let otuLabels = sResults.otu_labels;
    ///BarChart
          /////Info
    let barData = [{
        x: otuSampleValues.slice(0,10),
        y: otuIds.slice(0,10).map(id=>`Otu ${id}`), 
        type: "bar",
        orientation: "h",
        hovertemplate: "%{text}<extra></extra>",
        text: otuLabels.slice(0,10)
      }];
          /////Layout
      let barLayout = {
        title: {
          text: "Top 10 OTUs "
        },
        yaxis: {
          autorange: "reversed"
        }

        
      };
      Plotly.newPlot("bar",barData,barLayout)

    /// Bubble Chart
        /////Info
     let bubbleData = [{
      x: otuIds,
      y: otuSampleValues,
      mode: "markers",
      marker: {
        size: otuSampleValues,
        color: otuIds,
      },
      hovertemplate: "%{text}<extra></extra>",
      text: otuSampleValues
    }];
        ///// Layout
    let bubbleLayout = {
      title: {
        text: "Frequency of OTU Ids"
      },
      xaxis: {
        title: "OTU Ids"
      },
      width: 1200,
      height: 700
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);   
      return(sResults);
              
            })};




Init();




           
    
