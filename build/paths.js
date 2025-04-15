const path = require("path");

const PUBLIC_DIR = path.resolve(__dirname, "../public");
const DIST_DIR = path.resolve(__dirname, "../dist");
const SRC_DIR = path.resolve(__dirname, "../src");

const Components = path.resolve(SRC_DIR, "components");
const App = path.resolve(SRC_DIR, "app");
const Pages = path.resolve(SRC_DIR, "pages");
const Utilities = path.resolve(SRC_DIR, "utilities/");
const Services = path.resolve(SRC_DIR, "services");
const State = path.resolve(SRC_DIR, "state");
const Constants = path.resolve(SRC_DIR, "utilities/constants");
const Hooks = path.resolve(SRC_DIR, "hooks");
const Routes = path.resolve(SRC_DIR, "routes")

module.exports = {
  PUBLIC_DIR,
  DIST_DIR,
  SRC_DIR,
  App,
  Components, 
  Utilities,
  Services,
  State,
  Constants,
  Pages,
  Hooks,
  Routes
};
