import React, { useState, useEffect, useRef } from "react";

// import "./App.css";

import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Amplify, { Auth } from "aws-amplify";
import { Signer } from "@aws-amplify/core";
import Location from "aws-sdk/clients/location";
import awsconfig from "../aws-exports";
import Pin from "./Pin";
import useInterval from "./useInterval";

Amplify.configure(awsconfig);
const mapName = "wsm-map"; // HERE IT GOES THE NAME OF YOUR MAP

/**
 * Sign requests made by Mapbox GL using AWS SigV4.
 */

const transformRequest = (credentials) => (url, resourceType) => {
  // Resolve to an AWS URL
  if (resourceType === "Style" && !url?.includes("://")) {
    url = `https://maps.geo.${awsconfig.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }

  // Only sign AWS requests (with the signature as part of the query string)
  if (url?.includes("amazonaws.com")) {
    return {
      url: Signer.signUrl(url, {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      }),
    };
  }

  // Don't sign
  return { url: url || "" };
};

const AwsMap = ({ longitude, latitude }) => {
  const [credentials, setCredentials] = useState(null);
  const [client, setClient] = useState(null);

  console.log(longitude, latitude);

  const [viewport, setViewport] = useState({
    longitude: Number(longitude),
    latitude: Number(latitude),
    zoom: 10,
  });

  useEffect(() => {
    const fetchCredentials = async () => {
      setCredentials(await Auth.currentUserCredentials());
    };

    fetchCredentials();

    const createClient = async () => {
      const credentials = await Auth.currentCredentials();
      const client = new Location({
        credentials,
        region: awsconfig.aws_project_region,
      });
      setClient(client);
    };

    createClient();
  }, []);

  useInterval(() => {
    // getDevicePosition();
  }, 20000);

  return (
    <div className="App">
      <br />
      <div>
        {credentials ? (
          <ReactMapGL
            {...viewport}
            width="100%"
            height="100vh"
            transformRequest={transformRequest(credentials)}
            mapStyle={mapName}
            onViewportChange={setViewport}
            w
          >
            <Marker
              // longitude={74}
              // latitude={31}
              longitude={Number(longitude)}
              latitude={Number(latitude)}
              offsetTop={-20}
              offsetLeft={-10}
            >
              <Pin size={20} text={"Device"} />
            </Marker>

            <div style={{ position: "absolute", left: 20, top: 20 }}>
              <NavigationControl showCompass={false} />
            </div>
          </ReactMapGL>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default AwsMap;
