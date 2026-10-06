import OfferCard from "../../../components/cards/OfferCard";

function OfferSection() {
  const offers = [
    {
      id: 1,
      title: "Specialty",
      price: 9,
      image: "img/3.jpg",
    },
    {
      id: 2,
      title: "Vegetarian",
      price: 19,
      image: "img/4.jpg",
    },
    {
      id: 3,
      title: "Ham & Cheese",
      price: 15,
      image: "img/5.jpg",
    },
  ];
  return (
    <section id="offer">
      <div className="container">
        <div className="row">
          <div className="offer_1 clearfix">
            {offers.map((offer, index) => (
              <OfferCard key={offer.id} offer={offer} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OfferSection;
