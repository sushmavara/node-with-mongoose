const get404Page = (req, res, next) => {
  // !using EJS which is high moving
  res.render("./admin/404.ejs", {
    pageTitle: "Page Not Found",
    activeTab: undefined,
  });
};

module.exports = {
  get404Page,
};
