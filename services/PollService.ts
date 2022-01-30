import { Knex } from "knex";

export class PollService {
    constructor(private knex: Knex) {}
    
    getAllActivateCampaigns = async (offset: number = 0, limit: number = 10) => {
        try {
            const activateCampaigns = (await this.knex.raw(
                `select
                    distinct(select count(*) from votes join poll_options 
                    on poll_options.id = votes.poll_options_id where poll.id = poll_options.poll_id) as totalVote,
                    poll.title, poll.start_time, poll.end_time
                    from poll
                    join poll_options on poll.id = poll_options.poll_id
                    join votes on poll_options.id = votes.poll_options_id
                    where end_time > now()
                    order by totalVote desc
                    limit :limit offset :offset;`,
                    {limit, offset}
            )).rows
            return { success: true, data: activateCampaigns };
        } catch (error) {
            return { success: false };
        }
    }
    getAllEndedCampaigns = async (offset: number = 0, limit: number = 10) => {
        try {
            const endedCampaigns = (await this.knex.raw(
                `select
                    distinct(select count(*) from votes join poll_options 
                    on poll_options.id = votes.poll_options_id where poll.id = poll_options.poll_id) as totalVote,
                    poll.title, poll.start_time, poll.end_time
                    from poll
                    join poll_options on poll.id = poll_options.poll_id
                    join votes on poll_options.id = votes.poll_options_id
                    where end_time < now()
                    order by totalVote desc
                    limit :limit offset :offset;`,
                    {limit, offset}
            )).rows
            return { success: true, data: endedCampaigns };
        } catch (error) {
            return { success: false };
        }
    }
    getCampaignsById = async (pollId: number) => {
        try {
            const campaign = (await this.knex.raw(
                `select
                    distinct(select COUNT(*) from votes where poll_options.id = votes.poll_options_id) as vote_number,
                    poll.title, poll.start_time, poll.end_time,
                    poll_options.name
                    from poll 
                    join poll_options on poll.id = poll_options.poll_id
                    join votes on poll_options.id = votes.poll_options_id
                    where poll.id = :pollId;`,
                    {pollId}
            )).rows
            return { success: true, data: campaign };
        } catch (error) {
            return { success: false };
        }
    }
    postVote = async (userId: number, pollOptionId: number) => {
        try {
            await this.knex("votes").insert({
                user_id: userId,
                poll_options_id: pollOptionId
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}