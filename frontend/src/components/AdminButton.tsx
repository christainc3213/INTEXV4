import { useNavigate } from "react-router-dom";

const AdminButton = (props: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleAdminClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <a className="admin-button" href="#" onClick={handleAdminClick}>
      {props.children}
    </a>
  );
};

export default AdminButton;
