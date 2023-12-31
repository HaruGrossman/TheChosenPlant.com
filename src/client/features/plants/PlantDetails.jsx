import { useNavigate, useParams } from "react-router-dom";
import { useGetPlantQuery } from "./plantSlice";
import Review from "./Review";
import "./plantDetails.less"

import NewFavoritePlant from "../favorites/NewFavoritePlant";
export default function Details() {

  const navigate = useNavigate();

  // // arrow function returnNavigate returns to search list
  const returnNavigate = () => {
    navigate("/search");
  };

  // arrow function createReview returns a popup window to create a review
  // ***Q will this need to be added to the plant API to save the review under each plant?
  // arrow function storeNavigate takes user to maps/nearme page
  const storeNavigate = () => {
    navigate("/maps");
  };
  // ***STRETCHGOAL will this onClick need to store params to be exported to the maps page?

  const { id } = useParams();
  const { data: plant, isLoading } = useGetPlantQuery(id);

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <main className="plant-details">
      <section className="mainDetails">
        <img id="plantimage" src={plant.image} />
        <section className="right-sideList">
          <h1>Common Name: {plant.name}</h1>
          <h2>Latin Name: {plant.latin}</h2>
          <h2>Ideal Light: {plant.ideallight}</h2>
          <h2>Tolerated Light: {plant.toleratedlight}</h2>
          <h2>Watering: {plant.watering}</h2>
          <h2>
            Temperature: {plant.tempmin}-{plant.tempmax}
          </h2>
          <h2>Category: {plant.category} </h2>
          <section className="favorite">
            <NewFavoritePlant />
          </section>
        </section>
      </section>
      <section className="plantDetail-buttons">
        {/* <button className="store-near-me" onClick={storeNavigate}>
          Stores Near Me
        </button> */}
        <button className="return-btn" onClick={returnNavigate}>
          Back to Search
        </button>

      </section>
      <section className="reviewSection">
        <Review plantId={id} />
      </section>
    </main>
  );
}
