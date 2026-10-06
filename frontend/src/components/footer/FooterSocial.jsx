function FooterSocial() {
  const socialLinks = [
    {
      icon: "fa-rss",
      title: "RSS",
      className: "icoRss",
      href: "#",
    },
    {
      icon: "fa-facebook",
      title: "Facebook",
      className: "icoFacebook",
      href: "#",
    },
    {
      icon: "fa-twitter",
      title: "Twitter",
      className: "icoTwitter",
      href: "#",
    },
    {
      icon: "fa-google-plus",
      title: "Google Plus",
      className: "icoGoogle",
      href: "#",
    },
    {
      icon: "fa-linkedin",
      title: "Linkedin",
      className: "icoLinkedin",
      href: "#",
    },
  ];

  return (
    <div className="col-sm-3">
      <div className="footer_1i2 clearfix">
        <h4 className="col">Social Media</h4>
        <ul className="social-network social-circle">
          {socialLinks.map((social) => (
            <li key={social.title}>
              <a
                href={social.href}
                className={social.className}
                title={social.title}
              >
                <i className={`fa ${social.icon}`}></i>
              </a>
            </li>
          ))}
        </ul>
        <p className="col_3 small_tag">
          Signup and get exclusive offers and coupon codes
        </p>
        <h6>
          <a className="button" href="#">
            SIGN UP
          </a>
        </h6>
      </div>
    </div>
  );
}

export default FooterSocial;
