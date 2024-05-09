var mapView = new ol.View({
    center: ol.proj.fromLonLat([123.94545, 11.00665]),
    zoom: 12 // Adjusted zoom level
});

var map = new ol.Map({
    target: 'map',
    view: mapView,
    controls: []
});

var noneTile = new ol.layer.Tile({
    title: 'None',
    type: 'base',
    visible: false
});

var osmTile = new ol.layer.Tile({
    title: 'Open Street Map',
    visible: true,
    source: new ol.source.OSM()
});

var mapTileSat = new ol.layer.Tile({
    title: 'Open Street Map Satellite',
    visible: true,
    source: new ol.source.TileJSON({
        attributions: '@MapTiler',
        url: 'https://api.maptiler.com/maps/satellite/tiles.json?key=97HwfL5wKHdBYLsVMtfU',    
    }),
});

var SanRemTile = new ol.layer.Tile({
    title: "San Remigio Boundary",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8087/geoserver/SanReMapa/wms',
        params: {'LAYERS': 'SanReMapa:SAN REMIGIO BASE MAP', 'TILED': true},
        serverType: 'geoserver',
        visible: true,
    })
});

var SanRemFlood = new ol.layer.Tile({
    title: "San Remigio Flood Hazard",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8087/geoserver/SanReMapa/wms',
        params: {'LAYERS': 'SanReMapa:sanremio_flood', 'TILED': true},
        serverType: 'geoserver',
    }),
    visible: false
});

var SanRemLandSlide = new ol.layer.Tile({
    title: "San Remigio Landslide Hazard",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8087/geoserver/SanReMapa/wms',
        params: {'LAYERS': 'SanReMapa:sanremio_landslide', 'TILED': true},
        serverType: 'geoserver',
    }),
    visible: false
});

var SanRemStorm = new ol.layer.Tile({
    title: "San Remigio Stormsurge Hazard",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8087/geoserver/SanReMapa/wms',
        params: {'LAYERS': 'SanReMapa:SAN REM_stormsurge', 'TILED': true},
        serverType: 'geoserver',
    }),
    visible: false
});

var SanRemLandUse = new ol.layer.Tile({
    title: "San Remigio Land Use Plan",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8087/geoserver/SanReMapa/wms',
        params: {'LAYERS': 'SanReMapa:SanRem_LandUsePlan', 'TILED': true},
        serverType: 'geoserver',
    }),
    visible: false
});

map.addLayer(osmTile);
map.addLayer(mapTileSat);
map.addLayer(SanRemTile);
map.addLayer(SanRemFlood);
map.addLayer(SanRemLandSlide);
map.addLayer(SanRemStorm);
map.addLayer(SanRemLandUse);
map.addLayer(noneTile);

// Function to toggle the visibility of a specific layer by title
// Function to toggle the visibility of a specific layer by title
function toggleLayerVisibility(layerTitle) {
    var layers = map.getLayers().getArray();
    layers.forEach(function(layer) {
        if (layer.get('title') === layerTitle) {
            var visibility = layer.getVisible();
            layer.setVisible(!visibility);
        }
    });
}

// Attach event listeners once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    attachEventListeners();
});

function attachEventListeners() {
    var buttons = [
        { id: 'landslideButton', title: 'San Remigio Landslide Hazard' },
        { id: 'stormSurgeButton', title: 'San Remigio Stormsurge Hazard' },
        { id: 'floodButton', title: 'San Remigio Flood Hazard' },
        { id: 'landUseButton', title: 'San Remigio Land Use Plan' },
        { id: 'boundaryButton', title: 'San Remigio Boundary' },
    ];

    buttons.forEach(function(button) {
        document.getElementById(button.id).addEventListener('click', function() {
            toggleLayerVisibility(button.title);
            this.classList.toggle('active');
        });
    });
}

// Mouse Position and ScaleLine Controls
var mousePosition = new ol.control.MousePosition({
    className: 'mousePosition',
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate) {
        return ol.coordinate.format(coordinate, '{y}, {x}', 6);
    }
});

map.addControl(mousePosition);

var scaleControl = new ol.control.ScaleLine({
    bar: true,
    text: true
});
map.addControl(scaleControl);

// Popup overlay setup
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    }
});

map.addOverlay(popup);

