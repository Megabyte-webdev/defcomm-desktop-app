import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function SideBarItem({ data, dispatch, state, setIsOpen }) {
  const navigate = useNavigate();
  const { setAuthDetails } = useContext(AuthContext);

  const navigateToPage = () => {
      dispatch({ ...data });
      navigate(data.route);

    setIsOpen(false);
  };

  const Component = data?.icon; // Extract the icon component

  return (
    <li
      onClick={navigateToPage}
      className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 group items-center p-3 font-medium ${
        state?.type === data?.type ? "bg-black text-olive" : "bg-none"
      }`}
    >
      <Link className="flex items-center gap-3">
        {Component && <Component className="text-xl" />} {/* Render icon here */}
        {data?.title}
      </Link>
    </li>
  );
}

export default React.memo(SideBarItem);
