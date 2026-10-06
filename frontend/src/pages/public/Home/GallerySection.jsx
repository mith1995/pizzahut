import GalleryImage from "./GalleryImage";

function GallerySection() {
  const galleryImages = [
    {
      id: 1,
      thumbnail: "/img/19.jpg",
      fullImage: "/img/19.jpg",
      alt: "Pepperoni Pizza",
      caption: "Freshly baked pepperoni pizza",
    },
    {
      id: 2,
      thumbnail: "/img/20.jpg",
      fullImage: "/img/20.jpg",
      alt: "Italian Pizza",
      caption: "Authentic Italian flavors",
    },
    {
      id: 3,
      thumbnail: "/img/21.jpg",
      fullImage: "/img/21.jpg",
      alt: "Restaurant Interior",
      caption: "Warm and welcoming ambiance",
    },
    {
      id: 4,
      thumbnail: "/img/22.jpg",
      fullImage: "/img/22.jpg",
      alt: "Restaurant Interior",
      caption: "Warm and welcoming ambiance",
    },
    {
      id: 5,
      thumbnail: "/img/23.jpg",
      fullImage: "/img/23.jpg",
      alt: "Restaurant Interior",
      caption: "Warm and welcoming ambiance",
    },
    {
      id: 6,
      thumbnail: "/img/24.jpg",
      fullImage: "/img/24.jpg",
      alt: "Restaurant Interior",
      caption: "Warm and welcoming ambiance",
    },
  ];
  return (
    <section id="gallery" className="clearfix">
      <div className="container">
        <div className="row">
          <div className="popular_1 text-center clearfix">
            <div className="col-sm-12">
              <h4 className="mgt col_1">Popular</h4>
              <h2>Our Gallery</h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
                <br />
                Lorem Ipsum has been the industry's standard dummy
              </p>
            </div>
          </div>
          <div className="gallery_1 clearfix">
            <div className="click clearfix">
              {galleryImages.map((image) => (
                <GalleryImage key={image.id} image={image} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