closer.onclick = function() {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

//FOR BASEMAPS

// Function to toggle base map visibility and ensure only one is active at a time
function toggleBaseMapVisibility(selectedBaseMapTitle) {
    var baseMaps = ['Open Street Map', 'Open Street Map Satellite']; // Titles of base maps
    var layers = map.getLayers().getArray();

    layers.forEach(function(layer) {
        if (baseMaps.includes(layer.get('title'))) {
            if (layer.get('title') === selectedBaseMapTitle) {
                layer.setVisible(true); // Activate selected base map
            } else {
                layer.setVisible(false); // Deactivate all other base maps
            }
        }
    });

    // Update button states
    baseMaps.forEach(function(title) {
        var buttonId = title === 'Open Street Map' ? 'osmButton' : 'osmSatButton';
        var button = document.getElementById(buttonId);
        if (title === selectedBaseMapTitle) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Setup event listeners for base map buttons
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('osmButton').addEventListener('click', function() {
        toggleBaseMapVisibility('Open Street Map');
    });
    document.getElementById('osmSatButton').addEventListener('click', function() {
        toggleBaseMapVisibility('Open Street Map Satellite');
    });
});


//MOUSE POSITION WITH COORDINATES
var mousePosition = new ol.control.MousePosition({
    className: 'mousePosition',
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate,'{y}, {x}', 6);}
});

map.addControl(mousePosition);

var scaleControl = new ol.control.ScaleLine({
    bar: true,
    text: true
});
map.addControl(scaleControl);

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    }
});

map.addOverlay(popup);

closer.onclick = function(){
    popup.setPosition(undefined);
    closer.blur();
    return false;
};



//start: home control
// Home Button
var homeButton = document.createElement('button');
homeButton.innerHTML= '<img src="resources/images/home.png" alt="" style="width: 20px;height:20px;filter:brightness(0) invert(1);vertical-align:middle">';
homeButton.className='myButton';

var homeElement = document.createElement('div');
homeElement.className = 'homeButtonDiv';
homeElement.appendChild(homeButton);

var homeControl = new ol.control.Control({
    element: homeElement
})

homeButton.addEventListener("click", () => {
    location.href= "index.html";
})

map.addControl(homeControl);

// Full Screen Button
var fsButton = document.createElement('button');
fsButton.innerHTML = '<img src="resources/images/full.png" alt="" style="width:20px; height:20px; filter:brightness(0) invert(1); vertical-align: middle">';
fsButton.className = 'myButton';

var fsElement = document.createElement('div');
fsElement.className = 'fsButtonDiv';
fsElement.appendChild(fsButton);

var fsControl = new ol.control.Control({
    element: fsElement
})

fsButton.addEventListener("click", () => {
    var mapEle = document.getElementById("map");
    if (mapEle.requestFullScreen){
        mapEle.requestFullScreen();
    } else if (mapEle.msRequestFullScreen) {
        mapEle.msRequestFullScreen();
    } else if (mapEle.mozRequestFullScreen) {
        mapEle.mozRequestFullScreen();
    } else if (mapEle.webkitRequestFullScreen) {
        mapEle.webkitRequestFullScreen();
    }
})

map.addControl(fsControl);



//Length and Area Measurement Control

var lengthButton = document.createElement('button');
lengthButton.innerHTML = '<img src="../../resources/images/measure-length.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle">';
lengthButton.className = 'myButton';
lengthButton.id= 'lengthButton';

var lengthElement = document.createElement('div');
lengthElement.className = 'lengthButtonDiv';
lengthElement.appendChild(lengthButton);

var lengthControl = new ol.control.Control({
    element: lengthElement
})

var lengthFlag = false;
lengthButton.addEventListener("click", () => {
    //disableOtherInteraction('lengthButton');
    lengthButton.classList.toggle('clicked');
    lengthFlag = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if(lengthFlag){
        map.removeInteraction(draw);
        addInteraction('LineString');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
})

map.addControl(lengthControl);

var areaButton = document.createElement('button');
areaButton.innerHTML = '<img src ="../../resources/images/measure-area.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle">';
areaButton.className = 'myButton';
areaButton.id = 'areaButton';

var areaElement = document.createElement('div');
areaElement.className = 'areaButtonDiv';
areaElement.appendChild(areaButton);

var areaControl = new ol.control.Control({
    element: areaElement
})

var areaFlag = false;
areaButton.addEventListener("click", () => {
    //disableOtherInteraction('areaButton');
    areaButton.classList.toggle('clicked');
    areaFlag = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if(areaFlag){
        map.removeInteraction(draw);
        addInteraction('Polygon');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
})

map.addControl(areaControl);

// Global variables for the drawing interaction and tooltips
var source = new ol.source.Vector();

var vectorLayer = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            }),
        }),
    }),
});

