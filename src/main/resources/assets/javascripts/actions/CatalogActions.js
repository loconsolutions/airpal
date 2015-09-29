import alt from '../alt';
import TableApiUtils from '../utils/CatalogApiUtils';
import logError from '../utils/logError'

class CatalogActions {
  constructor() {
    this.generateActions(
      'addCatalog',
      'removeCatalog',
      'selectCatalog',
      'unselectCatalog',
    );
  }

  fetchCatalogs() {
    CatalogApiUtils.fetchCatalogs().then((catalogs) => {
      this.dispatch(catalogs);
    }).catch(logError);
  }
}

export default alt.createActions(CatalogActions);
