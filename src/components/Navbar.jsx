import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import InputForm from './InputForm';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // **FIX 1**: Correctly determine the initial login state.
  // `!!token` converts the token string (or null) to a true boolean.
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("token"));

  // This effect will re-check the login status whenever you navigate
  // or when the localStorage might have changed after login/logout.
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogin(!!localStorage.getItem("token"));
    };

    // Listen for changes to localStorage from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on component mount/update
    handleStorageChange();

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Safely parse user data to prevent crashes. Prefix with underscore to
  // indicate the variable may be unused but intentionally kept.
  let _user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      _user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogin(false);
    navigate("/"); // Redirect to home page after logout
  };

  // NOTE: navigation guard logic is inlined on the NavLink onClick handlers
  // so the helper below was removed to avoid an unused-variable lint error.

  return (
    <>
      <header>
        <h2>Food Blog</h2>
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
          </li>

          {/* Protected links: use NavLink so active class works, but prevent navigation when not logged in */}
          <li>
            <NavLink
              to="/myRecipe"
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={(e) => { if (!isLogin) { e.preventDefault(); setIsOpen(true); } }}
            >
              My Recipe
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/favRecipe"
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={(e) => { if (!isLogin) { e.preventDefault(); setIsOpen(true); } }}
            >
              Favourites
            </NavLink>
          </li>

          {isLogin && (
            <li>
              <NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''}>
                Account
              </NavLink>
            </li>
          )}

          <li>
            {/* Login/Logout button */}
            <p className='login' onClick={isLogin ? handleLogout : () => setIsOpen(true)} style={{ cursor: 'pointer' }}>
              {isLogin ? "Logout" : "Login"}
            </p>
          </li>
        </ul>
      </header>
      {isOpen && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => { setIsOpen(false); setIsLogin(true); }} /></Modal>}
    </>
  );
}

// import React, { useEffect, useState } from 'react'
// import Modal from './Modal'
// import InputForm from './InputForm'
// import { NavLink } from 'react-router-dom'

// export default function Navbar() {
//   const [isOpen,setIsOpen]=useState(false)
//   let token=localStorage.getItem("token")
//   const [isLogin,setIsLogin]=useState(token ? false : true)
//   let user=JSON.parse(localStorage.getItem("user"))

//   useEffect(()=>{
//     setIsLogin(token ? false : true)
//   },[token])

//   const checkLogin=()=>{
//     if(token){
//       localStorage.removeItem("token")
//       localStorage.removeItem("user")
//       setIsLogin(true)

//     }
//     else{
//       setIsOpen(true)
//     }
//   }

//   return (
//     <>
//         <header>
//             <h2>Food Blog</h2>
//             <ul>
//                 <li><NavLink to="/">Home</NavLink></li>
//                 <li onClick={()=>isLogin && setIsOpen(true)}><NavLink to={ !isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink></li>
//                 <li onClick={()=>isLogin && setIsOpen(true)}><NavLink to={ !isLogin ? "/favRecipe" : "/"}>Favourites</NavLink></li>
//                 <li onClick={checkLogin}><p className='login'>{ (isLogin)? "Login": "Logout" }{user?.email ? `(${user?.email})` : ""}</p></li>
//             </ul>
//         </header>
//        { (isOpen) && <Modal onClose={()=>setIsOpen(false)}><InputForm setIsOpen={()=>setIsOpen(false)}/></Modal>}
//     </>
//   )
// }