map.addLayer(vectorLayer);

var draw; // Global variable to handle the draw interaction
var helpTooltipElement;
var helpTooltip;
var measureTooltipElement;
var measureTooltip;
var activeTool = null; // Tracks the active tool

function addInteraction(type) {
    if (draw) {
        map.removeInteraction(draw);
    }

    draw = new ol.interaction.Draw({
        source: source,
        type: type === 'area' ? 'Polygon' : 'LineString',
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    map.addInteraction(draw);
    activeTool = type; // Set the active tool

    createMeasureTooltip();
    createHelpTooltip();

    draw.on('drawstart', function(evt) {
        var sketch = evt.feature;
        
        helpTooltipElement.innerHTML = 'Double click to finish measuring';
        helpTooltipElement.classList.remove('hidden');

        var tooltipCoord = evt.coordinate;

        sketch.getGeometry().on('change', function(evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function() {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        measureTooltipElement = createMeasureTooltip(); // recreate the measure tooltip for next drawings
        helpTooltipElement.classList.add('hidden');
        activeTool = null; // Reset active tool
    });
}

function createHelpTooltip() {
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip ol-tooltip-help';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
    helpTooltipElement.classList.remove('hidden');
}

function createMeasureTooltip() {
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
    return measureTooltipElement;
}

function toggleMeasurementTool(type) {
    if (activeTool === type) {
        map.removeInteraction(draw);
        helpTooltipElement.classList.add('hidden');
        activeTool = null;
        document.getElementById(type + 'Button').classList.remove('active');
    } else {
        document.querySelectorAll('.myButton.active').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(type + 'Button').classList.add('active');
        addInteraction(type);
        helpTooltipElement.innerHTML = 'Click to start measuring';
        helpTooltipElement.classList.remove('hidden');
    }
}

document.getElementById('lengthButton').addEventListener('click', function() {
    toggleMeasurementTool('length');
    document.getElementById("map").style.cursor = "crosshair";
});

document.getElementById('areaButton').addEventListener('click', function() {
    toggleMeasurementTool('area');
    document.getElementById("map").style.cursor = "crosshair";
});
 helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip ol-tooltip-help';
    helpTooltipElement.innerHTML = 'Click anywhere to start measuring';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
    helpTooltipElement.classList.remove('hidden');


function createMeasureTooltip() {
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
    return measureTooltipElement;
}

function formatLength(line) {
    var length = ol.sphere.getLength(line);
    var output = length > 100 ? (Math.round(length / 1000 * 100) / 100) + ' km' : (Math.round(length * 100) / 100) + ' m';
    return output;
}

function formatArea(polygon) {
    var area = ol.sphere.getArea(polygon);
    var output = area > 10000 ? (Math.round(area / 1000000 * 100) / 100) + ' km²' : (Math.round(area * 100) / 100) + ' m²';
    return output;
}

document.getElementById('lengthButton').addEventListener('click', function() {
    this.classList.toggle('active');
    addInteraction('length');
    document.getElementById("map").style.cursor = "crosshair";
});

document.getElementById('areaButton').addEventListener('click', function() {
    this.classList.toggle('active');
    addInteraction('area');
    document.getElementById("map").style.cursor = "crosshair";
});

//end: Length and Area Measurement Control

//Start featureinfo control

var featureInfoElement = document.createElement('div');
featureInfoElement.className = 'featureInfoDiv';

var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML = '<img src="resources/images/info.png" alt="" style="width: 20px; height: 20px; filter: brightness(0) invert(1); vertical-align: middle">';
featureInfoButton.className = 'myButton';
featureInfoElement.appendChild(featureInfoButton);

var featureInfoControl = new ol.control.Control({
    element: featureInfoElement
});

map.addControl(featureInfoControl); // Add this control without removing existing ones

var featureInfoActive = false;  // Flag to track whether feature info is active

// Assuming 'featureInfoButton' is your button element
featureInfoButton.addEventListener('click', function() {
    featureInfoActive = !featureInfoActive;  // Toggle feature info active state
    this.classList.toggle('clicked');  // Optionally toggle a class to visually indicate the active state
});

function formatProperties(properties) {
    let content = '<h3>Feature Details</h3>';
    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            let value = properties[key];
            if (value) {  // Only add to content if value is not null/undefined
                content += `<p><strong>${formatKey(key)}:</strong> ${value}</p>`;
            }
        }
    }
    return content;
}

function formatKey(key) {
    // Replace underscores with spaces and capitalize each word for a nicer display
    return key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


map.on('singleclick', function(evt) {
    if (featureInfoActive) {
        var viewResolution = map.getView().getResolution();
        var url = ""; // This will hold the GetFeatureInfo URL

        map.forEachLayerAtPixel(evt.pixel, function(layer) {
            if (layer.getVisible() && layer.getSource() instanceof ol.source.TileWMS) {
                url = layer.getSource().getFeatureInfoUrl(
                    evt.coordinate,
                    viewResolution,
                    map.getView().getProjection().getCode(),
                    {'INFO_FORMAT': 'application/json'}  // Make sure the INFO_FORMAT matches what your server can provide
                );
                return url; // Stop the loop once we've processed a visible WMS layer
            }
        });

        if (url) {
            fetch(url)
                .then(function(response) { return response.json(); })
                .then(function(json) {
                    if (json.features.length > 0) {
                        var properties = json.features[0].properties;
                        displayPopup(evt.coordinate, `<pre>${JSON.stringify(properties, null, 2)}</pre>`);
                    } else {
                        displayPopup(evt.coordinate, "No features found at this location.");
                    }
                })
                .catch(function(error) {
                    console.error('Error fetching feature info:', error);
                    displayPopup(evt.coordinate, "Failed to fetch feature info.");
                });
        }
    }
});

function displayPopup(coordinate, content) {
    var popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = content;
    overlay.setPosition(coordinate);
}

var overlay = new ol.Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(overlay);

document.getElementById('popup-closer').onclick = function() {
    overlay.setPosition(undefined);  // Hide the overlay
    return false;  // Prevent the anchor from doing anything else
};

//start ZOOM IN CONTROL
// Zoom In Control
var ziButton = document.createElement('button');
ziButton.innerHTML = '<img src="resources/images/zoom-in.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle">';
ziButton.className = 'myButton';
ziButton.id = 'ziButton';

var ziElement = document.createElement('div');
ziElement.className = 'ziButtonDiv';
ziElement.appendChild(ziButton);

var ziControl = new ol.control.Control({
    element: ziElement
});

ziButton.addEventListener("click", function() {
    var view = map.getView();
    var zoom = view.getZoom();
    view.setZoom(zoom + 1); // Increase the zoom level by 1
});

map.addControl(ziControl);

// Zoom Out Control
var zoButton = document.createElement('button');
zoButton.innerHTML = '<img src="resources/images/zoom-out.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle">';
zoButton.className = 'myButton';
zoButton.id = 'zoButton';

var zoElement = document.createElement('div');
zoElement.className = 'zoButtonDiv';
zoElement.appendChild(zoButton);

var zoControl = new ol.control.Control({
    element: zoElement
});

zoButton.addEventListener("click", function() {
    var view = map.getView();
    var zoom = view.getZoom();
    view.setZoom(zoom - 1); // Decrease the zoom level by 1
});

map.addControl(zoControl);


//ATTRIBUTE QUERY
var geojson;
var featureOverlay;

var qryButton = document.createElement('button');
qryButton.innerHTML = '<img src="resources/images/search.png" alt= "" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle">';
qryButton.className = 'myButton';
qryButton.id = 'qryButton';

var qryElement = document.createElement('div');
qryElement.className = 'myButtonDiv';
qryElement.appendChild(qryButton);

var qryControl = new ol.control.Control({
    element: qryElement
})

var qryFlag = false;
qryButton.addEventListener("click", () => {
    qryButton.classList.toggle('clicked');
    qryFlag = !qryFlag;
    document.getElementById("map").style.cursor = "default";
    if (qryFlag) {
        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if(featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
        document.getElementById("attQueryDiv").style.display = "block";

        bolIdentify = false;

        addMapLayerList();
    } else {
        document.getElementById("attQueryDiv").style.display = "none";
        document.getElementById("attListDiv").style.display = "none";

        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if(featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
    }
})

map.addControl(qryControl);


function addMapLayerList() {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/geoserver/wfs?request=getCapabilities",
            dataType: "xml",
            success: function (xml) {
                var select = $('#selectLayer');
                select.append("<option class= 'ddindent' value=''></option>");
                $(xml).find('FeatureType').each(function () {
                    $(this).find('Name').each(function () {
                        var value = $(this).text();
                        select.append("<option class='ddindent' value='"+ value + "'>" + value +"</option>")
                    });
                });
            }
        });
    });
};

$(function () {
    document.getElementById("selectLayer").onchange = function () {
        var select = document.getElementById("selectAttribute");
        while (select.options.length > 0) {
            select.remove(0);
        }
        var value_layer = $(this).val();
        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/geoserver/SanReMapa/wms?service=WMS&request=DescribeFeatureType&version=1.1.0&typeName" + value_layer + "&CQL_FILTER=" + value_attribute + "+" + value_operator + "+" + value_txt + "'&outputFormat=application/json",
                dataType: "xml",
                success: function (xml) {

                    var select = $('#selectAttribute');
                    //var title = $(xml).find('xsd\\:complexType').attr('name');
                    // alert(title);
                    select.append("<option class='ddindent' value=''></option>");
                    $(xml).find('xsd\\:sequence').each(function () {

                        $(this).find('xsd\\:element').each(function () {
                            var value = $(this).attr('name');
                            //alert(value);
                            var type = $(this).attr('type');
                            //alert(type);
                            if (value != 'geom' && value != 'the_geom') {
                                select.append("<option class= 'ddindent' value= '" + type + "'>" + value + "</option>");
                            }
                        });
                    });

                }
            });
        });
    }
    document.getElementById("selectAttribute").onchange = function () {
        var operator = document.getElementById("selectOperator");
        while (operator.options.length > 0) {
            operator.remove(0);
        }

        var value_type = $(this).val();
        //alert(value_type);
        var value_attribute = $('#selectAttribute option:selected').text();
        operator.options[0] = new Option('Select operator', "");

        if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Greater than', '>');
            operator1.options[2] = new Option('Less than', '<');
            operator1.options[3] = new Option('Equal to', '=');
        }
        else if (value_type == 'xsd:string') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Like', 'Like');
            operator1.options[2] = new Option('Equal to', '=');
        }
    }

    document.getElementById('attQryRun').onclick = function () {
        map.set("isLoading", 'YES');

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }

        var layer = document.getElementById("selectLayer");
        var attribute = document.getElementById("selectAttribute");
        var operator = document.getElementById("selectOperator");
        var txt = document.getElementById("enterValue");

        if (layer.options.selectedIndex == 0) {
            alert("Select Layer");
        } else if (attribute.options.selectedIndex == -1) {
            alert("Select Attribute");
        } else if (operator.options.selectedIndex <= 0) {
            alert("Select Operator");
        } else if (txt.value.length <= 0) {
            alert("Enter Value");
        } else {
            var value_layer = layer.options[layer.selectedIndex].value;
            var value_attribute = attribute.options[attribute.selectedIndex].text;
            var value_operator = operator.options[operator.selectedIndex].value;
            var value_txt = txt.value;
            if (value_operator == 'Like') {
                value_txt = "%25" + value_txt + "%25";
            }
            else {
                value_txt = value_txt;
            }
            var url = "http://localhost:8080/geoserver/SanReMapa/wms?service=WMS&version=1.1.0&request=GetFeature&typeName" + value_layer + "&CQL_FILTER=" + value_attribute + "+" + value_operator + "+" + value_txt + "'&outputFormat=application/json"
            // console.log(url);
            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function () { newaddRowHandlers(url); }, 300);
            map.set("isLoading", 'NO');
        }
    }
});

