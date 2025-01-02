import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import { useTranslation } from "react-i18next";
import AssignDevice from "./AssignDevice";
import Footer from "../../../components/admin/footer/Footer";
import useISPowner from "../../../hooks/useISPOwner";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomer,
  getNetworkDiagramDevice,
} from "../../../features/apiCalls";
import PlayTutorial from "../../tutorial/PlayTutorial";
import { PlayBtn } from "react-bootstrap-icons";

const Diagram = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const svgRef = useRef(null);
  const gRef = useRef(null);

  // Devices
  const device = {
    mikrotik: "Mikrotik",
    olt: "OLT",
    switch: "Switch",
    splitter: "Splitter",
    onu: "ONU",
  };

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId } = useISPowner();

  // Get Network device and customer diagram from redux store
  const diagrams = useSelector((state) => state.network?.diagram);

  // Get all customer from redux store
  const customers = useSelector((state) => state.customer.customer);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Modal handle state
  const [show, setShow] = useState(false);
  const [modalStatus, setModalStatus] = useState("");

  // Assign data update handler
  const [isUpdate, setIsUpdate] = useState(false);

  // Device Assign data state
  const [assignData, setAssignData] = useState({});

  useEffect(() => {
    Object.keys(diagrams).length === 0 &&
      getNetworkDiagramDevice(dispatch, ispOwnerId, setIsLoading);

    customers.length === 0 && getCustomer(dispatch, ispOwnerId, setIsLoading);
  }, [ispOwnerId]);

  // Single Customer find handler function
  const getSingleCustomerFind = (id) =>
    customers.find((customer) => customer.id === id) || "";

  useEffect(() => {
    const root = d3.hierarchy(diagrams);

    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = root.data.children ? 90 : 10;

    function getMaxDepth(root) {
      let maxDepth = 0;

      root.each((node) => {
        if (node.depth + 1 > maxDepth) {
          maxDepth = node.depth + 1;
        }
      });

      return maxDepth;
    }

    const maxDepth = getMaxDepth(root);

    const baseNodeWidth = 250;
    const width = maxDepth * baseNodeWidth;

    const dx = 40;
    const dy = (width - marginLeft - marginRight) / (root.height + 1);

    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal = d3
      .linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x);

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr("style", "height: 85vh; font: 15px sans-serif; user-select: none;");

    const gLink = d3
      .select(gRef.current)
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 5)
      .attr("stroke-width", 2)
      .attr("stroke", "#80918d");

    const gNode = d3
      .select(gRef.current)
      .append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        gNode.attr("transform", event.transform);
        gLink.attr("transform", event.transform);
      });

    svg.call(zoom);

    function update(event, source) {
      const duration = event?.altKey ? 2500 : 500;
      const nodes = root.descendants().reverse();
      const links = root.links();

      tree(root);

      const height =
        root.descendants().reduce((max, d) => Math.max(max, d.x), 0) +
        marginTop +
        marginBottom;

      svg.transition().duration(duration).attr("height", height);

      const node = gNode.selectAll("g").data(nodes, (d) => d.id);
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        })
        .on("contextmenu", (event, d) => {
          event.preventDefault();
          if (!d._children) {
            if (d.data?.candidateType !== "onu") {
              setModalStatus("assignDevice");
              setAssignData(d.data);
              setShow(true);
              setIsUpdate(d.data?.children ? true : false);
            } else {
              toast.error("You do not update ONU");
            }
          } else {
            toast.error(
              "Already  There have children.You do not assign device"
            );
          }
        });

      nodeEnter.each(function (d) {
        const customer = getSingleCustomerFind(d.data?.customer);

        const selection = d3.select(this);
        const group = selection.append("g");
        group
          .append("circle")
          .attr("r", 2)
          .attr("fill", customer?.status === "active" ? "green" : "red")
          .attr("stroke-width", 1);

        if (d.data.output) {
          if (d.data.candidateType === "onu") {
            if (customer?.status === "active") {
              const svgIcon = group
                .append("svg")
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("width", 22)
                .attr("height", 22)
                .attr("fill", "green")
                .attr("stroke-width", 5)
                .attr("font-weight", "bold")
                .attr("x", -8)
                .attr("y", -13);

              svgIcon
                .append("path")
                .attr(
                  "d",
                  "M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049"
                );

              svgIcon
                .append("path")
                .attr(
                  "d",
                  "M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"
                );
            } else {
              const svgIcon = group
                .append("svg")
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("width", 22)
                .attr("height", 22)
                .attr("fill", "red")
                .attr("stroke-width", 5)
                .attr("font-weight", "bold")
                .attr("x", -8)
                .attr("y", -13);

              svgIcon
                .append("path")
                .attr(
                  "d",
                  "M10.706 3.294A12.6 12.6 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4q.946 0 1.852.148zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.45 8.45 0 0 1 3.51-1.27zm2.596 1.404.785-.785q.947.362 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.5 8.5 0 0 0-1.98-.932zM8 10l.933-.933a6.5 6.5 0 0 1 2.013.637c.285.145.326.524.1.75l-.015.015a.53.53 0 0 1-.611.09A5.5 5.5 0 0 0 8 10m4.905-4.905.747-.747q.886.451 1.685 1.03a.485.485 0 0 1 .047.737.52.52 0 0 1-.668.05 11.5 11.5 0 0 0-1.811-1.07M9.02 11.78c.238.14.236.464.04.66l-.707.706a.5.5 0 0 1-.707 0l-.707-.707c-.195-.195-.197-.518.04-.66A2 2 0 0 1 8 11.5c.374 0 .723.102 1.021.28zm4.355-9.905a.53.53 0 0 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75z"
                );
            }
          } else {
            selection
              .append("circle")
              .attr("r", 2)
              .attr("fill", "gray")
              .attr("stroke-width", 1);
          }
        } else {
          selection
            .append("circle")
            .attr("r", d.data.children ? 5 : 1.5)
            .attr("fill", "red")
            .attr("stroke-width", d.data.children ? 2 : 1)
            .attr("stroke", "green");
        }
      });

      nodeEnter
        .append("text")
        .attr("dy", (d) => (d.data.output ? "-1.2em" : "0.31em"))
        .attr("x", (d) => (d.data.output ? 10 : -10))
        .attr("text-anchor", (d) => (d.data.output ? "middle" : "end"))
        .attr("fill", "#333")
        .attr("font-size", (d) => (d.data.output ? "10px" : "12px"))
        .attr("font-weight", "bold")
        .text((d) =>
          d.data?.output
            ? `${device[d.data?.candidateType]} 1:${d.data?.output?.serial}-${
                d.data?.output?.portName
              }`
            : d.data?.candidateType
            ? `${device[d.data?.candidateType]} 1:${d.data?.children?.length} ${
                d.data?.device?.name
              }`
            : ""
        )
        .style("cursor", "pointer")
        .append("title")
        .text((d) => {
          if (d.data?.output) {
            if (d.data?.candidateType === "onu") {
              const customer = getSingleCustomerFind(d.data?.customer);
              return `Name: ${customer?.name}\nPayment Status: ${customer?.paymentStatus}\nLocation: ${d.data?.location}\nBrand: ${d.data?.device?.brand}\nModel: ${d.data?.device?.deviceModel}\nIP: ${d.data?.device?.ip}\nPower: ${d.data?.output?.portPower}%`;
            } else {
              return `Location: ${d.data?.location}\nBrand: ${d.data?.device?.brand}\nModel: ${d.data?.device?.deviceModel}\nIP: ${d.data?.device?.ip}\nPower: ${d.data?.output?.portPower}%`;
            }
          }
          return "";
        });

      node
        .merge(nodeEnter)
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

      node
        .exit()
        .transition()
        .duration(duration)
        .remove()
        .attr("transform", (d) => `translate(${source.y},${source.x})`);

      const link = gLink.selectAll("path").data(links, (d) => d.target.id);
      const linkEnter = link
        .enter()
        .append("path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        })
        .attr("stroke", (d) => d.target.data?.output?.color);

      link
        .merge(linkEnter)
        .transition()
        .duration(duration)
        .attr("d", (d) => diagonal(d));

      link
        .exit()
        .transition()
        .duration(duration)
        .remove()
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    root.x0 = dx / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
    });

    update(null, root);
  }, [diagrams]);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluid collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="component_name">{`${t("network")} ${t(
                    "diagram"
                  )}`}</div>

                  <div className="addAndSettingIcon">
                    <PlayBtn
                      className="addcutmButton"
                      onClick={() => {
                        setModalStatus("playTutorial");
                        setShow(true);
                      }}
                      title={t("tutorial")}
                    />
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="mt-2">
                  <svg ref={svgRef} width="100%" height="800">
                    <g ref={gRef}></g>
                  </svg>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      <AssignDevice show={show} setShow={setShow} data={assignData} />

      {/* tutorial play modal */}
      {modalStatus === "playTutorial" && (
        <PlayTutorial
          {...{
            show,
            setShow,
            video: "diagram",
          }}
        />
      )}
    </>
  );
};

export default Diagram;
