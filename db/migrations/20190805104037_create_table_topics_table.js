
exports.up = function (knex, Promise) {
    console.log('creating topics table...')
    return knex.schema.createTable('topics', (topicsTable) => {
        topicsTable.string('slug').primary();
        topicsTable.string('description');
    })
};

exports.down = function (knex, Promise) {
    console.log('removing houses table')
    return knex.schema.dropTable('topics')
};
