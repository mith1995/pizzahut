import { Link } from "react-router-dom";
import FallbackImage from "../../../components/common/FallbackImage";

const teamMembers = [
  {
    id: 1,
    name: "Semper Porta",
    role: "Co-Founder & CPO",
    image: "/img/29.jpg",
  },
  {
    id: 2,
    name: "Lorem Magnis",
    role: "Operating Officer",
    image: "/img/30.jpg",
  },
  {
    id: 3,
    name: "Dapibus Diam",
    role: "Staff Manager",
    image: "/img/31.jpg",
  },
  {
    id: 4,
    name: "Eget Nulla",
    role: "Animator",
    image: "/img/32.jpg",
  },
];

const socialLinks = [
  { icon: "fa-rss", className: "icoRss", title: "RSS" },
  { icon: "fa-facebook", className: "icoFacebook", title: "Facebook" },
  { icon: "fa-twitter", className: "icoTwitter", title: "Twitter" },
  { icon: "fa-google-plus", className: "icoGoogle", title: "Google+" },
  { icon: "fa-linkedin", className: "icoLinkedin", title: "LinkedIn" },
];

function TeamSection() {
  return (
    <section id="team">
      <div className="container">
        <div className="row">
          {/* Heading */}
          <div className="popular_1 text-center clearfix">
            <div className="col-sm-12">
              <h2 className="mgt">Meet The Team</h2>

              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
                <br />
                Lorem Ipsum has been the industry's standard dummy
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="team_1 clearfix">
            {teamMembers.map((member) => (
              <div className="col-sm-3" key={member.id}>
                <div className="team_1i text-center clearfix">
                  <Link>
                    <FallbackImage
                      src={member.image}
                      className="iw"
                      alt={member.name}
                    />
                  </Link>

                  <h4 className="col_2">{member.name}</h4>

                  <h6>{member.role}</h6>

                  <ul className="social-network social-circle">
                    {socialLinks.map((social) => (
                      <li key={social.title}>
                        <Link className={social.className} title={social.title}>
                          <i className={`fa ${social.icon}`}></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
