import xhr from './xhr';

const fetchColumData = (table) => xhr(`${table.url}/columns?catalog=${table.catalog}`);

const fetchPreviewData = (table, partition = {}) => {
  let url = `${table.url}/preview?catalog=${table.catalog}`;
  if (partition.name && partition.value) {
    url += '?' +
      `partitionName=${partition.name}&` +
      `partitionValue=${partition.value}`;
  }

  return xhr(url);
};

const fetchPartitionData = (table) => xhr(`${table.url}/partitions?catalog=${table.catalog}`);

export default {
  fetchTableData(table) {
    return Promise.all([
      fetchColumData(table),
      fetchPreviewData(table),
      fetchPartitionData(table)
    ]).then(([columns, data, partitions]) => {
      return { table, columns, data, partitions };
    });
  },

  fetchTablePreviewData(table, partition) {
    return fetchPreviewData(table, partition).then((data) => {
      return { table, partition, data };
    });
  },

  fetchTables() {
    return xhr('/api/table?query=a');
  }
};
