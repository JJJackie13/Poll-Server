import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("poll_options", (table) => {
        table.increments();
        table.integer("poll_id").unsigned();
        table.foreign("poll_id").references("poll.id").onDelete("CASCADE");
        table.string("name");
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("poll_options");
}

