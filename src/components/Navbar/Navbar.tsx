import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CreateEventTypes } from "../../pages/Admin/Dashboard/types";

const Navbar = ({
  setCreateEvent,
}: {
  setCreateEvent?: React.Dispatch<
    React.SetStateAction<CreateEventTypes | undefined>
  >;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.navbarContainer}>
        <p className={styles.navbarBrandingText}>Hoogo</p>
        <button
          className={styles.navbarCTAButton}
          onClick={() => {
            if (setCreateEvent) setCreateEvent({ name: "", showModal: true });
            else navigate("/login");
          }}
        >
          Create Hoogo
        </button>
      </div>
    </>
  );
};

export default Navbar;
