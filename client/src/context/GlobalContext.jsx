import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState([]);
  const [productInput, setProductInput] = useState({
    id: 0,
    name: "",
    price: 0,
    image: "",
    stock: 0,
    desc: "",
  });
  const [preview, setPreview] = useState(null);

  const [userData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(-1);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isSignUpModal, setIsSignUpModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [input, setInput] = useState({
    name: "",
    password: "",
    email: "",
    image: "",
    role: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]:
        event.target.type === "file" ? event.target.files : event.target.value,
    });
    if (event.target.type === "file") {
      let url = URL.createObjectURL(event.target.files[0]);
      setPreview(url);
    }
  };

  const handleInputRegister = (event) => {
    setInput({
      ...input,
      [event.target.name]:
        event.target.type === "file" ? event.target.files : event.target.value,
    });
    if (event.target.type === "file") {
      let url = URL.createObjectURL(event.target.files[0]);
      setPreview(url);
    }
  };

  const handleDeleteCart = (event) => {
    let idData = parseInt(event.currentTarget.value);
    let filteredCart = cart.filter((item) => item.id !== idData);
    setCart(filteredCart);
  };

  let price = new Intl.NumberFormat("en-ID", {
    style: "currency",
    currency: "IDR",
  });

  // Functions for product
  const handleEdit = (event) => {
    let idData = parseInt(event.currentTarget.value);
    console.log(idData);
    navigate(`/admin/edit-product/${idData}`);
    const currentProduct = productData.filter(
      (product) => product.id === idData
    );
    console.log(currentProduct);
    console.log(productData);
    setProductInput({
      id: currentProduct[0].id,
      name: currentProduct[0].name,
      price: currentProduct[0].price,
      image: currentProduct[0].image,
      stock: currentProduct[0].stock,
      desc: currentProduct[0].desc,
    });
  };

  const handleDelete = (event) => {
    event.preventDefault();
    let idData = parseInt(event.currentTarget.value);
    setCurrentProductId(idData);

    let filteredArray = productData.filter((item) => item.id !== idData);
    setProductData(filteredArray);
    setCurrentProductId(-1);
  };

  const handleEditInput = (event) => {
    setProductInput({
      ...productInput,
      [event.target.name]:
        event.target.type === "file" ? event.target.files : event.target.value,
    });
    if (event.target.type === "file") {
      let url = URL.createObjectURL(event.target.files[0]);
      setPreview(url);
    }
  };

  let statesFromGlobalContext = {
    productData,
    setProductData,
    isModalVisible,
    setIsModalVisible,
    isLoginModal,
    setIsLoginModal,
    isSignUpModal,
    setIsSignUpModal,
    loginData,
    setLoginData,
    input,
    setInput,
    userData,
    setUserData,
    currentUserId,
    setCurrentUserId,
    productInput,
    preview,
    setPreview,
    setProductInput,
    currentUser,
    setCurrentUser,
  };

  let functionHandlers = {
    price,
    handleInput,
    handleInputRegister,
    handleEdit,
    handleEditInput,
    handleDelete,
    handleDeleteCart,
  };

  return (
    <GlobalContext.Provider
      value={{ statesFromGlobalContext, functionHandlers }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
