import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import React, { useContext, useEffect, useState } from "react";
import {
  getWeatherAndLocation,
  locationData,
  parseWeatherData,
} from "../../utils/WeatherApi";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";

import "./App.css";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import AddItemModal from "../AddItemModal/AddItemModal";
import Profile from "../Profile/Profile";
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal";
import { getItems, postItems, deleteItems } from "../../utils/api";

// import login and register modals here
import Register from "../RegisterModal/RegisterModal";
import Login from "../LoginModal/LoginModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import { CurrentUserContext } from "../../contexts/CurrentUserContext";
// import { authorize, register } from "../../utils/auth";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedcard, setSelectedCard] = useState({});
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  // change setLoggedIn to isLoggedIn eventually

  const [currentUser, setCurrentUser] = React.useState({ name: "" });

  // change use state on current user to null instead of {}

  const handleCreateModal = () => {
    setActiveModal("create");
  };
  const handleCloseModal = () => {
    setActiveModal("");
  };
  const handleSelectedCard = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };
  const handleDeleteOpenModal = () => {
    setActiveModal("delete");
  };
  const handleRegisterModal = () => {
    setActiveModal("register");
  };

  const handleDeleteCard = async () => {
    try {
      await deleteItems(selectedcard._id);
      console.log(selectedcard._id);
      setClothingItems((prevItems) =>
        prevItems.filter((item) => item._id !== selectedcard._id)
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const onAddItem = async (values) => {
    try {
      const res = await postItems(values);
      setClothingItems((prevItems) => [res, ...prevItems]);
      handleCloseModal();
    } catch (error) {
      console.error("Error on add item:", error);
    }
  };

  const handleToggleSwitchChange = () => {
    if (currentTemperatureUnit === "C") setCurrentTemperatureUnit("F");
    if (currentTemperatureUnit === "F") setCurrentTemperatureUnit("C");
  };
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!activeModal) return;
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains("modal")) {
        handleCloseModal();
      }
    };
    document.addEventListener("mousedown", handleOverlayClick);
    document.addEventListener("keydown", handleEscClose);
    return () => {
      document.removeEventListener("keydown", handleEscClose);
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [activeModal]);

  useEffect(() => {
    getWeatherAndLocation()
      .then((data) => {
        const temperature = parseWeatherData(data);
        const city = locationData(data);
        setTemp(temperature);
        setCity(city);
        // setType(parseWeatherType(data))
        // setTime(Date.now())
      })
      .catch((error) => {
        console.error("Error: An error occurred", error);
      });
  }, []);

  useEffect(() => {
    getItems()
      .then((items) => {
        setClothingItems(items);
      })
      .catch((error) => {
        console.error("Error: An error occurred", error);
      });
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ setCurrentUser, currentUser }}
      path="/profile"
      // setLoggedIn={setLoggedIn}
    >
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <Header
          onCreate={handleCreateModal}
          city={city}
          currentDate={currentDate}
          // setCurrentUser={currentUser}
          setLoggedIn={isLoggedIn}
        />

        <Switch>
          <ProtectedRoute isLoggedIn={isLoggedIn} path="/profile">
            <Profile
              onSelectCard={handleSelectedCard}
              clothingItems={clothingItems}
              onCreate={handleCreateModal}
            ></Profile>
          </ProtectedRoute>

          <Route path="/register">
            <Register
              onClose={handleCloseModal}
              onClick={handleRegisterModal}
              setLoggedIn={setLoggedIn}
            />
          </Route>

          <Route path="/login">
            <Login
              handleCloseModal={handleCloseModal}
              setLoggedIn={setLoggedIn}
              setCurrentUser={setCurrentUser}
            ></Login>
          </Route>

          <Route exact path="/">
            <Main
              weatherTemp={temp}
              onSelectCard={handleSelectedCard}
              setClothingItems={clothingItems}
            />
          </Route>
        </Switch>

        <Footer />
        {activeModal === "create" && (
          <AddItemModal
            handleCloseModal={handleCloseModal}
            setActiveModal={activeModal === "create"}
            onAddItem={onAddItem}
          />
        )}
        {activeModal === "preview" && (
          <ItemModal
            selectedCard={selectedcard}
            onClose={handleCloseModal}
            onClick={handleDeleteOpenModal}
          />
        )}
        {activeModal === "delete" && (
          <DeleteItemModal
            onClose={handleCloseModal}
            deleteCard={handleDeleteCard}
          />
        )}
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}
// withRouter(App)
export default App;
