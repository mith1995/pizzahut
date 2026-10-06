import Logo from "../common/Logo";

function AuthHeader() {
  return (
    <section id="menu" className="clearfix cd-secondary-nav">
      <nav className="navbar nav_t">
        <div className="container">
          <div className="navbar-header page-scroll">
            <button
              type="button"
              className="navbar-toggle"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Logo />
          </div>
        </div>
      </nav>
    </section>
  );
}

export default AuthHeader;
