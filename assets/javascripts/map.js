
        var internet_explorer =  /msie/i.test(navigator.userAgent);
        var map;        // make map available for easy debugging

    function zoom_to(map,lat,lon) {
        var lonLat = new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
        map.setCenter(lonLat, 12);
    }

        function init_map(){

            // increase reload attempts 
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

 	    var transition_effect = 'resize';
	    if (internet_explorer) {
	       transition_effect = 'none';
            } else {
	    }

	    var layerswitcher = new OpenLayers.Control.LayerSwitcher();

            var options = {
                    controls: [
                        layerswitcher,
                        new OpenLayers.Control.Navigation(),
	                new OpenLayers.Control.MousePosition(),
	                new OpenLayers.Control.Permalink('permalink'),
                        new OpenLayers.Control.ScaleLine(),
                        // new OpenLayers.Control.KeyboardDefaults(),
                        new OpenLayers.Control.PanZoomBar(),
                        new OpenLayers.Control.Attribution()
	        ],
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                units: "m",
                numZoomLevels: 22, // was 19
                maxResolution: 156543.0339,
                maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
                                                 20037508, 20037508.34)
            };
            map = new OpenLayers.Map('map', options);
            // layerswitcher.maximizeControl();

            var camap = new OpenLayers.Layer.WMS( "geogratis.gcc.ca",
                    "http://wms.ess-ws.nrcan.gc.ca/wms/toporama_en?VERSION=1.1.1&service=wms&SRS=epsg:900913&",
	            {layers: 'vegetation,builtup_areas,designated_areas,limits,hydrography,hypsography,populated_places,railway,power_network,feature_names,constructions,structures,road_network'},{transitionEffect:transition_effect} );

// http://wms.ess-ws.nrcan.gc.ca/wms/toporama_en?VERSION=1.1.1&request=GetCapabilities&service=wms
//http://www.geogratis.gc.ca/geogratis/en/service/toporama.html
// http://wms.ess-ws.nrcan.gc.ca/wms/toporama_en?REQUEST=GetMap&SERVICE=wms&VERSION=1.1.1&SRS=epsg:4269&BBOX=-72,45.35,-71.85,45.5&WIDTH=800&HEIGHT=600&FORMAT=image/png&LAYERS=vegetation,builtup_areas,hydrography

            var flimap = new OpenLayers.Layer.WMS( "Roads: TIGER 2007",
                    "http://map4.forensiclogic.com/maps/mapcache2.pl?map=wms2.map&mode=map&",
	            {layers: 'land,cities,places,water,roads,roadlabels'},{transitionEffect:transition_effect} );



            var terraserver_t = new OpenLayers.Layer.WMS( "Terraserver (tiled)",
                    "http://map4.forensiclogic.com/maps/mapcache2.pl?map=wms2.map&mode=map&",
	            {layers: 'terraserver',format: 'image/jpeg'},{ratio: 1.1, transitionEffect:transition_effect} );
            var terraserver_u = new OpenLayers.Layer.WMS( "Terraserver (untiled)",
                    "http://map4.forensiclogic.com/maps/mapcache2.pl?map=wms2.map&mode=map&",
	            {layers: 'terraserver',format: 'image/jpeg'},{singleTile: true, ratio: 1.1, transitionEffect:transition_effect} );

//            var kmllayer = new OpenLayers.Layer.Vector("KML", {
//                projection: map.displayProjection,
//                strategies: [new OpenLayers.Strategy.Fixed()],
//                protocol: new OpenLayers.Protocol.HTTP({
//                    url: "simple_kml.kml",
//                    format: new OpenLayers.Format.KML({
//                        extractStyles: true,
//                        extractAttributes: true
//                    })
//                })
//            });

