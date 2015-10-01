import xhr from './xhr';

const fetchData = (catalog) => xhr(`${catalog.url}`);

export default {
  fetchCatalogs() {
    return xhr('/api/catalog?query=a');
  },
  fetchCatalogData(catalog) {
    return xhr('/api/table?catalog='+catalog.name);
  }
};
