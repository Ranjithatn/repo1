import React, { Fragment } from "react";
import Button from "../Button/Button";

const Pagination = ({
  className,
  pages,
  onClick,
  totalPages,
  currentPage,
  maxPages,
  nextPageText,
  prevPageText
}) => {
  return (
    <div
      className={"pagination" + (className ? ` ${className}` : "")}
      role="navigation"
      aria-label="pagination"
    >
      <a
        className="button pagination-previous"
        onClick={onClick}
        disabled={currentPage === 1}
        id={"Previous"}
      >
        { prevPageText }
      </a>
      <a
        className="button pagination-next"
        onClick={onClick}
        disabled={currentPage === totalPages}
        id={"Next Page"}
      >
        { nextPageText }
      </a>
      <ul className="pagination-list">
        {pages.map((page, i) => {
          return (
            <Fragment key={i.toString()}>
              <li>
                <a
                  onClick={onClick}
                  className={
                    "pagination-link" +
                    (page === currentPage ? " is-current" : "")
                  }
                  id={page}
                >
                  {page}
                </a>
              </li>
              {i === pages.length - 1 &&
                maxPages < totalPages &&
                currentPage !== totalPages && (
                  <li>
                    <a onClick={onClick} className="pagination-link">
                      ...
                    </a>
                  </li>
                )}
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default Pagination;