function newaddGeoJsonToMap(url) {

    if (geojson) {

        geojson.getSource().clear();
        map.removeLayer(geojson);
    }

    var style = new ol.style.Style({
        //fill: new ol.style.Fill({
            //color: 'rgba(0, 255, 255, 0.7)'
        //})
        stroke: new ol.style.Stroke({
            color: '#FFFF00',
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#FFFF00'
            })
        })
    });


    geojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON(),
        }),
        style: style,
    });

    geojson.getSource().on('addfeature', function () {
        map.getView().fit(
            geojson.getSource().getExtent(),
            {duration: 1590, size: map.getSize(), maxZoom: 21 }
        );
    });

    geojson.getSource().on('addfeature', function () {
        map.getView().fit(
            geojson.getSource().getExtent(),
            { duration: 1590, size: map.getSize(), maxZoom: 21 }
        );
    });
    map.addLayer(geojson);
};

function newpopulateQueryTable(url) {
    if (typeof attributePanel !== 'undefined') {
        if (attributePanel.parentElement !== null) {
            attributePanel.close();
        }
    }
    $.getJSON(url, function (data) {
        var col = [];
        col.push('id');
        for (var i=0; i < data.features.length; i++) {

            for (var key in data.features[i].properties) {

                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        var table = document.createElement("table");

        table.setAttribute("class", "table table-bordered table-hover table-condensed");
        table.setAttribute("id", 'attQryTable');
        //CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);       //TABLE ROW

        for (var i=0; i < col.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS
        for (var i=0; i < data.features.length; i++) {
            tr = table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == 0) { tableCell.innerHTML = data.features[i]['id']; }
                else {
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                }
            } 
        }

        //var tabDiv = document.createElement("div");
        var tabDiv = document.getElementById('attListDiv');

        var delTab = document.getElementById('attQryTable');
        if (delTab) {
            tabDiv.removeChild(delTab);
        }

        tabDiv.appendChild(table);

        document.getElementById("attListDiv").style.display = "block";
    });

    var highlightStyle = new ol.style.Style ({
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 255, 0.3)',
        }),
        stroke: new ol.style.Stroke({
            color: '#FF00FF',
            width: 3,
        }),
        image: new ol.style.Circle ({
            radius: 10,
            fill: new ol.style.Fill ({
                color: '#FF00FF'
            })
        })
    });

    var featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: highlightStyle
    });
};

