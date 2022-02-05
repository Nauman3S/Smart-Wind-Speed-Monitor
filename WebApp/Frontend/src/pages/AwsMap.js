import React, { useEffect } from "react";
import "../assets/styles/main.css";
import Amplify from "aws-amplify";
import awsconfig from "../aws-exports";
import { createMap, drawPoints } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";

Amplify.configure(awsconfig);

const AwsMap = ({ data }) => {
  console.log(data);
  const addMarker = (map) => {
    map.on("load", function () {
      drawPoints(
        "myMap", // Arbitrary source name
        [
          {
            coordinates: [Number(data.longitude), Number(data.latitude)],
            title: "Device",
            address: `Macaddress: ${data.macAddress} Longitude:${data.longitude} Latitude:${data.latitude}`,
          },
        ], // An array of coordinate data, an array of Feature data, or an array of [NamedLocations](https://github.com/aws-amplify/maplibre-gl-js-amplify/blob/main/src/types.ts#L8)
        map,
        {
          showCluster: true,
          unclusteredOptions: {
            showMarkerPopup: true,
          },
          clusterOptions: {
            showCount: true,
          },
        }
      );
    });
  };

  const initializeMap = async () => {
    const map = await createMap({
      container: "map", // An HTML Element or HTML element ID to render the map in https://maplibre.org/maplibre-gl-js-docs/api/map/
      center: [Number(data.longitude), Number(data.latitude)], // center in New York
      zoom: 11,
    });

    return map;
  };

  useEffect(async () => {
    const map = await initializeMap();
    addMarker(map);

    return function cleanup() {
      map.remove();
    };
  }, []);

  return (
    <div>
      <div id="map"></div>
    </div>
  );
};
export default AwsMap;
