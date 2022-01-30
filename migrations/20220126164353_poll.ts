import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("poll", (table) => {
        table.increments();
        table.string("title");
        table.date("start_time");
        table.date("end_time");
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("poll");
}

