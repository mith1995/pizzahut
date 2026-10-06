import ProductCard from "../Products/ProductCard";
import PizzaInfo from "./PizzaInfo";

function PizzaDetailSection() {
  const pizzas = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 299,
      image: "img/9.jpg",
      description: "Classic pizza with fresh mozzarella and basil.",
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      price: 399,
      image: "img/10.jpg",
      description: "Loaded with pepperoni and mozzarella cheese.",
    },
    {
      id: 3,
      name: "BBQ Chicken Pizza",
      price: 449,
      image: "img/11.jpg",
      description: "Grilled chicken with smoky BBQ sauce.",
    },
  ];
  return (
    <section id="list" className="clearfix">
      <div className="container">
        <div className="row">
          <PizzaInfo />
          <br />
          <div className="list_detail_3 clearfix">
            <div className="col-sm-12">
              <h2 className="mgt">You might also like</h2>
            </div>
          </div>

          <div className="list_1 clearfix">
            {pizzas.map((pizza) => (
              <ProductCard key={pizza.id} product={pizza} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PizzaDetailSection;
