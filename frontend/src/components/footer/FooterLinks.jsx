import FooterLinkGroups from "./FooterLinkGroups";
import FooterSocial from "./FooterSocial";

function FooterLinks() {
  const footerGroups = [
    {
      title: "Information",
      links: [
        { label: "Home", to: "/" },
        { label: "Blog", to: "/blog" },
        { label: "About Us", to: "/about" },
        { label: "Menu", to: "/menu" },
        { label: "Contact Us", to: "/contact" },
      ],
    },
    {
      title: "Top Items",
      links: [
        { label: "Pepperoni", to: "/" },
        { label: "Swiss Mushroom", to: "/" },
        { label: "Chicken", to: "/" },
        { label: "Vegetarian", to: "/" },
        { label: "Ham & Cheese", to: "/" },
      ],
    },
    {
      title: "Others",
      links: [
        { label: "Checkout", to: "/checkout" },
        { label: "Cart", to: "/cart" },
        { label: "Products", to: "/" },
        { label: "Locations", to: "/" },
        { label: "Legal", to: "/" },
      ],
    },
  ];
  return (
    <div className="footer_1 clearfix">
      {footerGroups.map((group) => (
        <FooterLinkGroups
          key={group.title}
          title={group.title}
          links={group.links}
        />
      ))}

      <FooterSocial />
    </div>
  );
}

export default FooterLinks;
