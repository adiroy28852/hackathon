import { Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Urls } from "../../constant/Urls";
import AuthContext from "../../contexts/auth.context";
import AuthCookies from "../../services/cookie/authToken.cookie";

const Navbar = () => {
  const { isLoggedInUser, setIsLoggedInUser } = useContext(AuthContext); // Get auth state and updater from context
  const navigate = useNavigate(); // Hook for navigation
  const [currentSelectedNavItem, setCurrentSelectedNavItem] = useState(null); // State for currently selected nav item
  const location = useLocation(); // Hook for current location

  const [navItems, setNavItems] = useState(Initial_Nav_Items); // State for navigation items

  useEffect(() => {
    // Filter and set navigation items based on login status
    setNavItems(
      Initial_Nav_Items.filter((item) => {
        if (isLoggedInUser) {
          return item.showAfterLogin; // Show items for logged-in users
        }
        return !item.isProtected; // Show items for non-logged-in users
      })
    );

    if (isLoggedInUser) {
      // Add a Logout item for logged-in users
      setNavItems((prev) => [
        ...prev,
        {
          label: (
            <div
              onClick={() => {
                AuthCookies.ClearAll(); // Clear auth cookies
                setIsLoggedInUser(null); // Update auth state to logged out
                navigate(Urls.Login()); // Navigate to login page
              }}
              className="px-4"
            >
              Logout
            </div>
          ),
          style: { marginLeft: "auto" }, // Align logout to the right
          key: "/logout",
          isProtected: true,
          showAfterLogin: true,
        },
      ]);
    }
  }, [isLoggedInUser]); // Re-run effect when auth state changes

  useEffect(() => {
    // Set the current selected nav item based on the current path
    const path = location.pathname;
    const navItem = Initial_Nav_Items.find((item) => path === item.key);
    if (navItem) {
      setCurrentSelectedNavItem([navItem.key]);
    }
  }, [location.pathname, isLoggedInUser]); // Re-run effect when location or auth state changes

  return (
    <header className="border-b border-gray-300">
      <div className="container mx-auto mt-3">
        <Menu
          mode="horizontal"
          selectedKeys={currentSelectedNavItem}
          items={navItems}
          className="border-b-0"
        />
      </div>
    </header>
  );
};

export default Navbar;

// Initial navigation items
const Initial_Nav_Items = [
  {
    label: (
      <Link to={Urls.Home()} className="p-4">
        Home
      </Link>
    ),
    key: Urls.Home(),
    isProtected: false, // Publicly accessible
    showAfterLogin: true, // Show after login
  },
  {
    label: (
      <Link to={Urls.Mcqs.Mcqs()} className="p-4">
        Mcqs
      </Link>
    ),
    key: Urls.Mcqs.Mcqs(),
    isProtected: true, // Protected route
    showAfterLogin: true, // Show after login
  },
  {
    label: (
      <Link to={Urls.Login()} className="p-4">
        Login
      </Link>
    ),
    key: Urls.Login(),
    style: { marginLeft: "auto" }, // Align to the right
    isProtected: false, // Publicly accessible
    showAfterLogin: false, // Hide after login
  },
  {
    label: (
      <Link to={Urls.Signup()} className="p-4">
        Signup
      </Link>
    ),
    key: Urls.Signup(),
    isProtected: false, // Publicly accessible
    showAfterLogin: false, // Hide after login
  },
];
