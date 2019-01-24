const POPULAR_REPORTS = ['corruption', 'election rigging', 'police extortion', 'power outage', 'flooding', 'abandoned projects', 'pipeline leakage', 'bad roads'];

function iteratePopularReports() {
  const len = POPULAR_REPORTS.length;
  let index = 1;
  setInterval(() => {
    Select('.hero h1 span').fadeOut(() => {
      $(this).text(POPULAR_REPORTS[index]).fadeIn(300);
    });
    index = index === len - 1 ? 0 : index + 1;
  }, 3000);
}

iteratePopularReports();
