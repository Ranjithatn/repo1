import React, { Fragment } from "react";
import Icon from "../Icon/Icon";
import { requestHistorySort } from "../../actions/jobs";
const Table = ({
  className,
  headers,
  requestAscSort,
  data,
  content,
  sortdata,
  requestHistorySort,
  formatMessage,
  disableSort,
}) => {

  // console.log("disableSort",disableSort);

  return (
    <table className={"table" + (className ? " " + className : "")}>
      <thead>
        <tr>
          {headers &&
            headers.length > 0 &&
            headers.map((name, i) => {
              let sorting = true;
              if ( disableSort && disableSort.indexOf(name) != -1 ) {
                sorting = false;
              }

              return (
                <Fragment key={i.toString()}>
                  <th>
                    {name}
                    { sorting &&
                    <Icon
                      icon="angle-up"
                      // onClick={sortdata }
                      onClick={() => {

                        if (sortdata === "job") {

                          requestAscSort({
                            jobsdata: data,
                            rowsdata: name,
                            sorttype: "asc",
                            formatMessage:formatMessage
                          });
                        } else if (sortdata === "history") {
                          requestHistorySort({
                            jobsdata: data,
                            rowsdata: name,
                            sorttype: "asc",
                            formatMessage:formatMessage
                          });
                        }
                      }}
                      // ()=> requestAscSort({
                      //   jobsdata:data,
                      //   rowsdata:name,
                      //   sorttype:"asc"
                      // })
                    />
                    }
                    { sorting &&
                    <Icon
                      icon="angle-down"
                      onClick={() => {
                        if (sortdata === "job") {
                          requestAscSort({
                            jobsdata: data,
                            rowsdata: name,
                            sorttype: "desc",
                            formatMessage:formatMessage
                          });
                        } else if (sortdata === "history") {
                          requestHistorySort({
                            jobsdata: data,
                            rowsdata: name,
                            sorttype: "desc",
                            formatMessage:formatMessage
                          });
                        }
                      }}
                    />
                    }
                  </th>
                </Fragment>
              );
            })}
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </table>
  );
};

export default Table;