/*
            // create Yahoo layer
            var yahoo = new OpenLayers.Layer.Yahoo(
                "Roads: Yahoo",
                {'sphericalMercator': true},{transitionEffect:transition_effect}
            );
            var yahoosat = new OpenLayers.Layer.Yahoo(
                "Aerial: Yahoo",
                {'type': YAHOO_MAP_SAT, 'sphericalMercator': true},{transitionEffect:transition_effect}
            );
            var yahoohyb = new OpenLayers.Layer.Yahoo(
                "Hybrid: Yahoo",
                {'type': YAHOO_MAP_HYB, 'sphericalMercator': true},{transitionEffect:transition_effect}
            );
*/
/*
            // create Google Mercator layers
            var gmap = new OpenLayers.Layer.Google(
                "Roads: Google",
                {'sphericalMercator': true},{transitionEffect:transition_effect}
            );
            var gsat = new OpenLayers.Layer.Google(
                "Aerial: Google",
                {type: G_SATELLITE_MAP, 'sphericalMercator': true, numZoomLevels: 22},{transitionEffect:transition_effect}
            );
            var ghyb = new OpenLayers.Layer.Google(
                "Hybrid: Google",
                {type: G_HYBRID_MAP, 'sphericalMercator': true},{transitionEffect:transition_effect}
            );

            // create Virtual Earth layers
            var veroad = new OpenLayers.Layer.VirtualEarth(
                "Roads: Microsoft",
                {'type': VEMapStyle.Road, 'sphericalMercator': true},{transitionEffect:transition_effect}
            );
            var veaer = new OpenLayers.Layer.VirtualEarth(
                "Aerial: Microsoft",
                {'type': VEMapStyle.Aerial, 'sphericalMercator': true},{transitionEffect:transition_effect}
            );
            var vehyb = new OpenLayers.Layer.VirtualEarth(
                "Hybrid: Microsoft",
                {'type': VEMapStyle.Hybrid, 'sphericalMercator': true},{transitionEffect:transition_effect}
            );
*/


            // create OSM layer
            var mapnik = new OpenLayers.Layer.OSM("Roads: Mapnik");
            // create OAM layer
            // var oam = new OpenLayers.Layer.XYZ(
            //    "OpenAerialMap",
            //    "http://tile.openaerialmap.org/tiles/1.0.0/openaerialmap-900913/${z}/${x}/${y}.png",
            //    {
            //        sphericalMercator: true
            //    }
            //);

            // create OSM layer
            var osmarender = new OpenLayers.Layer.OSM(
                "Roads: OpenStreetMap",
                "http://tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png",{},{transitionEffect:transition_effect}
            );



            // create a vector layer for drawing
            var vector = new OpenLayers.Layer.Vector("Editable Vectors");
            map.addControl(new OpenLayers.Control.EditingToolbar(vector));


//                var geojson_format = new OpenLayers.Format.GeoJSON({
//                    'internalProjection': new OpenLayers.Projection("EPSG:900913"),
//                    'externalProjection': new OpenLayers.Projection("EPSG:4326")
//                });
//
// var oakbeat = new OpenLayers.Layer.GML("Oakland Beats", "/tmp/oakland_beats.geojson", {format: geojson_format});  
//              var oakbeat = new OpenLayers.Layer.Vector('Oakland Beats'); 
//
//	      $.ajax({
//	dataType: "json",url:"oakland_beats.geojson",success:
//                     function(data){
//			oakbeat.addFeatures(geojson_format.read(data));
//			// jQuery('div#msg').html("finished loading beat layer" );
//	             }
//	});





            map.addLayers([
			   flimap,
//			   camap,
//			   gmap,
//			   veroad,
//                         yahoo,
			   osmarender,
			   mapnik,
//			   gsat,
//			   veaer,
//			   yahoosat,
//			   ghyb,
//			   vehyb,
//			   yahoohyb,
//	                   oakbeat,
                           terraserver_t,
                           terraserver_u,
//                           kmllayer,
	                   vector
	]);

////////////////////////////////////////////////////////////////////////////////

            if (!map.getCenter()) {//map.zoomToMaxExtent();
	        map.setBaseLayer(osmarender);
                var lonLat = new OpenLayers.LonLat(-97.113, 33.216).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
                map.setCenter (lonLat, 12);
	        // showAddress("stanford, ca");
            }

        }