function newaddRowHandlers() {
    var table = document.getElementById("attQryTable");
    var rows = document.getElementById("attQryTable").rows;
    var heads = table.getElementsByTagName('th');
    var col_no;
    for (var i=0; i < heads.length; i++) {
        //Take each cell
        var head = heads [i];
        if (head.innerHTML == 'id') {
            col_no = i + 1;
        }

    }
    for (i=0; i< rows.length; i++) {
        rows[i].onclick = function () {
            return function () {
                featureOverlay.getSource().clear();

                $(function () {
                    $("#attQryTable td").each(function () {
                        $(this).parent("tr").css("background-color", "white");
                    });
                });
                var cell = this.cells[col_no -1];
                var id = cell.innerHTML;
                $(document).ready(function () {
                    $("#attQryTable td:nth-child(" + col_no + ")").each(function () {
                        if ($(this).text() == id) {
                            $(this).parent("tr").css("background-color", "#d1d8e2");
                        }
                    });
                });

                var features = geojson.getSource().getFeatures();

                for (i = 0; i < features.length; i++) {
                    if (features[i].getId() == id) {
                        featureOverlay.getSource().addFeature(features[i]);

                        featureOverlay.getSource().on('addfeature', function () {
                            map.getView().fit(
                                featureOverlay.getSource().getExtent(),
                                {duration: 1500, size: map.getSize(), maxZoom: 24}
                            );
                        });
                    }
                }
            };
        } (rows[i]);
    }
}


