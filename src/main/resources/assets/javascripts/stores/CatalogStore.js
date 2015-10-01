import FQN from '../utils/fqn';
import CatalogActions from '../actions/CatalogActions';
import _ from 'lodash';
import alt from '../alt';

class CatalogStore {
  constructor() {
    this.bindListeners({
      onAddCatalog: CatalogActions.ADD_CATALOG,
      onRemoveCatalog: CatalogActions.REMOVE_CATALOG,
      onSelectCatalog: CatalogActions.SELECT_CATALOG,
      onUnselectCatalog: CatalogActions.UNSELECT_CATALOG,
      onFetchCatalogs: CatalogActions.FETCH_CATALOGS
    });

    this.exportPublicMethods({
      getActiveCatalog: this.getActiveCatalog,
      getAll: this.getAll,
      containsCatalog: this.containsCatalog,
      getSelectedCatalog: this.getSelectedCatalog,
    });

    this.catalogs = [];
    this.activeCatalogs = null;
  }

  getByName(name) {
    if (_.isEmpty(this.catalogs)) {
      return undefined;
    }

    return _.find(this.catalogs, { name });
  }

  unmarkActiveCatalogs() {
    this.catalogs.forEach((catalog) => {
      if (catalog.active) {
        // Change the active state of the table
        catalog.active = false;
      }
    });

    this.activeCatalog = null;
  }

  unmarkActive(name) {
    let catalog = this.getByName(name);

    if (catalog === undefined) {
      return;
    }

    catalog.active = false;

    this.activeCatalog = null;
  }

  markActive(name) {
    // Unmark the whole collection first
    this.unmarkActiveCatalogs()

    // Mark the table as active
    let catalog = this.getByName(name);

    if (!catalog) {
      return;
    }
    catalog.active = true;
    this.activeCatalog = catalog;
  }

  onAddCatalog(catalog) {
    if (this.getByName(catalog.name) !== undefined) {
      return;
    }

    // Unmark the whole collection
    this.unmarkActiveCatalogs();

    // Enrich the table with some extra data (active status and url)
    catalog = _.extend(catalog, {
      active: true,
      url: `./api/catalog`,
    });

    // Add the table to the collection
    this.catalogs.length = 0;
    this.catalogs.push(catalog);

    CatalogActions.fetchCatalog(catalog);
  }

  onRemoveCatalog(name) {
    let catalog = this.getByName(name);

    if (catalog === undefined) {
      return;
    }

    this.unmarkActiveCatalogs();

    // Remove the table from the collection
    this.catalogs = _.reject(this.catalogs, { name });

    // Check or we can make an other table active
    if (this.catalogs.length > 0) {
      this.markActive(catalog.name);
    }
  }

  onSelectCatalog(name) {
    this.markActive(name);
  }

  onUnselectCatalog(name) {
    this.unmarkActive(name);
  }

  onFetchCatalogs(catalogs) {
    this.catalogs = catalogs;
  }

  getAll() {
    return this.catalogs;
  }

  getActiveCatalog() {
    return this.getState().activeCatalog;
  }

  getSelectedCatalog() {
    return _.first(this.getActiveCatalog());
  }

  containsCatalog(name) {
    let { catalogs } = this.getState();

    return !!_.find(catalogs, { name: name });
  }
}

export default alt.createStore(CatalogStore, 'CatalogStore');
