import logo from "./logo.png";

function Logo (props) {
  return (
    <img
      {...props}
      src={logo}
      alt="The Web Dev Game Logo"
    />
  );
}

export default Logo;