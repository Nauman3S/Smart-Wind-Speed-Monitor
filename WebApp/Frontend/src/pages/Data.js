import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";

import smartWSM from "../api/smartWSM";
import Admin from "./Admin";
import {
  Row,
  Col,
  Card,
  Table,
  Input,
  Button,
  Modal,
  Form,
  message,
  Select,
} from "antd";
import Mapbox from "./Mapbox";
import AwsMap from "./AwsMap";

import { RedoOutlined } from "@ant-design/icons";

const { Option } = Select;

const Data = () => {
  // if (localStorage.getItem("user-info")) {
  //   history.push("/tables");
  // } else {
  //   history.push("/sign-in");
  // }
  const componentMounted = useRef(true);

  const [data, setData] = useState([]);
  const [macAddress, setMacAddress] = useState("");
  const [userMacAddress, setUserMacAddress] = useState([]);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  // let intervalId = null;

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };
  const smartWSMDeviceData = async () => {
    if (localStorage.getItem("user-info")) {
      history.push("/data");
    } else {
      history.push("/sign-in");
    }
    // console.log("Calling");
    const fetch = await smartWSM.post("/api/mqtt/getOne", {
      macAddress: localStorage.getItem("macAddress"),
    });

    console.log(fetch.data[0].longitude);
    setData(fetch.data);

    fetch.data[0].longitude
      ? setLongitude(fetch.data[0].longitude)
      : setLongitude("0");
    fetch.data[0].latitude
      ? setLatitude(fetch.data[0].latitude)
      : setLatitude("0");

    await smartWSM
      .post("/api/maxValue/getValues", {
        macAddress: localStorage.getItem("macAddress"),
      })
      .then((res) => {
        console.log("inres");
        console.log(res.data);
        localStorage.setItem("maxTemperature", res.data.maxTemperature);
        localStorage.setItem("maxHumidity", res.data.maxHumidity);
        localStorage.setItem("maxPressure", res.data.maxPressure);
        localStorage.setItem("maxWindSpeed", res.data.maxWindSpeed);
        localStorage.setItem("maxBatteryLevel", res.data.maxBatteryLevel);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    // console.log("In USE");

    smartWSMDeviceData();
    return () => {
      componentMounted.current = false;
    };
  }, [macAddress]);
  // console.log(checkedList);
  useEffect(() => {}, [data]);
  useInterval(() => {
    // Make the request here
    smartWSMDeviceData();
  }, 1000 * 60);

  //Input Function

  const publishToMqtt = (msg) => {
    let macaddress = localStorage.getItem("macAddress");

    smartWSM
      .post(`/api/mqtt/publish/${macaddress}`, {
        message: msg,
      })
      .then((res) => {})
      .catch((err) => {
        // console.log("In err");
        console.log(err);
      });
  };

  const columns = [
    {
      title: "Timestamp(Last Updated)",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },

    {
      title: "Temperature",
      key: "temperature",
      // dataIndex: "temperature",
      align: "center",
      render: (record) => {
        console.log(record.temperature);
        if (
          Number(record.temperature) >
            Number(localStorage.getItem("maxTemperature")) &&
          Number(localStorage.getItem("maxTemperature")) !== 0
        ) {
          publishToMqtt(record.temperature);
        }

        return {
          props: {
            style: {
              background:
                Number(record.temperature) >
                  Number(localStorage.getItem("maxTemperature")) &&
                Number(localStorage.getItem("maxTemperature")) !== 0
                  ? "red"
                  : "",
            },
          },

          children: record.temperature,
        };
      },
    },
    {
      title: "Pressure",
      key: "pressure",
      align: "center",
      // dataIndex: "pressure",
      render: (record) => {
        if (
          Number(record.pressure) >
            Number(localStorage.getItem("maxPressure")) &&
          Number(localStorage.getItem("maxPressure")) !== 0
        ) {
          publishToMqtt(record.pressure);
        }

        return {
          props: {
            style: {
              background:
                Number(record.pressure) >
                  Number(localStorage.getItem("maxPressure")) &&
                Number(localStorage.getItem("maxPressure")) !== 0
                  ? "red"
                  : "",
            },
          },

          children: record.pressure,
        };
      },
    },
    {
      title: "Humidity",
      key: "humidity",
      align: "center",
      // dataIndex: "humidity",
      render: (record) => {
        if (
          Number(record.humidity) >
            Number(localStorage.getItem("maxHumidity")) &&
          Number(localStorage.getItem("maxHumidity")) !== 0
        ) {
          publishToMqtt(record.humidity);
        }

        return {
          props: {
            style: {
              background:
                Number(record.humidity) >
                  Number(localStorage.getItem("maxHumidity")) &&
                Number(localStorage.getItem("maxHumidity")) !== 0
                  ? "red"
                  : "",
            },
          },

          children: record.humidity,
        };
      },
    },
    {
      title: "Wind Speed",
      key: "windSpeed",
      align: "center",
      // dataIndex: "windSpeed",
      render: (record) => {
        if (
          Number(record.windSpeed) >
            Number(localStorage.getItem("maxWindSpeed")) &&
          Number(localStorage.getItem("maxWindSpeed")) !== 0
        ) {
          publishToMqtt(record.windSpeed);
        }

        return {
          props: {
            style: {
              background:
                Number(record.windSpeed) >
                  Number(localStorage.getItem("maxWindSpeed")) &&
                Number(localStorage.getItem("maxWindSpeed")) !== 0
                  ? "red"
                  : "",
            },
          },

          children: record.windSpeed,
        };
      },
    },
    {
      title: "Battery Level",
      key: "batteryLevel",
      align: "center",
      // dataIndex: "batteryLevel",
      render: (record) => {
        if (
          Number(record.batteryLevel) >
            Number(localStorage.getItem("maxBatteryLevel")) &&
          Number(localStorage.getItem("maxBatteryLevel")) !== 0
        ) {
          publishToMqtt(record.batteryLevel);
        }

        return {
          props: {
            style: {
              background:
                Number(record.batteryLevel) >
                  Number(localStorage.getItem("maxBatteryLevel")) &&
                Number(localStorage.getItem("maxBatteryLevel")) !== 0
                  ? "red"
                  : "",
            },
          },

          children: record.batteryLevel,
        };
      },
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
    },
  ];
  //Modal Functions
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleSetValues, setIsModalVisibleSetValues] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const showModalSetValues = () => {
    setIsModalVisibleSetValues(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleOkSetValues = () => {
    setIsModalVisibleSetValues(false);
  };

  const handleCancelSetValues = () => {
    setIsModalVisibleSetValues(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getIdofLoggedInUser = () => {
    function parseJwt(token) {
      if (!token) {
        return;
      }
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64));
    }

    const token = localStorage.getItem("user-info");
    const user = parseJwt(token);

    return user.id;
  };
  //Form Functions
  const onFinishSetValues = async (values) => {
    localStorage.setItem("maxTemperature", values.temperature);
    localStorage.setItem("maxPressure", values.pressure);
    localStorage.setItem("maxHumidity", values.humidity);
    localStorage.setItem("maxWindSpeed", values.windSpeed);
    localStorage.setItem("maxBatteryLevel", values.batteryLevel);

    const hide = message.loading("Processing", 0);

    let macAddress = localStorage.getItem("macAddress");
    let formData = new FormData();

    formData.append("macAddress", macAddress);
    formData.append(
      "maxTemperature",
      values.temperature ? values.temperature : null
    );
    formData.append("maxPressure", values.pressure ? values.pressure : null);
    formData.append("maxHumidity", values.humidity ? values.humidity : null);
    formData.append("maxWindSpeed", values.windSpeed ? values.windSpeed : null);
    formData.append(
      "maxBatteryLevel",
      values.batteryLevel ? values.batteryLevel : null
    );

    await smartWSM
      .put("/api/maxValue", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setTimeout(hide, 0);

        setIsModalVisibleSetValues(false);
        console.log(response);
        message.success("Max Values Setted");
      })
      .catch((error) => {
        setTimeout(hide, 0);

        setIsModalVisibleSetValues(false);
        message.error("Something went wrong!");
        console.log(error);
      });
  };

  const onFinishFailedSetValues = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinish = async (values) => {
    const id = getIdofLoggedInUser();
    const hide = message.loading("Processing", 0);
    await smartWSM
      .put(`/api/users/update/${id}`, {
        macAddress: values.macAddress,
      })
      .then((res) => {
        // Dismiss manually and asynchronously
        setTimeout(hide, 0);

        setIsModalVisible(false);
        smartWSM
          .post("/api/mqtt/")
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
        message.success("Device Added");
      })
      .catch((err) => {
        setTimeout(hide, 0);

        message.warn("Device Already Exists");

        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //Select Functions
  function handleChange(value) {
    console.log("Inhandle chaneg");
    localStorage.setItem("macAddress", value);

    setMacAddress(value);
  }
  const locationData = {
    startLong: 74,
    startLat: 31,
    endLong: 74.8,
    endLat: 31.8,
  };
  const getMacAddresses = async () => {
    const id = getIdofLoggedInUser();

    await smartWSM
      .get(`/api/users/getMacAddress/${id}`)
      .then((res) => {
        setUserMacAddress(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderedOptions = userMacAddress.map((macadd) => {
    if (macadd) {
      return (
        <Option key={`${macadd}`} value={`${macadd}`}>
          {macadd}
        </Option>
      );
    } else {
      return;
    }
  });
  if (localStorage.getItem("userType") === "user") {
    return (
      <>
        <div className="flex-container" style={{ marginBottom: "10px" }}>
          <Button
            type="primary"
            className="addDevicebtn"
            onClick={showModal}
            style={{
              marginLeft: "5px",
              borderRadius: "50px",
            }}
          >
            Add New Device
          </Button>
          <Button
            type="primary"
            className="addDevicebtn"
            onClick={showModalSetValues}
            style={{
              marginLeft: "5px",
              borderRadius: "50px",
            }}
          >
            Set Values
          </Button>
          <Button
            type="primary"
            className="addDevicebtn"
            onClick={() => smartWSMDeviceData()}
            style={{
              marginLeft: "5px",
              borderRadius: "50px",
            }}
            icon={<RedoOutlined />}
          >
            Refresh
          </Button>

          <Modal
            title="Add a New Device"
            visible={isModalVisibleSetValues}
            onOk={handleOkSetValues}
            onCancel={handleCancelSetValues}
            destroyOnClose={true}
            footer={null}
          >
            <Form
              onFinish={onFinishSetValues}
              onFinishFailed={onFinishFailedSetValues}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                className="username"
                label="Temperature"
                name="temperature"
              >
                <Input
                  placeholder="Enter Temperature Max Value"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>

              <Form.Item className="username" label="Pressure" name="pressure">
                <Input
                  placeholder="Enter Pressure Max Value"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>
              <Form.Item className="username" label="Humidity" name="humidity">
                <Input
                  placeholder="Enter Humidity Max Value"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Wind Speed"
                name="windSpeed"
              >
                <Input
                  placeholder="Enter Wind Speed Max Value"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Battery Level"
                name="batteryLevel"
              >
                <Input
                  placeholder="Enter Battery Level Max Value"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Set
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Add a New Device"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true}
            footer={null}
          >
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                className="username"
                label="Mac Address"
                name="macAddress"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Device MacAddress",
                  },
                ]}
              >
                <Input
                  placeholder="Enter MacAddress"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Add
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>

        <Select
          className="mac-search"
          defaultValue={localStorage.getItem("macAddress")}
          style={{ width: 120, borderRadius: "150px", marginBottom: "15px" }}
          onChange={handleChange}
          onClick={getMacAddresses}
        >
          {renderedOptions}
        </Select>
        <div className="tabled">
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title="Smart Hvac"
              >
                <div className="table-responsive">
                  <Table
                    key="enCol"
                    columns={columns}
                    // pagination={false}
                    dataSource={data}
                    className="ant-border-space"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {longitude && latitude ? (
          <AwsMap longitude={longitude} latitude={latitude} />
        ) : (
          ""
        )}
      </>
    );
  } else if (localStorage.getItem("userType") === "admin") {
    return <Admin />;
  } else {
    return <h1>Data</h1>;
  }
};

export default Data;
