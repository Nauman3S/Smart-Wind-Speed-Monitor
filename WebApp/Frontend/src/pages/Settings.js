import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";
import AdminSettings from "./AdminSettings";
import AccountDetails from "./AccountDetails";

import smartWSM from "../api/smartWSM";
import {
  Row,
  Col,
  Card,
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  message,
  Select,
  Popconfirm,
} from "antd";

const Settings = () => {
  const [data, setData] = useState([]);
  const [macAddress, setMacAddress] = useState(null);

  const userData = () => {
    const id = localStorage.getItem("userId");
    smartWSM
      .get(`/api/users/getMacAddress/${id}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log("errhere");
        console.error(err);
      });
  };
  useEffect(() => {
    userData();
  }, []);

  //Popconfirm buttons functions

  if (localStorage.getItem("userType") === "admin") {
    return <AdminSettings />;
  } else if (localStorage.getItem("userType") === "user") {
    const confirm = () => {
      console.log(confirm);

      smartWSM
        .put("/api/users/deleteMacAddress", { macAddress })
        .then((res) => {
          console.log(res);
          // setMacAddress(null);
          message.success("Macaddress Deleted");
          userData();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const cancel = () => {
      console.log(cancel);
    };
    const getMacAddress = (e) => {
      let str =
        e.target.parentNode.parentNode.parentNode.parentNode.children[0]
          .innerText;

      if (!str.match(/\s+/g, " ") && str !== "Delete") {
        setMacAddress(str);
        console.log(str);
      } else {
        str =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .children[0].innerText;
        console.log(str);

        setMacAddress(str);
      }
    };
    const columns = [
      {
        title: "Macaddress",
        key: "macAddress",
      },
      {
        title: "Action",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: () => (
          <Space size="middle">
            <Popconfirm
              title="Are you sure to delete this Client?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button data={data} onClick={getMacAddress} type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
    return (
      <div>
        <div className="tabled" style={{ paddingBottom: 10, width: "50%" }}>
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title="Macaddress"
              >
                <div className="table-responsive">
                  <Table
                    key="enCol"
                    columns={columns}
                    pagination={false}
                    dataSource={data}
                    className="ant-border-space"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <AccountDetails />
      </div>
    );
  } else {
    return <div>Settings</div>;
  }
};

export default Settings;
