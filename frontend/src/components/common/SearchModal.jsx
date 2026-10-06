import { useEffect, useRef } from "react";

function SearchModal({ isOpen, onToggle }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutSide(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onToggle();
      }
    }

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [onToggle]);

  return (
    <>
      <li className="dropdown">
        <button type="button" className="m_tag search_btn" onClick={onToggle}>
          <i className="fa fa-search"></i>
        </button>
      </li>
      {isOpen && (
        <div className="modal fade in" style={{ display: "block" }}>
          <div className="modal-dialog" ref={modalRef}>
            <div className="modal-content">
              <div className="modal-body">
                <div className="input-group clearfix">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                  <span className="input-group-btn">
                    <button className="btn btn-primary" type="button">
                      <i className="fa fa-search"></i>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchModal;