//GEOTAG
document.addEventListener('DOMContentLoaded', function() {

    // Create and append the geotag control to the map
    var geoTagButton = document.createElement('button');
    geoTagButton.innerHTML = '<img src="resources/images/geotag.png" alt="" style="width: 20px; height: 20px; filter: brightness(0) invert(1); vertical-align: middle;">';
    geoTagButton.className = 'myButton';

    var geoTagElement = document.createElement('div');
    geoTagElement.className = 'geoTagButtonDiv';
    geoTagElement.appendChild(geoTagButton);

    var geoTagControl = new ol.control.Control({
        element: geoTagElement
    });

    // Assuming 'map' is your OpenLayers map object
    map.addControl(geoTagControl);

    var geotagSource = new ol.source.Vector();
    var geotagLayer = new ol.layer.Vector({
        source: geotagSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'resources/images/geotag.png',
                scale: 0.05
            })
        })
    });
    map.addLayer(geotagLayer);

    var drawInteraction = new ol.interaction.Draw({
        source: geotagSource,
        type: 'Point',
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'resources/images/geotag.png',
                scale: 0.05  // Ensure this scale is appropriate
            })
        })
    });
    

    var categoryContainer = document.getElementById('categoryContainer');

    // Toggle category container visibility
    geoTagButton.addEventListener("click", function () {
        categoryContainer.style.display = categoryContainer.style.display === 'block' ? 'none' : 'block';
    });

    // Handle category selection and form display
    const categoryButtons = document.querySelectorAll('.category-item');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            let currentCategory = this.getAttribute('data-category');
            categoryContainer.style.display = 'none';
            map.addInteraction(drawInteraction);  // Add geotag drawing interaction
    
            map.removeInteraction(drawInteraction);
            map.addInteraction(drawInteraction);

            drawInteraction.on('drawend', function(event) {
                const coordinates = event.feature.getGeometry().getCoordinates();
                console.log("Geotag placed at:", coordinates);
                map.removeInteraction(drawInteraction);  // Remove interaction after placing

                switch (currentCategory) {
                    case "Landmarks":
                        showLandmarkForm(coordinates);
                        break;
                    case "Issues":
                        showLandIssueForm(coordinates);
                        break;
                    case "Improvements":
                        showEnvironmentalForm(coordinates);
                        break;
                    case "Feedback":
                        showCommunityFeedbackForm(coordinates);
                        break;
                }
            });
        });
    });

    function showLandmarkForm(coordinates) {
        displayForm('landmarkForm', coordinates);
    }

    function showLandIssueForm(coordinates) {
        displayForm('landissuesForm', coordinates);
    }

    function showEnvironmentalForm(coordinates) {
        displayForm('improvementForm', coordinates);
    }

    function showCommunityFeedbackForm(coordinates) {
        displayForm('feedbackForm', coordinates);
    }

    function displayForm(formId, coordinates) {
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'block';
            form.style.position = 'absolute';
            const pixelCoordinates = map.getPixelFromCoordinate(coordinates);
            form.style.left = pixelCoordinates[0] + 'px';
            form.style.top = pixelCoordinates[1] + 'px';

            // Close button functionality
            form.querySelector('.close-btn').addEventListener('click', function() {
                form.style.display = 'none';
            });

            console.log("Form displayed at pixel coordinates:", pixelCoordinates);
        } else {
            console.error(formId + " not found in the document.");
        }
    }
});

