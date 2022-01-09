import React from "react";
import { PersonPlusFill, GearFill } from "react-bootstrap-icons";

// internal imports
import "./collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";

export default function Collector() {
  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <h2 className="collectorTitle">Collector</h2>

              {/* Model start */}
              <div
                className="modal fade modal-dialog-scrollable "
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Modal title
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>
                        Lorem e, illo consectetur suscipit dolor totam
                        dignissimos temporibus consequuntur qui optio
                        praesentium corrupti deserunt odio quisquam nulla
                        dolorem quia repudiandae reiciendis! Expedita
                        perferendis est optio asperiores maiores, blanditiis vel
                        soluta rem, quisquam, nulla velit voluptates ducimus
                        recusandae aperiam doloremque unde temporibus nam
                        voluptas id consectetur natus? Soluta eius, illo tenetur
                        minima veniam architecto tempore laborum sed similique
                        dolorem accusamus. perferendis suscipit nobis fugiat!
                        Magnam fuga mollitia doloribus, ipsa voluptatibus odit
                        praesentium, quidem maxime id libero et quibusdam
                        nesciunt deleniti ex obcaecati, placeat in. Quo
                        repellendus nihil nemo, facere quos, cupiditate sed
                        aspernatur ea nesciunt velit, ullam totam ad. Corporis
                        impedit error alias cupiditate eius cumque voluptatem
                        sunt architecto. Voluptatum amet at sequi ea ut sapiente
                        et reprehenderit eligendi, maiores eius impedit
                        explicabo reiciendis, similique temporibus inventore
                        eaque quaerat dicta doloribus. Accusantium ipsa totam
                        aliquid sapiente perspiciatis pariatur iusto distinctio
                        cum officiis, nam debitis unde corrupti iure labore
                        error! Eius sapiente corrupti libero itaque qui maxime.
                      </p>
                      {/* model body here */}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button type="button" className="btn btn-success">
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>Add new collector</p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        />
                        <GearFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        />
                      </div>
                    </div>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          Total Collector : <span>34</span>{" "}
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="Search"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th scope="col">First</th>
                          <th scope="col">Second</th>
                          <th scope="col">Last</th>
                          <th scope="col">Handle</th>
                          <th scope="col">bundle</th>
                          <th scope="col">Thandle</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
