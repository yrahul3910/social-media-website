import elasticsearch from 'elasticsearch';

const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});

// Index new object to ElasticSearch
exports.index = async(index, type, data) => {
    if (type === 'user') {
        await esClient.index({
            index,
            type,
            id: data.username,
            body: {
                name: data.name,
                username: data.username
            }
        });
    }
};

// Delete document from index
exports.deleteDoc = async(index, type, id) => {
    await esClient.delete({
        index,
        type,
        id
    });
};

// Search for documents
exports.search = async(index, type, body) => {
    const results = await esClient.search({
        index,
        type,
        body
    });
    return results;
};

module.exports = exports;