// document.getElementById('submitForm').addEventListener('click', function() {
//     var category = document.getElementById('landmark-category').value;
//     var description = document.getElementById('landmark-description').value;
//     console.log("Submitting Form:", { category, description });
//     alert('Form submitted! Check console for data.');

//     // Hide the form after submission
//     document.getElementById('landmarkForm').style.display = 'none';

// });

document.getElementById('submitForm').addEventListener('click', function() {
    var category = document.getElementById('landmark-category').value;
    var description = document.getElementById('landmark-description').value;
    console.log("Submitting Form:", { category, description });

    // Send data to the server
    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, description })
    })
    .then(response => response.json())
    .then(data => alert('Form submitted successfully!'))
    .catch(error => console.error('Error:', error));

    // Hide the form after submission
    document.getElementById('landmarkForm').style.display = 'none';
    
});

const express = require('express');
const app = express();
const port = 3000;


// Client-side: JavaScript with OpenLayers
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/geotags')
        .then(response => response.json())
        .then(geotags => {
            geotags.forEach(geotag => {
                addGeotagToMap(geotag);
            });
        })
        .catch(error => console.error('Error fetching geotags:', error));
});

function addGeotagToMap(geotag) {
    const feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([geotag.longitude, geotag.latitude])),
        name: geotag.description // Assuming 'description' is one of the fields
    });

    const vectorSource = new ol.source.Vector({
        features: [feature]
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'resources/images/geotag.png',
                scale: 0.05
            })
        })
    });

    map.addLayer(vectorLayer);
}

// Function to display the popup on hover
map.on('pointermove', function(evt) {
    if (evt.dragging) {
        return; // Ignore drag events
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';

    if (hit) {
        map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            const coord = feature.getGeometry().getCoordinates();
            content.innerHTML = feature.get('name'); // Display feature's name
            overlay.setPosition(coord);
        });
    } else {
        overlay.setPosition(undefined);
    }
});