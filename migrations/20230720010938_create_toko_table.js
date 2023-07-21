exports.up = function (knex) {
    return knex.schema.createTable('toko', (table) => {
        table.increments('id').primary();
        table.bigInteger('user_id').unsigned().notNullable(); // Gunakan tipe data bigint()
        table.string('nama_toko').notNullable();
        table.string('deskripsi_toko');
        table.string('logo');
        table.string('alamat');
        table.string('jam_operasi');
        table.timestamp('login_terakhir').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());

        // Foreign key constraint
        table.foreign('user_id').references('id').inTable('users');

        // Anda juga dapat menambahkan index pada kolom 'user_id' jika diperlukan
        // table.index('user_id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('toko');
};
