import { Knex } from "knex";
import Chance from "chance";
import { hashPassword } from "../hash";
import { logger } from "../logger";
import { randomHKID } from "../utils/hkid";

const chance = new Chance();

function getRandomNumber(size: number) {
    return Math.floor(Math.random() * size);
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    logger.info("SEED RUN PRE START");
    await knex("votes").del();
    await knex("poll_options").del();
    await knex("poll").del();
    await knex("users").del();

    // state default values
    logger.info("SEED RUN START");
    // store sample data for inserting into users
    let users: any[] = [];

    // store sample data for inserting into poll_options
    let poll_1_campaign_options: any[] = [];
    let poll_2_campaign_options: any[] = [];
    let poll_3_campaign_options: any[] = [];

    // store sample data for inserting into vote
    let poll_1_campaign_votes: any[] = [];
    let poll_2_campaign_votes: any[] = [];
    let poll_3_campaign_votes: any[] = [];

    let last_name = [
        "Au",
        "Chan",
        "Chen",
        "Chow",
        "Cheung",
        "Fung",
        "Hui",
        "Ko",
        "Kwong",
        "Lee",
        "Li",
        "Lo",
        "Leung",
        "Ma",
        "Tam",
        "Tse",
        "Ng",
        "Wong",
        "Wu",
    ];

    let poll_1_campaign_options_sample = [
        "Michael Jordan",
        "Kobe Bryant",
        "Leborn James",
        "Stephen Curry",
    ];

    let poll_2_campaign_options_sample = [
        "Carrie Lam",
        "John Tsang",
        "Rebecca Ip",
    ];

    let poll_3_campaign_options_sample = [
        "Javascript",
        "Python",
        "Go",
        "Java",
        "Kotlin",
        "PHP",
        "C#",
        "Swift",
        "R",
        "Ruby",
    ];

    let poll_campaign = [
        {
            user_id: 1,
            title: "Who is the best NBA player in the history",
            start_time: '2019-01-01',
            end_time: '2019-01-31',
        },
        {
            user_id: 1,
            title: "Which HK CEO candidate you are preferred.",
            start_time: '2019-01-01',
            end_time: '2019-01-31',
        },
        {
            user_id: 1,
            title: "Best Programming Languages to Learn in 2022",
            start_time: "2021-12-01",
            end_time: "2022-04-30",
        },
    ]

    // Inserts seed entries

    users.push({
        last_name: "admin",
        hkid: randomHKID(),
        password: await hashPassword("adminpass"),
        phone: chance.integer({ min: 60000000, max: 69999999 }),
    });

    //generate 10000 nos.of user
    for (let i = 0; i < 100; i++) {
        users.push({
            last_name: last_name[getRandomNumber(last_name.length)],
            hkid: randomHKID(),
            password: await hashPassword("abc123"),
            phone: chance.integer({ min: 90000000, max: 99999999 }),
        });
    }

    const sampleUserId = await knex
        .insert(users)
        .into("users")
        .returning("*");
    const userId = sampleUserId.map((obj) => obj.id);
    logger.info("generate users data COMPLETED");


    const samplePollId = await knex
        .insert(poll_campaign)
        .into("poll")
        .returning("*");
    const pollId = samplePollId.map((obj) => obj.id);
    logger.info("generate poll campaign data COMPLETED");

    poll_1_campaign_options_sample.map((str) => {
        poll_1_campaign_options.push({
            poll_id: pollId[0],
            name: str,
        })
    })
    poll_2_campaign_options_sample.map((str) => {
        poll_2_campaign_options.push({
            poll_id: pollId[1],
            name: str,
        })
    })
    poll_3_campaign_options_sample.map((str) => {
        poll_3_campaign_options.push({
            poll_id: pollId[2],
            name: str,
        })
    })

    const poll_1_options_id = await knex
        .insert(poll_1_campaign_options)
        .into("poll_options")
        .returning("*");
    const poll1OptionsId = poll_1_options_id.map((obj) => obj.id);
    const poll_2_options_id = await knex
        .insert(poll_2_campaign_options)
        .into("poll_options")
        .returning("*");
    const poll2OptionsId = poll_2_options_id.map((obj) => obj.id);
    const poll_3_options_id = await knex
        .insert(poll_3_campaign_options)
        .into("poll_options")
        .returning("*");
    const poll3OptionsId = poll_3_options_id.map((obj) => obj.id);

    let poll_campaign_1_users = userId.slice();
    let poll_campaign_2_users = userId.slice();
    let poll_campaign_3_users = userId.slice();

    // remove vote from admin account
    poll_campaign_1_users.splice(0, 1);
    poll_campaign_2_users.splice(0, 1);
    poll_campaign_3_users.splice(0, 1);

    poll_campaign_1_users.map((user) => {
        poll_1_campaign_votes.push({
            user_id: user,
            poll_options_id: poll1OptionsId[getRandomNumber(poll1OptionsId.length)],
        })
    });
    poll_campaign_2_users.map((user) => {
        poll_2_campaign_votes.push({
            user_id: user,
            poll_options_id: poll2OptionsId[getRandomNumber(poll2OptionsId.length)],
        })
    });
    poll_campaign_3_users.map((user) => {
        poll_3_campaign_votes.push({
            user_id: user,
            poll_options_id: poll3OptionsId[getRandomNumber(poll3OptionsId.length)],
        })
    });

    await knex("votes")
        .insert(poll_1_campaign_votes)
        .returning("id");
    await knex("votes")
        .insert(poll_2_campaign_votes)
        .returning("id");
    await knex("votes")
        .insert(poll_3_campaign_votes)
        .returning("id");

    logger.info("KNEX SEED RUN COMPLETED");
};
